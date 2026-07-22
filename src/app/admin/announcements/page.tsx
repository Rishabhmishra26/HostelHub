"use client";

/**
 * Admin > Post Announcements: sends a broadcast Notification to
 * every student.
 */
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function AdminAnnouncementsPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function send() {
    setStatus("");
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setStatus(data.message);
    if (res.ok) setMessage("");
  }

  return (
    <DashboardShell role="admin" title="Post Announcement">
      <Card className="max-w-lg">
        <CardTitle className="mb-3">New Announcement</CardTitle>
        <Textarea
          placeholder="e.g. Water supply will be interrupted on Sunday 10am-2pm for maintenance."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {status && <p className="mt-2 text-sm text-emerald-600">{status}</p>}
        <Button className="mt-3" onClick={send} disabled={!message.trim()}>Send to All Students</Button>
      </Card>
    </DashboardShell>
  );
}
