/**
 * Button.tsx
 * A single reusable button so every "Submit", "Cancel", "Save"
 * button in the app looks and behaves the same way.
 */
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<string, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          VARIANT_STYLES[variant],
          className
        )}
        {...props}
      >
        {isLoading ? "Please wait..." : children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
