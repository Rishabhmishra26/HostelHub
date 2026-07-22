/**
 * AuthLayout.tsx
 * Shared centered-card wrapper for every auth screen
 * (login/register/otp/forgot/reset), so we don't repeat the same
 * "min-h-screen flex items-center justify-center" markup 5 times.
 */
import { ReactNode } from "react";
import { Building2 } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-card border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Building2 className="h-8 w-8 text-primary-500" />
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </main>
  );
}
