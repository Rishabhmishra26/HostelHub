/**
 * types/index.ts
 * --------------------------------------------------------------
 * Shared TypeScript types used across frontend components.
 * These mirror the Mongoose models but are the "plain object"
 * shape we get back from API responses (after JSON.stringify,
 * ObjectIds and Dates become strings).
 * --------------------------------------------------------------
 */
export type UserRole = "student" | "worker" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
}

export interface TimelineEntry {
  status: string;
  note?: string;
  timestamp: string;
}

export interface ComplaintImage {
  url: string;
  publicId: string;
}

export interface Complaint {
  _id: string;
  student: { _id: string; name: string; email: string; roomNumber: string } | string;
  hostel: string;
  floor?: number;
  block?: string;
  roomNumber: string;
  category: string;
  title: string;
  description: string;
  images: ComplaintImage[];
  completionImages: ComplaintImage[];
  status: string;
  assignedWorker?: { _id: string; name: string; specialization: string } | string;
  workerNotes?: string;
  timeline: TimelineEntry[];
  aiAssisted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
