"use client";

/**
 * Admin Complaints page: table view of ALL complaints with
 * search/filter/pagination and an "Assign Worker" dropdown.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/ui/Select";
import Pagination from "@/components/shared/Pagination";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useComplaints } from "@/hooks/useComplaints";
import { COMPLAINT_STATUSES, HOSTELS } from "@/lib/constants";
import { format } from "date-fns";

interface WorkerOption { _id: string; name: string; specialization: string; }

export default function AdminComplaintsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [hostel, setHostel] = useState("");
  const [page, setPage] = useState(1);
  const [workers, setWorkers] = useState<WorkerOption[]>([]);

  const { result, isLoading, refetch } = useComplaints({ search, status, hostel, page });

  useEffect(() => {
    fetch("/api/workers").then((res) => res.json()).then(setWorkers);
  }, []);

  async function assignWorker(complaintId: string, workerId: string) {
    if (!workerId) return;
    await fetch(`/api/complaints/${complaintId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId }),
    });
    refetch();
  }

  return (
    <DashboardShell role="admin" title="All Complaints">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search complaint ID, room..." />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-44">
          <option value="">All statuses</option>
          {COMPLAINT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select value={hostel} onChange={(e) => { setHostel(e.target.value); setPage(1); }} className="w-56">
          <option value="">All hostels</option>
          {HOSTELS.map((h) => <option key={h} value={h}>{h}</option>)}
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-card border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Hostel / Room</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assign Worker</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {result?.data.map((c) => (
                <tr key={c._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/admin/complaints/${c._id}`} className="font-medium text-primary-600 hover:underline">
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{typeof c.student === "object" ? c.student.name : "-"}</td>
                  <td className="px-4 py-3">{c.hostel} · {c.roomNumber}</td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3"><Badge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      defaultValue={typeof c.assignedWorker === "object" ? c.assignedWorker?._id : ""}
                      onChange={(e) => assignWorker(c._id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {workers.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{format(new Date(c.createdAt), "dd MMM yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {result && <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} />}
    </DashboardShell>
  );
}
