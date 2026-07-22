import { cn } from "@/lib/utils";
import { STATUS_STYLES, ComplaintStatus } from "@/lib/constants";

export default function Badge({ status }: { status: string }) {
  const style = STATUS_STYLES[status as ComplaintStatus] || "bg-slate-100 text-slate-700";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", style)}>
      {status}
    </span>
  );
}
