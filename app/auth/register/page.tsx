"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { RegisterSchema } from "@/src/lib/schemas";
import { register } from "@/src/lib/auth-actions";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        setSuccess(data.success);
                        // Optional: redirect to login after short delay
                        setTimeout(() => {
                            router.push("/auth/login");
                        }, 2000);
                    }
                })
                .catch((error: unknown) => {
                    console.error("Registration error:", error);
                    if (error instanceof Error) {
                        setError(error.message);
                    } else {
                        setError(typeof error === "string" ? error : "An unexpected error occurred during registration.");
                    }
                });
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
            <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gradient mb-2">
                            Create Account
                        </h1>
                        <p className="text-text-secondary">Join the global competition today</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                {...form.register("name")}
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                                placeholder="Your Name"
                            />
                            {form.formState.errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                {...form.register("email")}
                                type="email"
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                                placeholder="you@example.com"
                            />
                            {form.formState.errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    {...form.register("password")}
                                    type={showPassword ? "text" : "password"}
                                    disabled={isPending}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors p-1"
                                    disabled={isPending}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {form.formState.errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    {...form.register("confirmPassword")}
                                    type={showConfirmPassword ? "text" : "password"}
                                    disabled={isPending}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors p-1"
                                    disabled={isPending}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {form.formState.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {form.formState.errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 text-brand text-sm">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 px-4 bg-brand hover:bg-brand/90 text-white font-semibold rounded-lg shadow-lg shadow-brand/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-[0.98]"
                        >
                            {isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-brand hover:underline transition-colors font-medium"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
