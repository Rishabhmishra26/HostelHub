"use client";

/**
 * Navbar.tsx
 * Top bar shown on every dashboard page: current user's name,
 * a logout button, and (for students) a notification bell.
 */
import { LogOut, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function Navbar({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-4">
        {user?.role === "student" && (
          <button className="text-slate-500 hover:text-slate-700" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
        )}
        <div className="text-right text-sm">
          <p className="font-medium text-slate-800">{user?.name}</p>
          <p className="capitalize text-slate-400">{user?.role}</p>
        </div>
        <Button variant="ghost" onClick={logout} className="gap-1">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </header>
  );
}
