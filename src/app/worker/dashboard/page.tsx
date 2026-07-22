"use client";

/**
 * Worker Dashboard: lists complaints assigned to this worker,
 * split into simple sections by status.
 */
import { useComplaints } from "@/hooks/useComplaints";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";

export default function WorkerDashboard() {
  const { result, isLoading } = useComplaints({ page: 1 });
  const complaints = result?.data || [];

  const assigned = complaints.filter((c) => c.status === "Assigned");
  const inProgress = complaints.filter((c) => c.status === "In Progress");
  const completed = complaints.filter((c) => c.status === "Completed" || c.status === "Closed");

  return (
    <DashboardShell role="worker" title="My Assigned Complaints">
      {isLoading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState title="No complaints assigned yet" description="New assignments from the admin will show up here." />
      ) : (
        <div className="flex flex-col gap-8">
          <section>
            <CardTitle className="mb-3">Pending Work ({assigned.length})</CardTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {assigned.map((c) => <ComplaintCard key={c._id} complaint={c} basePath="/worker/complaints" />)}
            </div>
          </section>
          <section>
            <CardTitle className="mb-3">In Progress ({inProgress.length})</CardTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {inProgress.map((c) => <ComplaintCard key={c._id} complaint={c} basePath="/worker/complaints" />)}
            </div>
          </section>
          <section>
            <CardTitle className="mb-3">Completed Work ({completed.length})</CardTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {completed.map((c) => <ComplaintCard key={c._id} complaint={c} basePath="/worker/complaints" />)}
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
}
