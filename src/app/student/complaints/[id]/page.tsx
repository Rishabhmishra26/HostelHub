"use client";

/**
 * Complaint detail (student view): shows full info, uploaded
 * images, completion images, assigned worker, and the status
 * timeline.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StatusTimeline from "@/components/complaints/StatusTimeline";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Complaint } from "@/types";

export default function StudentComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then((res) => res.json())
      .then(setComplaint)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <DashboardShell role="student" title="Complaint Details"><LoadingSpinner /></DashboardShell>;
  if (!complaint) return <DashboardShell role="student" title="Complaint Details"><p>Complaint not found.</p></DashboardShell>;

  const worker = typeof complaint.assignedWorker === "object" ? complaint.assignedWorker : null;

  return (
    <DashboardShell role="student" title="Complaint Details">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-2 flex items-start justify-between">
              <CardTitle>{complaint.title}</CardTitle>
              <Badge status={complaint.status} />
            </div>
            <p className="mb-4 text-sm text-slate-500">
              {complaint.hostel} · Room {complaint.roomNumber} · {complaint.category}
            </p>
            <p className="text-sm text-slate-700">{complaint.description}</p>

            {complaint.images.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-700">Uploaded Images</p>
                <div className="flex flex-wrap gap-3">
                  {complaint.images.map((img, i) => (
                    <div key={i} className="relative h-24 w-24 overflow-hidden rounded-md border border-slate-200">
                      <Image src={img.url} alt={`complaint-image-${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {complaint.completionImages.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-700">Completion Images</p>
                <div className="flex flex-wrap gap-3">
                  {complaint.completionImages.map((img, i) => (
                    <div key={i} className="relative h-24 w-24 overflow-hidden rounded-md border border-slate-200">
                      <Image src={img.url} alt={`completion-image-${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {worker && (
            <Card className="mt-4">
              <CardTitle className="mb-2">Assigned Worker</CardTitle>
              <p className="text-sm text-slate-700">{(worker as any).name} · {(worker as any).specialization}</p>
            </Card>
          )}
        </div>

        <Card>
          <CardTitle className="mb-4">Status Timeline</CardTitle>
          <StatusTimeline timeline={complaint.timeline} />
        </Card>
      </div>
    </DashboardShell>
  );
}
