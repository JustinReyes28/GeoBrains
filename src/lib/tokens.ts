import { prisma } from "./prisma";
import { randomInt } from "crypto";

export const generateVerificationCode = () => {
    // Generate a random 6-digit number between 100000 and 999999
    return randomInt(100000, 1000000).toString();
};

export const getVerificationTokenByToken = async (
    token: string
) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        });
        return verificationToken;
    } catch {
        return null;
    }
};

export const getVerificationTokenByEmail = async (
    email: string
) => {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { identifier: email }
        });
        return verificationToken;
    } catch {
        return null;
    }
};

export const createVerificationToken = async (email: string) => {
    const token = generateVerificationCode();
    // Set expiration to 10 minutes from now
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                token: existingToken.token,
            },
        }).catch(() => {
            // Handle case where delete might fail if record already gone (race condition)
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        }
    });

    return verificationToken;
};

export const deleteVerificationToken = async (token: string) => {
    try {
        await prisma.verificationToken.delete({
            where: {
                token
            }
        });
    } catch (error) {
        console.error("Failed to delete verification token:", error);
    }
};
