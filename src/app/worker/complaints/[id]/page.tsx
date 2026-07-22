"use client";

/**
 * Worker complaint detail: worker can accept (Assigned -> In
 * Progress), add notes, upload a completion image, and mark the
 * complaint Completed.
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import StatusTimeline from "@/components/complaints/StatusTimeline";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ImageUploader from "@/components/complaints/ImageUploader";
import { Complaint } from "@/types";

export default function WorkerComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState("");
  const [completionImages, setCompletionImages] = useState<
    { url: string; publicId: string }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  function load() {
    fetch(`/api/complaints/${id}`).then((res) => res.json()).then(setComplaint).finally(() => setIsLoading(false));
  }
  useEffect(load, [id]);

  async function updateStatus(status: string) {
    setIsSaving(true);
    await fetch(`/api/complaints/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        note: note || undefined,
        completionImage: completionImages[0],
      }),
    });
    setNote("");
    setIsSaving(false);
    load();
  }

  if (isLoading) return <DashboardShell role="worker" title="Complaint"><LoadingSpinner /></DashboardShell>;
  if (!complaint) return <DashboardShell role="worker" title="Complaint"><p>Complaint not found.</p></DashboardShell>;

  return (
    <DashboardShell role="worker" title="Complaint Details">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
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
              <div className="mt-4 flex flex-wrap gap-3">
                {complaint.images.map((img, i) => (
                  <div key={i} className="relative h-24 w-24 overflow-hidden rounded-md border border-slate-200">
                    <Image src={img.url} alt={`img-${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle className="mb-3">Update Work Status</CardTitle>
            <Textarea label="Notes (optional)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Replaced the switch board, tested working fine." />
            <div className="mt-3">
              <ImageUploader onChange={setCompletionImages} maxImages={2} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {complaint.status === "Assigned" && (
                <Button isLoading={isSaving} onClick={() => updateStatus("In Progress")}>Mark In Progress</Button>
              )}
              {complaint.status === "In Progress" && (
                <Button isLoading={isSaving} onClick={() => updateStatus("Completed")}>Mark Completed</Button>
              )}
              {(complaint.status === "Assigned" || complaint.status === "In Progress") && (
                <Button variant="secondary" isLoading={isSaving} onClick={() => updateStatus("Rejected")}>Reject Complaint</Button>
              )}
            </div>
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
