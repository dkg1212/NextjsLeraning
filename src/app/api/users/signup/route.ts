/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// 1. Import the EmailType enum along with the sendEmail function
import { sendEmail, EmailType } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // 2. Add robust input validation
        if (!username || !email || !password) {
            return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
        }
        if (password.length < 6) {
             return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("New user saved:", savedUser._id);

        // 3. Use the EmailType enum for type safety
        await sendEmail({
            email,
            emailType: EmailType.VERIFY, // Using the enum is safer and more maintainable
            userId: savedUser._id,
        });

        // 4. Return a sanitized response. DO NOT send the full user object.
        return NextResponse.json({
            message: "User created successfully. Please check your email to verify your account.",
            success: true,
            // You can optionally return non-sensitive data like the user's ID or email
            user: {
                id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username
            }
        });

    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}