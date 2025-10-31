"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease-out" }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative bg-[var(--card-bg-inner)] text-[var(--foreground)] border border-[var(--border)] rounded-xl shadow-xl p-6 w-full mx-4",
          sizeClasses[size],
          className
        )}
        style={{
          animation: "scaleIn 0.2s ease-out",
        }}
      >
        {/* Close Button */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-full p-1 hover:bg-[var(--card-bg)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-full p-1 hover:bg-[var(--card-bg)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

