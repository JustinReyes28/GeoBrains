"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { LoginSchema } from "@/src/lib/schemas";
import { login } from "@/src/lib/auth-actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    setError(data.error);
                }
                // If successful, NextAuth handles redirect via server action or we can force it
                // basic login action usually redirects on server, but let's handle client side if needed
            });
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                {...form.register("email")}
                                type="email"
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                placeholder="you@example.com"
                            />
                            {form.formState.errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                {...form.register("password")}
                                type="password"
                                disabled={isPending}
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                            {form.formState.errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
