"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Sign Up</h1>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1 font-medium">Full Name</label>
          <Input placeholder="Full Name" type="text" />
        </div>

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

        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            className="accent-blue-500"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree to CMS{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </label>

        <Button
          disabled={!agree}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          Sign Up
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>

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
      </form>
    </div>
  );
}
