/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail, EmailType } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email } = reqBody;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        // IMPORTANT SECURITY NOTE:
        // Do not reveal if an email exists in the database.
        // Always return a generic success message to prevent attackers from
        // figuring out which emails are registered with your service (email enumeration).
        if (!user) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            return NextResponse.json({
                message: "If an account with this email exists, a password reset link has been sent.",
            });
        }

        // Trigger the email sending process
        await sendEmail({
            email: user.email,
            emailType: EmailType.RESET,
            userId: user._id,
        });

        return NextResponse.json({
            message: "If an account with this email exists, a password reset link has been sent.",
            success: true,
        });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}