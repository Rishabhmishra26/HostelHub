/**
 * validations/complaint.ts
 * --------------------------------------------------------------
 * Validates the "Register Complaint" form on both client & server.
 * --------------------------------------------------------------
 */
import { z } from "zod";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";

export const complaintSchema = z.object({
  hostel: z.string().min(1, "Select a hostel"),
  floor: z.coerce.number().optional(),
  block: z.string().optional(),
  roomNumber: z.string().min(1, "Room number is required"),
  category: z.enum(COMPLAINT_CATEGORIES, { errorMap: () => ({ message: "Select a valid category" }) }),
  title: z.string().min(3, "Title is too short").max(80, "Title is too long"),
  description: z.string().min(10, "Please describe the issue in a bit more detail"),
  images: z
  .array(
    z.object({
      url: z.string().url(),
      publicId: z.string(),
    })
  )
  .max(5, "You can upload up to 5 images")
  .optional(),
});

export type ComplaintInput = z.infer<typeof complaintSchema>;
