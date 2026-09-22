import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from =
    process.env.RESEND_FROM_EMAIL ||
    "SmallBiz <onboarding@resend.dev>";

  const result = await resend.emails.send({
    from,
    to: email,
    subject: "Reset your SmallBiz password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #111827;">Reset your password</h1>

        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset your SmallBiz account password.
        </p>

        <p style="color: #4b5563; line-height: 1.6;">
          Click the button below to create a new password.
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background: #111827;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          This link will expire in 30 minutes.
        </p>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
          If you did not request a password reset, you can safely ignore
          this email.
        </p>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}