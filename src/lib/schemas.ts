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

export const RegisterSchema = z.object({
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
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number.",
        }),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
