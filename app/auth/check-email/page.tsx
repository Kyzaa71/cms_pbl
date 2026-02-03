"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";

export default function CheckEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [email] = useState("uremail@gmail.com"); // This would come from props or context
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResendEmail = () => {
    // Redirect back to forgot-password to allow user to re-enter email
    // This is safer than auto-resending without verifying intent/captcha
    window.location.href = '/auth/forgot-password';
  };

  return (
    <Card className="auth-card border-0 shadow-2xl backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6 sm:p-8">
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

        <div className="text-center mb-8">
          {/* Gmail-style Email Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-yellow-400 to-green-400 rounded-2xl"></div>
            <Image
              src="/icon email.png"
              alt="Email Icon"
              width={32}
              height={32}
              className="relative z-10"
            />
          </div>
          
          <h1 className="auth-text text-3xl font-bold mb-4">
            Check Your Email
          </h1>
          <p className="auth-muted text-base leading-relaxed">
            We sent a password reset link to your email{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
              {email}
            </span>{" "}
            which is valid for 24 hours after receiving the email. Please check your inbox!
          </p>
        </div>

        <div className="space-y-4">
          <Button
            asChild
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v9.273L12 8.09l6.545 4.004V3.821h3.819c.904 0 1.636.732 1.636 1.636z"/>
              </svg>
              Open Gmail
            </a>
          </Button>

          <div className="text-center">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="auth-muted text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Don't receive the email? Click here to resend (Go back)"
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <a 
              href="/auth/login" 
              className="auth-muted inline-flex items-center text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:translate-x-[-2px] group"
            >
              <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Log In
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
