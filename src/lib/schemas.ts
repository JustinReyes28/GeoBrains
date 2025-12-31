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

// ==========================================
// Admin/Country Schemas
// ==========================================

export const LocationNameSchema = z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-',.()]+$/, {
        message: "Name contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed."
    });

export const CountrySchema = z.object({
    name: LocationNameSchema,
    code: z.string().min(2, {
        message: "ISO code must be 2 characters.",
    }).max(2, {
        message: "ISO code must be 2 characters.",
    }),
    region: z.enum(["Africa", "Americas", "Asia", "Europe", "Oceania"], {
        message: "Please select a valid region.",
    }),
    centerLat: z.number({
        message: "Latitude must be a number.",
    }).refine(val => val >= -90 && val <= 90, {
        message: "Latitude must be between -90 and 90"
    }),
    centerLng: z.number({
        message: "Longitude must be a number.",
    }).refine(val => val >= -180 && val <= 180, {
        message: "Longitude must be between -180 and 180"
    }),
});

export const CapitalSchema = z.object({
    name: LocationNameSchema,
    countryId: z.string().min(1, {
        message: "Country is required.",
    }),
});

export const FamousPersonSchema = z.object({
    name: LocationNameSchema,
    country: LocationNameSchema,
    description: z.string().min(1, {
        message: "Description is required.",
    }),
    region: z.string().min(1, {
        message: "Region is required.",
    }),
    imageUrl: z.string().url({
        message: "Please enter a valid image URL.",
    }).optional().or(z.literal("")),
});

export const LandmarkSchema = z.object({
    name: LocationNameSchema,
    country: LocationNameSchema,
    description: z.string().optional().or(z.literal("")),
    imageUrl: z.string().url({
        message: "Please enter a valid image URL.",
    }).optional().or(z.literal("")),
    hints: z.array(z.string()).optional(),
});

export const CurrencySchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    symbol: z.string().min(1, {
        message: "Symbol is required.",
    }),
    country: z.string().min(1, {
        message: "Country is required.",
    }),
});

export const LanguageSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    country: z.string().min(1, {
        message: "Country is required.",
    }),
});
