"use client";

/**
 * ImageUploader.tsx
 * --------------------------------------------------------------
 * Lets a student pick 1-5 images, shows local previews instantly
 * (using `URL.createObjectURL`, no network call needed just to
 * preview), and converts each file to base64 so it can be posted
 * to /api/upload, which forwards it to Cloudinary.
 * --------------------------------------------------------------
 */
import { useState } from "react";
import { X, ImagePlus } from "lucide-react";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  onChange: (images: UploadedImage[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
  maxImages?: number;
}

export default function ImageUploader({
  onChange,
  onUploadingChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const remainingSlots = maxImages - previews.length;
    const selected = Array.from(files).slice(0, remainingSlots);

    setIsUploading(true);
    onUploadingChange?.(true);
    for (const file of selected) {
      const base64 = await fileToBase64(file);
      setPreviews((prev) => [...prev, base64]);

      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      setUploadedImages((prev) => {
        const next = [
          ...prev,
          {
            url: data.url,
            publicId: data.publicId,
          },
        ];

        onChange(next);
        return next;
      });
    }
    setIsUploading(false);
    onUploadingChange?.(false);
  }

  function removeImage(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onChange(next);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Upload Images (up to {maxImages})</label>
      <div className="flex flex-wrap gap-3">
        {previews.map((src, idx) => (
          <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-md border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`preview-${idx}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute right-0 top-0 rounded-bl-md bg-black/60 p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {previews.length < maxImages && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-300 text-slate-400 hover:border-primary-400 hover:text-primary-500">
            <ImagePlus className="h-5 w-5" />
            <span className="text-[10px]">{isUploading ? "Uploading..." : "Add"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
