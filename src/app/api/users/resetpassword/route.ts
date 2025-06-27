/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token, newPassword } = reqBody;

        if (!token || !newPassword) {
            return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
        }
        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        // Hash the incoming plain token to find it in the database
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user by the hashed token and ensure it's not expired
        const user = await User.findOne({
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired reset token. Please try again." }, { status: 400 });
        }

        // Hash the new password for secure storage
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Update user's password and clear the reset token fields
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Password has been reset successfully.",
            success: true,
        });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}