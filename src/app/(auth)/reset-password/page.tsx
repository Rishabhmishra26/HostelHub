"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: searchParams.get("email") || "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    setServerError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setServerError(data.message || "Reset failed");
      return;
    }
    router.push("/login");
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter the OTP and your new password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="College Email" {...register("email")} error={errors.email?.message} />
        <Input label="OTP Code" maxLength={6} {...register("otp")} error={errors.otp?.message} />
        <Input label="New Password" type="password" {...register("newPassword")} error={errors.newPassword?.message} />
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <Button type="submit" isLoading={isSubmitting}>Reset Password</Button>
      </form>
    </AuthLayout>
  );
}
