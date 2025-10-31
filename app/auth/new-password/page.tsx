"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Lock, CheckCircle, Sun, Moon } from "lucide-react";

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  const passwordMatch = password && confirmPassword && password === confirmPassword;
  const passwordLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passwordStrength = [passwordLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  if (isSuccess) {
    // Redirect to success page
    window.location.href = '/auth/success-reset-password';
    return null;
  }

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
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="auth-text text-3xl font-bold mb-3">
            Set New Password
          </h1>
          <p className="auth-muted text-base leading-relaxed">
            Enter your new password below to complete the reset process. Ensure it's strong and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="auth-text block text-sm font-semibold mb-2">
              New Password
            </label>
            <div className="relative group">
              <Input
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input h-12 text-base border-2 rounded-xl transition-all duration-300 group-hover:border-gray-300 dark:group-hover:border-gray-500 pr-12"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < passwordStrength
                          ? passwordStrength <= 2
                            ? "bg-red-400"
                            : passwordStrength <= 3
                            ? "bg-yellow-400"
                            : "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Password strength: {passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong"}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="auth-text block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <div className="relative group">
              <Input
                placeholder="Enter your password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`auth-input h-12 text-base border-2 rounded-xl transition-all duration-300 group-hover:border-gray-300 pr-12 ${
                  confirmPassword && password
                    ? passwordMatch
                      ? "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                      : "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {confirmPassword && password && (
              <div className="flex items-center text-xs">
                {passwordMatch ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Passwords match
                  </div>
                ) : (
                  <div className="text-red-600">
                    Passwords do not match
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !passwordMatch || passwordStrength < 3}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Updating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Reset Password</span>
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </Button>

          <div className="text-center">
            <a 
              href="/auth/login" 
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-[-2px] group"
            >
              <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Log In
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
