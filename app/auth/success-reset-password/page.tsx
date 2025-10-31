"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";

export default function SuccessResetPasswordPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="auth-card border-0 shadow-2xl backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6 sm:p-8 text-center">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {!mounted ? (
              <div className="w-5 h-5"></div>
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-blue-600" />
            )}
          </button>
        </div>

        {/* Success Icon - menggunakan image sebagai icon utama */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in animate-success-bounce overflow-hidden">
          <Image
            src="/success-reset-pass.png"
            alt="Password Reset Success"
            width={80}
            height={80}
            className="rounded-2xl object-cover"
          />
        </div>

        {/* Main Heading */}
        <h1 className="auth-text text-3xl font-bold mb-6 leading-tight animate-fade-in-up-delay-1">
          Your password has been<br />
          <span className="text-4xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            successfully reset
          </span>
        </h1>

        {/* Description */}
        <p className="auth-muted text-base leading-relaxed mb-8 max-w-sm mx-auto animate-fade-in-up-delay-2">
          You can log in with your new password. If you encounter any issues, please contact support!
        </p>

        {/* Login Now Button */}
        <Button
          asChild
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] mb-6 animate-fade-in-up-delay-3"
        >
          <a href="/auth/login" className="flex items-center justify-center group">
            <span>Login Now</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </Button>

        {/* Back to Login Link */}
        <div className="text-center animate-fade-in-up-delay-4">
          <a 
            href="/auth/login" 
            className="inline-flex items-center text-sm font-medium auth-muted hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:translate-x-[-2px] group"
          >
            <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to log In
          </a>
        </div>

      </CardContent>
    </Card>
  );
}
