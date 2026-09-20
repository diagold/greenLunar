import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Get admin profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (profile && !profile.is_active) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const userName =
    profile?.full_name ||
    user.email?.split("@")[0] ||
    "Administrator";

  const role = profile?.role || "editor";

  // Get live enquiry statistics
  const [enquiriesResult, newEnquiriesResult] =
    await Promise.all([
      supabase
        .from("enquiries")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("enquiries")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", "new"),
    ]);

  // Define stats
  const stats = {
    totalEnquiries: enquiriesResult.count ?? 0,
    newEnquiries: newEnquiriesResult.count ?? 0,
  };

  return (
    <AdminShell
      userName={userName}
      role={role}
      stats={stats}
    >
      {children}
    </AdminShell>
  );
}