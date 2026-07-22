"use client";

/**
 * Complaint History page: search, filter by status, paginate.
 */
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/ui/Select";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import { useComplaints } from "@/hooks/useComplaints";
import { COMPLAINT_STATUSES } from "@/lib/constants";

export default function ComplaintHistoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { result, isLoading } = useComplaints({ search, status, page });

  return (
    <DashboardShell role="student" title="Complaint History">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by ID, room, category..." />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-48">
          <option value="">All statuses</option>
          {COMPLAINT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : !result || result.data.length === 0 ? (
        <EmptyState title="No complaints found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {result.data.map((c) => (
              <ComplaintCard key={c._id} complaint={c} basePath="/student/complaints" />
            ))}
          </div>
          <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />
        </>
      )}
    </DashboardShell>
  );
}
