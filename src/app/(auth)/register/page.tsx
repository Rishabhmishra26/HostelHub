"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import AuthLayout from "@/components/layout/AuthLayout";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { HOSTELS, FLOOR_HOSTELS, BLOCK_HOSTELS, FLOORS, BLOCKS } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const selectedHostel = watch("hostel");
  const showFloor = FLOOR_HOSTELS.includes(selectedHostel as any);
  const showBlock = BLOCK_HOSTELS.includes(selectedHostel as any);

  async function onSubmit(values: RegisterInput) {
    setServerError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      setServerError(data.message || "Registration failed");
      return;
    }

    router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <AuthLayout title="Create your account" subtitle="Only official college email addresses are allowed">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Full Name" {...register("name")} error={errors.name?.message} />
        <Input label="College Email" placeholder="you@college.edu" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <Input label="Confirm Password" type="password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />

        <Select label="Hostel" {...register("hostel")} error={errors.hostel?.message}>
          <option value="">Select hostel</option>
          {HOSTELS.map((h) => <option key={h} value={h}>{h}</option>)}
        </Select>

        {showFloor && (
          <Select label="Floor" {...register("floor")} error={errors.floor?.message}>
            <option value="">Select floor</option>
            {FLOORS.filter((f) => f !== 2).map((f) => <option key={f} value={f}>Floor {f}</option>)}
          </Select>
        )}

        {showBlock && (
          <Select label="Block" {...register("block")} error={errors.block?.message}>
            <option value="">Select block</option>
            {BLOCKS.map((b) => <option key={b} value={b}>Block {b}</option>)}
          </Select>
        )}

        <Input label="Room Number" placeholder="e.g. 214" {...register("roomNumber")} error={errors.roomNumber?.message} />

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        <Button type="submit" isLoading={isSubmitting}>Register</Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account? <Link href="/login" className="text-primary-600 hover:underline">Login</Link>
      </p>
    </AuthLayout>
  );
}
