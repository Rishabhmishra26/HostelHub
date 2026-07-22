"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordInput) {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setMessage(data.message);
    setTimeout(() => router.push(`/reset-password?email=${encodeURIComponent(values.email)}`), 1200);
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="We'll email you a one-time code">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="College Email" {...register("email")} error={errors.email?.message} />
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        <Button type="submit" isLoading={isSubmitting}>Send OTP</Button>
      </form>
    </AuthLayout>
  );
}
