/**
 * DashboardShell.tsx
 * --------------------------------------------------------------
 * Combines Sidebar + Navbar + page content into one consistent
 * layout, used by every dashboard page:
 *
 *   <DashboardShell role="student" title="Dashboard">
 *     ...page content...
 *   </DashboardShell>
 * --------------------------------------------------------------
 */
import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { UserRole } from "@/types";

export default function DashboardShell({
  role,
  title,
  children,
}: {
  role: UserRole;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Navbar title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
