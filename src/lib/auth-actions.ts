"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { RegisterSchema, LoginSchema } from "./schemas";
import { signIn } from "../auth";
import { AuthError } from "next-auth";
import { createVerificationToken, deleteVerificationToken, getVerificationTokenByEmail } from "./tokens";
import { sendVerificationEmail } from "./nodemailer";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            // emailVerified: new Date(), // Do not verify immediately
        },
    });

    // Generate verification token
    const verificationToken = await createVerificationToken(email);

    // Send verification email
    await sendVerificationEmail(
        verificationToken.identifier,
        verificationToken.token
    );

    return { success: "Confirmation email sent!" };
};

export const verifyEmail = async (email: string, code: string) => {
    const existingToken = await getVerificationTokenByEmail(email);

    if (!existingToken) {
        return { error: "Token not found!" };
    }

    if (existingToken.token !== code) {
        return { error: "Invalid code!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Code has expired!" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.identifier },
    });

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.identifier, // Update email just in case (though here it's the same)
        }
    });

    await deleteVerificationToken(existingToken.token);

    return { success: "Email verified!" };
};

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser && !existingUser.emailVerified && existingUser.password) {
        return { error: "Email not verified!" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/profile",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
};

export const resendVerificationCode = async (email: string) => {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!existingUser) {
        return { error: "Email not found!" };
    }

    if (existingUser.emailVerified) {
        return { error: "Email already verified!" };
    }

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        const now = new Date();
        const created = new Date(existingToken.expires.getTime() - 10 * 60 * 1000); // Inverse of expiry calculation
        const timeDiff = now.getTime() - created.getTime();

        // 10 minutes = 600000 ms
        if (timeDiff < 600000) {
            const minutesLeft = Math.ceil((600000 - timeDiff) / 60000);
            return { error: `Please wait ${minutesLeft} minutes before resending.` };
        }
    }

    const verificationToken = await createVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.identifier,
        verificationToken.token
    );

    return { success: "Resent verification code!" };
};
