"use client";

/**
 * useComplaints.ts
 * --------------------------------------------------------------
 * Small reusable hook that fetches a paginated/filtered list of
 * complaints from /api/complaints. Used by the student history
 * page, worker dashboard, and admin complaints table alike - one
 * hook, three different query params.
 * --------------------------------------------------------------
 */
import { useEffect, useState, useCallback } from "react";
import { Complaint, PaginatedResponse } from "@/types";

interface Filters {
  search?: string;
  status?: string;
  hostel?: string;
  category?: string;
  page?: number;
}

export function useComplaints(filters: Filters) {
  const [result, setResult] = useState<PaginatedResponse<Complaint> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status) params.set("status", filters.status);
    if (filters.hostel) params.set("hostel", filters.hostel);
    if (filters.category) params.set("category", filters.category);
    params.set("page", String(filters.page || 1));

    const res = await fetch(`/api/complaints?${params.toString()}`);
    const data = await res.json();
    setResult(data);
    setIsLoading(false);
  }, [filters.search, filters.status, filters.hostel, filters.category, filters.page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return { result, isLoading, refetch: fetchComplaints };
}
