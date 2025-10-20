"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Set New Password</h1>
        <p className="text-gray-500 text-sm">
          Create a new password for your account.
        </p>
      </div>

      <form action="/login" className="space-y-4">
        <div className="relative">
          <label className="block text-sm mb-1 font-medium">
            New Password
          </label>
          <Input
            placeholder="Enter new password"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative">
          <label className="block text-sm mb-1 font-medium">
            Confirm Password
          </label>
          <Input
            placeholder="Confirm new password"
            type={showConfirm ? "text" : "password"}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          Update Password
        </Button>

        <p className="text-center text-sm text-gray-500">
          Back to{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
