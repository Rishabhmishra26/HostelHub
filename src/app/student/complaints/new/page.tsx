import DashboardShell from "@/components/layout/DashboardShell";
import ComplaintForm from "@/components/complaints/ComplaintForm";

export default function NewComplaintPage() {
  return (
    <DashboardShell role="student" title="Register Complaint">
      <ComplaintForm />
    </DashboardShell>
  );
}
