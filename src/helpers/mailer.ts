/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import crypto from 'crypto'; // Import the crypto module for secure token generation
import { Types } from 'mongoose';

// 1. Use an Enum for type safety to avoid errors from typos in strings.
export enum EmailType {
  VERIFY = 'VERIFY',
  RESET = 'RESET',
}

// 2. Define a clear interface for the function's parameters.
interface SendEmailParams {
  email: string;
  emailType: EmailType;
  userId: Types.ObjectId | string;
}

// 3. Create the transporter ONCE outside the function for performance.
//    This object will be reused for all emails, which is much more efficient.
const transporter = nodemailer.createTransport({
    // This configuration dynamically switches between development (e.g., Mailtrap)
    // and production (e.g., SendGrid, AWS SES) based on your environment variables.
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});


export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
  try {
    // 4. Generate a secure, random token. This is the correct approach.
    const plainToken = crypto.randomBytes(32).toString('hex');

    // 5. Hash the token for database storage. We use a deterministic hash (SHA256)
    //    so we can look it up later. THIS IS NOT the token we send in the email.
    const hashedToken = crypto
      .createHash('sha256')
      .update(plainToken)
      .digest('hex');

    // 6. Correct the token expiry time to 1 hour (3,600,000 milliseconds).
    const tokenExpiry = new Date(Date.now() + 3600000); 

    // 7. Update the user document with the HASHED token and expiry date.
    if (emailType === EmailType.VERIFY) {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: tokenExpiry,
      });
    } else if (emailType === EmailType.RESET) {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: tokenExpiry,
      });
    }
    
    // Determine the correct path and text based on the email type.
    const isVerification = emailType === EmailType.VERIFY;
    const subject = isVerification ? 'Verify Your Email Address' : 'Reset Your Password';
    const pagePath = isVerification ? 'verifyemail' : 'resetpassword';
    const linkText = isVerification ? 'verify your email' : 'reset your password';
    const buttonText = isVerification ? 'Verify Email' : 'Reset Password';

    // 8. Create the link with the PLAIN (unhashed) token. This is what the user clicks.
    const link = `${process.env.DOMAIN}/${pagePath}?token=${plainToken}`;

    // 9. Use a clean, readable HTML template.
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">${subject}</h2>
            <p>
                Please click the button below to ${linkText}. This link will expire in 1 hour.
            </p>
            <p style="margin: 25px 0;">
                <a 
                    href="${link}" 
                    target="_blank"
                    style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;"
                >
                    ${buttonText}
                </a>
            </p>
            <p>
                If the button above does not work, please copy and paste the following URL into your browser:
            </p>
            <p>
                <a href="${link}" target="_blank">${link}</a>
            </p>
            <hr>
            <p style="font-size: 12px; color: #777;">
                If you did not request this, you can safely ignore this email.
            </p>
        </div>
    `;

    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_FROM}>`, // A more professional "from" address
      to: email,
      subject: subject,
      html: htmlContent,
    };

    // Use the pre-configured transporter to send the mail
    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully! Message ID:", mailResponse.messageId);
    return mailResponse;

  } catch (error: any) {
    console.error('Error sending email:', error);
    // Throwing the error allows the calling function (e.g., your API route) to handle it.
    throw new Error(`Failed to send email: ${error.message}`);
  }
};