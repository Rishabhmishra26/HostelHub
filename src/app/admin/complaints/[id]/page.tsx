"use client";

/**
 * Admin complaint detail: same info a student sees, plus an
 * admin-only "Close Complaint" and "Delete Spam Complaint" action.
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatusTimeline from "@/components/complaints/StatusTimeline";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Complaint } from "@/types";

export default function AdminComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function load() {
    fetch(`/api/complaints/${id}`).then((res) => res.json()).then(setComplaint).finally(() => setIsLoading(false));
  }
  useEffect(load, [id]);

  async function closeComplaint() {
    await fetch(`/api/complaints/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Closed", note: "Closed by admin" }),
    });
    load();
  }

  if (isLoading) return <DashboardShell role="admin" title="Complaint"><LoadingSpinner /></DashboardShell>;
  if (!complaint) return <DashboardShell role="admin" title="Complaint"><p>Complaint not found.</p></DashboardShell>;

  const student = typeof complaint.student === "object" ? complaint.student : null;
  const worker = typeof complaint.assignedWorker === "object" ? complaint.assignedWorker : null;

  return (
    <DashboardShell role="admin" title="Complaint Details">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <div className="mb-2 flex items-start justify-between">
              <CardTitle>{complaint.title}</CardTitle>
              <Badge status={complaint.status} />
            </div>
            <p className="mb-1 text-sm text-slate-500">
              {complaint.hostel} · Room {complaint.roomNumber} · {complaint.category}
            </p>
            {student && <p className="mb-4 text-sm text-slate-500">Reported by {student.name} ({student.email})</p>}
            <p className="text-sm text-slate-700">{complaint.description}</p>

            {complaint.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {complaint.images.map((img, i) => (
                  <div key={i} className="relative h-24 w-24 overflow-hidden rounded-md border border-slate-200">
                    <Image src={img.url} alt={`img-${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}


            {complaint.completionImages.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Completion Images (Uploaded by Worker)
                </p>

                <div className="flex flex-wrap gap-3">
                  {complaint.completionImages.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-24 w-24 overflow-hidden rounded-md border border-slate-200"
                    >
                      <Image
                        src={img.url}
                        alt={`completion-${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {worker && <p className="mt-4 text-sm text-slate-600">Assigned to: {worker.name} ({worker.specialization})</p>}

            {complaint.status !== "Closed" && (
              <Button variant="secondary" className="mt-4" onClick={closeComplaint}>Close Complaint</Button>
            )}
          </Card>
        </div>

        <Card>
          <CardTitle className="mb-4">Status Timeline</CardTitle>
          <StatusTimeline timeline={complaint.timeline} />
        </Card>
      </div>
    </DashboardShell>
  );
}
