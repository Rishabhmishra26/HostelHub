import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Complaint } from "@/types";
import { format } from "date-fns";

export default function ComplaintCard({ complaint, basePath }: { complaint: Complaint; basePath: string }) {
  return (
    <Link href={`${basePath}/${complaint._id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">{complaint.title}</p>
            <p className="text-xs text-slate-500">
              {complaint.hostel} · Room {complaint.roomNumber} · {complaint.category}
            </p>
          </div>
          <Badge status={complaint.status} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{complaint.description}</p>
        <p className="mt-2 text-xs text-slate-400">
          Submitted on {format(new Date(complaint.createdAt), "dd MMM yyyy")}
        </p>
      </Card>
    </Link>
  );
}
