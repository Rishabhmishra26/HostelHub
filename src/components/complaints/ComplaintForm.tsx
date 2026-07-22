"use client";

/**
 * ComplaintForm.tsx
 * --------------------------------------------------------------
 * The "Register Complaint" form.
 *
 * Flow for the AI feature:
 *  1. Student types a rough description and clicks "Improve with AI".
 *  2. We POST that text to /api/ai/suggest.
 *  3. The suggested title/category/description are FILLED INTO
 *     the form fields (not auto-submitted!) so the student can
 *     still edit or reject them before hitting Submit.
 * --------------------------------------------------------------
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/complaints/ImageUploader";
import { complaintSchema, ComplaintInput } from "@/lib/validations/complaint";
import {
  HOSTELS, FLOOR_HOSTELS, BLOCK_HOSTELS, FLOORS, BLOCKS, COMPLAINT_CATEGORIES,
} from "@/lib/constants";

export default function ComplaintForm() {
  const router = useRouter();
  const [images, setImages] = useState<
    { url: string; publicId: string }[]
  >([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit, watch, setValue, formState: { errors, isSubmitting },
  } = useForm<ComplaintInput>({ resolver: zodResolver(complaintSchema) });

  const selectedHostel = watch("hostel");
  const description = watch("description");
  const showFloor = FLOOR_HOSTELS.includes(selectedHostel as any);
  const showBlock = BLOCK_HOSTELS.includes(selectedHostel as any);

  async function handleAiAssist() {
    if (!description || description.trim().length < 10) return;
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      });
      const data = await res.json();
      setValue("title", data.title);
      setValue("category", data.category);
      setValue("description", data.improvedDescription);
      setAiUsed(true);
    } finally {
      setIsAiLoading(false);
    }
  }

  async function onSubmit(values: ComplaintInput) {
    setServerError("");
    const res = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, images, aiAssisted: aiUsed }),
    });

    if (!res.ok) {
      const data = await res.json();
      setServerError(data.message || "Something went wrong. Please try again.");
      return;
    }

    const created = await res.json();
    router.push(`/student/complaints/${created._id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-4">
      <Select label="Hostel" {...register("hostel")} error={errors.hostel?.message}>
        <option value="">Select hostel</option>
        {HOSTELS.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </Select>

      {showFloor && (
        <Select label="Floor" {...register("floor")} error={errors.floor?.message}>
          <option value="">Select floor</option>
          {FLOORS.filter((f) => f !== 2).map((f) => (
            <option key={f} value={f}>Floor {f}</option>
          ))}
        </Select>
      )}

      {showBlock && (
        <Select label="Block" {...register("block")} error={errors.block?.message}>
          <option value="">Select block</option>
          {BLOCKS.map((b) => (
            <option key={b} value={b}>Block {b}</option>
          ))}
        </Select>
      )}

      <Input label="Room Number" placeholder="e.g. 214" {...register("roomNumber")} error={errors.roomNumber?.message} />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Complaint Description</label>
          <button
            type="button"
            onClick={handleAiAssist}
            disabled={isAiLoading}
            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline disabled:opacity-50"
          >
            <Sparkles className="h-3 w-3" />
            {isAiLoading ? "Thinking..." : "Improve with AI"}
          </button>
        </div>
        <Textarea
          placeholder="Describe the issue, e.g. 'My fan is making noise and not rotating properly.'"
          {...register("description")}
          error={errors.description?.message}
        />
        {aiUsed && (
          <p className="text-xs text-emerald-600">
            AI suggestion applied — feel free to edit the title, category, or description below.
          </p>
        )}
      </div>

      <Input label="Title" placeholder="Short summary" {...register("title")} error={errors.title?.message} />

      <Select label="Category" {...register("category")} error={errors.category?.message}>
        <option value="">Select category</option>
        {COMPLAINT_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>

      <ImageUploader
        onChange={setImages}
        onUploadingChange={setIsUploading}
      />

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <Button
        type="submit"
        isLoading={isSubmitting || isUploading}
        disabled={isUploading}
        className="mt-2 w-fit"
      >
        {isUploading ? "Uploading Images..." : "Submit Complaint"}
      </Button>
    </form>
  );
}
