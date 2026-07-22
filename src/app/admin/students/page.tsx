"use client";

/**
 * Admin > Manage Students: simple read-only table of all
 * registered students (kept simple - a real app might add
 * edit/deactivate actions here later).
 */
import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface StudentRow {
  _id: string; name: string; email: string; hostel: string; roomNumber: string; isVerified: boolean;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[] | null>(null);

  useEffect(() => {
    fetch("/api/students").then((res) => res.json()).then(setStudents);
  }, []);

  return (
    <DashboardShell role="admin" title="Manage Students">
      {!students ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-card border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Hostel</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Verified</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.hostel}</td>
                  <td className="px-4 py-3">{s.roomNumber}</td>
                  <td className="px-4 py-3">{s.isVerified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
