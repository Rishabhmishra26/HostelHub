"use client";

/**
 * Admin Dashboard: overall stats + hostel-wise / category-wise
 * breakdown, as requested in the spec.
 */
import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface Stats {
  total: number; pending: number; completed: number;
  hostelWise: { _id: string; count: number }[];
  categoryWise: { _id: string; count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((res) => res.json()).then(setStats);
  }, []);

  if (!stats) return <DashboardShell role="admin" title="Dashboard"><LoadingSpinner /></DashboardShell>;

  return (
    <DashboardShell role="admin" title="Dashboard">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Total Complaints</p><p className="text-2xl font-bold">{stats.total}</p></Card>
        <Card><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold text-amber-600">{stats.pending}</p></Card>
        <Card><p className="text-sm text-slate-500">Completed</p><p className="text-2xl font-bold text-emerald-600">{stats.completed}</p></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardTitle className="mb-3">Hostel-wise Complaints</CardTitle>
          <ul className="flex flex-col gap-2">
            {stats.hostelWise.map((h) => (
              <li key={h._id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{h._id}</span>
                <span className="font-semibold">{h.count}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle className="mb-3">Category-wise Complaints</CardTitle>
          <ul className="flex flex-col gap-2">
            {stats.categoryWise.map((c) => (
              <li key={c._id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{c._id}</span>
                <span className="font-semibold">{c.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </DashboardShell>
  );
}
