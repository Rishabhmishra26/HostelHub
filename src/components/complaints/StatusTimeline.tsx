/**
 * StatusTimeline.tsx
 * Renders the vertical "Submitted -> Assigned -> Work Started ->
 * Completed" timeline the spec asks for, driven entirely by the
 * `timeline` array stored on the complaint document.
 */
import { TimelineEntry } from "@/types";
import { format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";

export default function StatusTimeline({ timeline }: { timeline: TimelineEntry[] }) {
  return (
    <ol className="relative ml-3 border-l border-slate-200">
      {timeline.map((entry, idx) => (
        <li key={idx} className="mb-6 ml-4">
          <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-white">
            {idx === timeline.length - 1 ? (
              <Circle className="h-4 w-4 text-primary-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
          </span>
          <p className="text-sm font-medium text-slate-800">{entry.status}</p>
          {entry.note && <p className="text-xs text-slate-500">{entry.note}</p>}
          <time className="text-xs text-slate-400">
            {format(new Date(entry.timestamp), "dd MMM yyyy, hh:mm a")}
          </time>
        </li>
      ))}
    </ol>
  );
}
