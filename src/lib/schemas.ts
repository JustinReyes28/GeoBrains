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

export const RegisterSchema = z
    .object({
        name: z.string().min(1, {
            message: "Name is required.",
        }),
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z
            .string()
            .min(8, {
                message: "Password must be at least 8 characters.",
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
