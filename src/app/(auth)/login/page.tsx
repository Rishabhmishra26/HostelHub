"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";

import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useAuth } from "@/context/AuthContext";

const ROLE_HOME: Record<string, string> = {
  student: "/student/dashboard",
  worker: "/worker/dashboard",
  admin: "/admin/dashboard",
};

// `useSearchParams()` opts a page out of static rendering unless it
// is wrapped in <Suspense>, so we export a thin wrapper as the
// default export and keep the real logic in `LoginForm` below.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginInput) {
    setServerError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      setServerError(data.message || "Login failed");
      return;
    }

    setUser(data.user);
    const redirectTo = searchParams.get("redirectTo");
    router.push(redirectTo || ROLE_HOME[data.user.role]);
  }

  return (
    <AuthLayout title="Login to HostelHub" subtitle="Use your official college email">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="College Email" placeholder="you@college.edu" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <Button type="submit" isLoading={isSubmitting}>Login</Button>
      </form>
      <div className="mt-4 flex justify-between text-sm text-slate-500">
        <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
        <Link href="/register" className="hover:underline">Create account</Link>
      </div>
    </AuthLayout>
  );
}
