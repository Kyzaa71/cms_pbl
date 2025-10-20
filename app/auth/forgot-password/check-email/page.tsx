"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <Mail size={28} />
        </div>
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          We’ve sent a password reset link to your email address. Please check
          your inbox and follow the instructions to reset your password.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          asChild
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          <a href="/forgot-password/new-password">Open Reset Page</a>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <a href="/login">Back to Login</a>
        </Button>
      </div>
    </div>
  );
}
