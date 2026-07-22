"use client";

/**
 * Student Dashboard
 * Shows quick stats (total/pending/resolved), a shortcut to
 * register a new complaint, and the most recent complaints.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { Complaint, PaginatedResponse } from "@/types";
import { FilePlus2 } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/complaints?pageSize=5")
      .then((res) => res.json())
      .then((data: PaginatedResponse<Complaint>) => setComplaints(data.data))
      .finally(() => setIsLoading(false));
  }, []);

  const total = complaints.length; // note: dashboard shows recent 5; full counts come from /student/complaints
  const pending = complaints.filter((c) => c.status === "Pending" || c.status === "Assigned" || c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Completed" || c.status === "Closed").length;

  return (
    <DashboardShell role="student" title="Dashboard">
      <Card className="mb-6 flex items-center justify-between">
        <div>
          <CardTitle>Welcome back, {user?.name?.split(" ")[0]} 👋</CardTitle>
          <p className="text-sm text-slate-500">Report an issue in your room or common area anytime.</p>
        </div>
        <Link href="/student/complaints/new">
          <Button className="gap-2"><FilePlus2 className="h-4 w-4" /> Register Complaint</Button>
        </Link>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Recent Complaints</p><p className="text-2xl font-bold">{total}</p></Card>
        <Card><p className="text-sm text-slate-500">Pending / In Progress</p><p className="text-2xl font-bold text-amber-600">{pending}</p></Card>
        <Card><p className="text-sm text-slate-500">Resolved</p><p className="text-2xl font-bold text-emerald-600">{resolved}</p></Card>
      </div>

      <CardTitle className="mb-3">Recent Activity</CardTitle>
      {isLoading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState title="No complaints yet" description="Register your first complaint to see it here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {complaints.map((c) => (
            <ComplaintCard key={c._id} complaint={c} basePath="/student/complaints" />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
