"use client";

/**
 * Admin > Manage Workers: list existing workers + a small form to
 * add a new one (name, email, password, specialization).
 */
import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface WorkerRow { _id: string; name: string; email: string; specialization: string; }

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<WorkerRow[] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", specialization: "General" });
  const [message, setMessage] = useState("");

  function load() {
    fetch("/api/workers").then((res) => res.json()).then(setWorkers);
  }
  useEffect(load, []);

  async function addWorker() {
    setMessage("");
    const res = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setMessage(data.message); return; }
    setForm({ name: "", email: "", password: "", specialization: "General" });
    load();
  }

  return (
    <DashboardShell role="admin" title="Manage Workers">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {!workers ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto rounded-card border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{w.name}</td>
                      <td className="px-4 py-3">{w.email}</td>
                      <td className="px-4 py-3">{w.specialization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Card>
          <CardTitle className="mb-3">Add Worker</CardTitle>
          <div className="flex flex-col gap-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            {message && <p className="text-sm text-red-500">{message}</p>}
            <Button onClick={addWorker}>Add Worker</Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
