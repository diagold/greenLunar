"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
        flex items-center gap-2
        rounded-lg px-3 py-2
        text-sm font-medium text-gray-600
        transition
        hover:bg-red-50 hover:text-red-600
      "
    >
      <LogOut size={18} />

      <span className="hidden sm:inline">
        Logout
      </span>
    </button>
  );
}