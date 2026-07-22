"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { verifyOtpSchema, VerifyOtpInput } from "@/lib/validations/auth";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: searchParams.get("email") || "" },
  });

  async function onSubmit(values: VerifyOtpInput) {
    setServerError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      setServerError(data.message || "Verification failed");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 1500);
  }

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code we emailed you">
      {success ? (
        <p className="text-center text-sm text-emerald-600">Email verified! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="College Email" {...register("email")} error={errors.email?.message} />
          <Input label="OTP Code" maxLength={6} placeholder="123456" {...register("otp")} error={errors.otp?.message} />
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <Button type="submit" isLoading={isSubmitting}>Verify</Button>
        </form>
      )}
    </AuthLayout>
  );
}
