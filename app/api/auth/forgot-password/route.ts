import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Do not reveal whether an email exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists for this email, password reset instructions have been sent.",
      });
    }

    // Generate a secure random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving it to MongoDB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 30 minutes
    const resetTokenExpiry = new Date(
      Date.now() + 30 * 60 * 1000
    );

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpiry;

    await user.save();

    // Application URL
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    // Create reset link
    const resetUrl =
      `${appUrl}/reset-password?token=${resetToken}`;

    // Send reset email
    await sendPasswordResetEmail(email, resetUrl);

    console.log("Password reset email sent to:", email);

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for this email, password reset instructions have been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}