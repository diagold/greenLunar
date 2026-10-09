"use client";

import { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

/* =========================================================
   TYPES
========================================================= */

type AdminShellProps = {
  children: React.ReactNode;
  newEnquiries?: number;
  userName?: string;
  role?: string;
};

/* =========================================================
   ADMIN SHELL
========================================================= */

export default function AdminShell({
  children,
  newEnquiries = 0,
  userName = "Administrator",
  role = "Admin",
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* =================================================
            SIDEBAR

            AdminSidebar already provides its own desktop
            spacer, so we DO NOT add margin-left here.
        ================================================== */}

        <AdminSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          newEnquiries={newEnquiries}
        />

        {/* =================================================
            MAIN APPLICATION AREA
        ================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* ===============================================
              HEADER
          ================================================ */}

          <AdminHeader
            setMobileOpen={setMobileOpen}
            userName={userName}
            role={role}
          />

          {/* ===============================================
              PAGE CONTENT
          ================================================ */}

          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div
              className="
                mx-auto
                w-full
                max-w-[1600px]
                px-4
                py-6
                sm:px-6
                lg:px-8
                lg:py-8
              "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}