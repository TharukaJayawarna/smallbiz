import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const token = body.token?.trim();
    const password = body.password;

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    // Hash the token so it matches the value stored in MongoDB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid, non-expired reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // Invalidate the reset token after successful use
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}