import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
    if (!cachedTransporter) {
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || "587");
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!host || !user || !pass) {
            throw new Error(
                "SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables."
            );
        }

        cachedTransporter = nodemailer.createTransport({
            host,
            port,
            secure: false, // true for 465, false for other ports
            auth: {
                user,
                pass,
            },
        });
    }

    return cachedTransporter;
}

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    // ALWAYS log the token in development so we can verify accounts
    // even without email (or if configs are missing)
    console.log("----------------------------------------------------");
    console.log(`📧 SENDING VERIFICATION EMAIL TO: ${email}`);
    console.log(`🔑 VERIFICATION TOKEN: ${token}`);
    console.log("----------------------------------------------------");

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Verify your GeoBrains email",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #1c73c4ff;">Verify your email</h1>
                <p>Thanks for starting the registration process. Here is your verification code:</p>
                <div style="background: #f4f4f5; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #18181b;">${token}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p style="color: #71717a; font-size: 14px; margin-top: 24px;">
                    If you didn't ask to verify this address, you can ignore this email.
                </p>
            </div>
        `,
    };

    try {
        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Failed to send verification email:", error);
        // Re-throw the error so callers can handle it
        throw error;
    }
};
