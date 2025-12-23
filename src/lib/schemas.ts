import { z } from "zod";

// ==========================================
// Authentication Schemas
// ==========================================

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

const DISPOSABLE_DOMAINS = [
    "tempmail.com", "throwawaymail.com", "guerrillamail.com", "10minutemail.com", "yopmail.com", "mailinator.com"
];

const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/;

export const RegisterSchema = z
    .object({
        name: z.string().min(1, {
            message: "Name is required.",
        }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }).refine((email) => {
            const domain = email.split('@')[1];
            return !DISPOSABLE_DOMAINS.includes(domain);
        }, {
            message: "Disposable email addresses are not allowed.",
        }),
        password: z
            .string()
            .min(12, {
                message: "Password must be at least 12 characters.",
            })
            .regex(passwordComplexityRegex, {
                message: "Password must contain uppercase, lowercase, number, and special character.",
            }),
        confirmPassword: z.string().min(1, {
            message: "Please confirm your password.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
