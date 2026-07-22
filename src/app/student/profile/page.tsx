"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSave() {
    setMessage("");
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone || undefined, newPassword: newPassword || undefined }),
    });
    if (res.ok) {
      setMessage("Profile updated successfully");
      setNewPassword("");
    } else {
      setMessage("Failed to update profile");
    }
  }

  return (
    <DashboardShell role="student" title="Profile">
      <Card className="max-w-lg">
        <CardTitle className="mb-4">Account Details</CardTitle>
        <div className="flex flex-col gap-4">
          <Input label="Name" value={user?.name || ""} disabled />
          <Input label="Email" value={user?.email || ""} disabled />
          <Input label="Phone Number" placeholder="Add a phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="New Password" type="password" placeholder="Leave blank to keep current password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          <Button onClick={handleSave} className="w-fit">Save Changes</Button>
        </div>
      </Card>
    </DashboardShell>
  );
}
