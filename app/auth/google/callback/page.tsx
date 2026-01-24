"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function GoogleCallbackContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Get tokens from URL params (matches backend redirect format)
                const accessToken = searchParams.get("token");
                const refreshToken = searchParams.get("refreshToken");
                const error = searchParams.get("error");

                if (error) {
                    setStatus("error");
                    setMessage(error);
                    return;
                }

                if (accessToken) {
                    // Set the tokens
                    api.setToken(accessToken);
                    if (refreshToken && typeof document !== "undefined") {
                        try {
                            localStorage.setItem("refresh_token", refreshToken);
                        } catch { }
                    }

                    setStatus("success");
                    setMessage("Login berhasil! Mengalihkan...");

                    // Redirect to home after a brief delay
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                } else {
                    // No token found, might be a different callback format
                    // Try to check if there's a code that needs to be exchanged
                    const code = searchParams.get("code");
                    if (code) {
                        setStatus("error");
                        setMessage("Callback dengan code tidak didukung. Backend harus mengirim token langsung.");
                    } else {
                        setStatus("error");
                        setMessage("Token tidak ditemukan dalam response");
                    }
                }
            } catch (err) {
                setStatus("error");
                setMessage(err instanceof Error ? err.message : "Terjadi kesalahan saat login");
            }
        };

        processCallback();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8 text-center">
                    {status === "loading" && (
                        <>
                            <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Memproses Login...
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                Mohon tunggu sebentar
                            </p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Login Berhasil!
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                {message}
                            </p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Login Gagal
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {message}
                            </p>
                            <a
                                href="/auth/login"
                                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Kembali ke Login
                            </a>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardContent className="p-8 text-center">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Memuat...
                    </h2>
                </CardContent>
            </Card>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <GoogleCallbackContent />
        </Suspense>
    );
}
