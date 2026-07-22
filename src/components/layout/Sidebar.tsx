"use client";

/**
 * Sidebar.tsx
 * --------------------------------------------------------------
 * ONE sidebar component reused by all three roles. Which links
 * appear depends on the `role` prop - this avoids having three
 * near-identical sidebar files (StudentSidebar, WorkerSidebar,
 * AdminSidebar) that would all need updating separately.
 * --------------------------------------------------------------
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FilePlus2, History, User, Users, Wrench,
  ClipboardList, Megaphone, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

const LINKS: Record<UserRole, { href: string; label: string; icon: any }[]> = {
  student: [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/complaints/new", label: "Register Complaint", icon: FilePlus2 },
    { href: "/student/complaints", label: "Complaint History", icon: History },
    { href: "/student/profile", label: "Profile", icon: User },
  ],
  worker: [
    { href: "/worker/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "Complaints", icon: ClipboardList },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/workers", label: "Workers", icon: Wrench },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  ],
};

export default function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const links = LINKS[role];

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <div className="mb-6 flex items-center gap-2 px-2">
        <Building2 className="h-6 w-6 text-primary-500" />
        <span className="text-lg font-bold text-slate-900">HostelHub</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100",
                active && "bg-primary-50 text-primary-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
