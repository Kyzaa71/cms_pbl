"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Login</h1>
        <p className="text-gray-500 text-sm">
          Enter your email and password to access your account
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1 font-medium">Email</label>
          <Input placeholder="example@gmail.com" type="email" />
        </div>

        <div className="relative">
          <label className="block text-sm mb-1 font-medium">Password</label>
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <label className="flex items-center gap-1">
            <input type="checkbox" className="accent-blue-500" />
            Remember Me
          </label>
          <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
          Login
        </Button>

        <div className="text-center text-sm text-gray-500">or</div>

        <Button
          type="button"
          className="w-full bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </Button>

        <p className="text-center text-sm text-gray-500">
          Haven’t joined yet?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up today
          </a>
        </p>
      </form>
    </div>
  );
}
