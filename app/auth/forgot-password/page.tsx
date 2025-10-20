"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Forgot Password</h1>
        <p className="text-gray-500 text-sm">
          Enter your email to receive a password reset link.
        </p>
      </div>

      <form action="/forgot-password/check-email" className="space-y-4">
        <div>
          <label className="block text-sm mb-1 font-medium">Email</label>
          <Input
            placeholder="example@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </p>
      </form>
    </div>
  );
}
