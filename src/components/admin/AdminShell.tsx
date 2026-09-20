"use client";

import { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

type AdminShellProps = {
  children: React.ReactNode;
  userName?: string;
  role?: string;

  stats: {
    totalEnquiries: number;
    newEnquiries: number;
  };
};

export default function AdminShell({
  children,
  userName,
  role,
  stats,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        newEnquiries={stats.newEnquiries}
      />

      <div className="min-w-0 flex-1">

        <AdminHeader
          setMobileOpen={setMobileOpen}
          userName={userName}
          role={role}
        />

        <main className="min-h-[calc(100vh-82px)]">
          {children}
        </main>

      </div>

    </div>
  );
}