"use client";

import { Menu, Bell } from "lucide-react";
import LogoutButton from "./LogoutButton";

type AdminHeaderProps = {
  setMobileOpen: (open: boolean) => void;
  userName?: string;
  role?: string;
};

export default function AdminHeader({
  setMobileOpen,
  userName = "Administrator",
  role = "Admin",
}: AdminHeaderProps) {
  const initials = userName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-[82px] items-center justify-between
        border-b border-gray-200
        bg-white/95 px-4
        backdrop-blur
        sm:px-6 lg:px-8
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
            rounded-lg border border-gray-200
            p-2 text-gray-600
            transition
            hover:bg-gray-50
            lg:hidden
          "
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-sm font-medium text-gray-900">
            Green Lunar Admin
          </p>

          <p className="hidden text-xs text-gray-500 sm:block">
            Website Management System
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="
            relative rounded-lg
            p-2 text-gray-500
            transition hover:bg-gray-100
          "
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span
            className="
              absolute right-2 top-2
              h-2 w-2 rounded-full
              bg-green-600
            "
          />
        </button>

        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* USER */}
        <div className="hidden items-center gap-3 md:flex">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full bg-green-50
              text-sm font-bold text-green-700
            "
          >
            {initials}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              {userName}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {role.replace("_", " ")}
            </p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}