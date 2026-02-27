import { redirect } from "next/navigation";

import AdminClientLayout from "@/components/AdminClientLayout";
import { getCurrentUser, isAdminRole } from "@/lib/current-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminRole(user.role)) {
    redirect("/dashboard");
  }

  return <AdminClientLayout fullName={user.fullName} role={user.role}>{children}</AdminClientLayout>;
}
