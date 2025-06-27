/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import crypto from "crypto"; // 1. Import the crypto library

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        if (!token) {
            return NextResponse.json({ error: "Verification token is missing" }, { status: 400 });
        }

        console.log("Received plain token:", token);

        // 2. Hash the incoming plain token to match the one stored in the database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        
        // 3. Find the user using the HASHED token and check if the token is still valid (not expired)
        const user = await User.findOne({
            verifyToken: hashedToken,
            verifyTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired verification link. Please request a new one." }, { status: 400 });
        }

        console.log("User found for verification:", user.username);

        // Optional: Check if the user is already verified
        if (user.isVerified) {
             return NextResponse.json({ message: "This email has already been verified.", success: true });
        }

        // 4. Correct the property name (must match your schema, likely "isVerified")
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        
        await user.save();
        
        return NextResponse.json({
            message: "Email verified successfully!",
            success: true
        });

    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "An unexpected error occurred during verification." }, { status: 500 });
    }
}