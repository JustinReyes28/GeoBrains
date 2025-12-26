"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { verifyEmail, resendVerificationCode } from "@/src/lib/auth-actions";

function VerifyEmailContent() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const [code, setCode] = useState("");

    // Cooldown state
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldown]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get("email");

    const onResend = useCallback(() => {
        if (isPending || cooldown > 0 || !email) return;

        setError("");
        setSuccess("");

        startTransition(() => {
            resendVerificationCode(email)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }
                    if (data.success) {
                        setSuccess(data.success);
                        setCooldown(600); // 10 minutes
                    }
                })
                .catch(() => {
                    setError("Something went wrong!");
                });
        });
    }, [email, isPending, cooldown]);

    const onSubmit = useCallback(() => {
        if (isPending) return;

        setError("");
        setSuccess("");

        if (!email) {
            setError("Missing email address!");
            return;
        }

        if (code.length < 6) {
            setError("Please enter a 6-digit code.");
            return;
        }

        startTransition(() => {
            verifyEmail(email, code)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }
                    if (data.success) {
                        setSuccess(data.success);
                        setTimeout(() => {
                            router.push("/auth/login");
                        }, 2000);
                    }
                })
                .catch(() => {
                    setError("Something went wrong!");
                });
        });
    }, [email, code, router, isPending]);

    // Cleanup code input to allow only numbers and limit to 6 digits
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
        setCode(value);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
            <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gradient mb-2">
                            Verify your email
                        </h1>
                        <p className="text-text-secondary">
                            We've sent a code to <span className="text-white font-medium">{email}</span>
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <input
                                type="text"
                                value={code}
                                onChange={handleCodeChange}
                                disabled={isPending}
                                className="w-full text-center text-4xl tracking-[1rem] font-bold py-4 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                                placeholder="000000"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 text-brand text-sm text-center">
                                {success}
                            </div>
                        )}

                        <button
                            onClick={onSubmit}
                            disabled={isPending || code.length < 6}
                            className="w-full py-3 px-4 bg-brand hover:bg-brand/90 text-white font-semibold rounded-lg shadow-lg shadow-brand/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-[0.98]"
                        >
                            {isPending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Verify Account"
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                onClick={onResend}
                                disabled={isPending || cooldown > 0}
                                className="text-sm text-brand hover:text-brand/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {cooldown > 0
                                    ? `Resend available in ${formatTime(cooldown)}`
                                    : "Resend Code"
                                }
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/auth/login"
                            className="text-sm text-text-secondary hover:text-white transition-colors"
                        >
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
