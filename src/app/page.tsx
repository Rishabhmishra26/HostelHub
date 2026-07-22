/**
 * Landing page ("/"). Simple welcome screen with links to
 * login/register - kept deliberately minimal per the brief
 * ("polished college project", not a marketing site).
 */
import Link from "next/link";
import { Building2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex items-center gap-2">
        <Building2 className="h-8 w-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-slate-900">HostelHub</h1>
      </div>
      <p className="max-w-md text-slate-500">
        Report and track hostel maintenance complaints for Yamuna, Dhauladhar and Shivalik hostels.
      </p>
      <div className="flex gap-3">
        <Link href="/login"><Button>Login</Button></Link>
        <Link href="/register"><Button variant="secondary">Register</Button></Link>
      </div>
    </main>
  );
}
