/**
 * constants.ts
 * --------------------------------------------------------------
 * Central place for values that are reused across the frontend
 * AND backend, so we never have to repeat a hard-coded list in
 * ten different files (and risk them going out of sync).
 * --------------------------------------------------------------
 */

export const HOSTELS = ["Yamuna Girls Hostel", "Dhauladhar Boys Hostel", "Shivalik Boys Hostel"] as const;
export type HostelName = (typeof HOSTELS)[number];

// Yamuna & Dhauladhar use FLOORS. Shivalik uses BLOCKS instead.
export const FLOOR_HOSTELS: HostelName[] = ["Yamuna Girls Hostel", "Dhauladhar Boys Hostel"];
export const BLOCK_HOSTELS: HostelName[] = ["Shivalik Boys Hostel"];

export const FLOORS = [1, 2, 3, 4, 5, 6, 7]; // floor 2 is the mess, not selectable for a complaint room
export const BLOCKS = ["A", "B", "C", "D"];

export const COMPLAINT_CATEGORIES = [
  "Electricity", "Water Leakage", "Cleaning", "Washroom", "Broken Door Handle",
  "Window Damage", "Furniture", "WiFi / Internet", "Mess", "Fan", "Tube Light",
  "Switch Board", "Water Cooler", "Lift", "Plumbing", "Security", "Garbage", "Other",
] as const;

export const COMPLAINT_STATUSES = [
  "Pending", "Assigned", "In Progress", "Completed", "Rejected", "Closed",
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

// Colours used for status badges - kept in one place for consistency.
export const STATUS_STYLES: Record<ComplaintStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Assigned: "bg-blue-100 text-blue-700",
  "In Progress": "bg-indigo-100 text-indigo-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Closed: "bg-slate-200 text-slate-700",
};
