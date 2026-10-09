import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import AtAGlanceForm from "@/components/admin/about/at-a-glance/AtAGlanceForm";

export default async function AtAGlanceAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("about_at_a_glance")
    .select("*")
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (settingsError || !settings) {
    console.error(
      "At a Glance settings error:",
      settingsError
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load At a Glance
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Confirm that the At a Glance tables
          and seed record exist in Supabase.
        </p>
      </div>
    );
  }

  const {
    data: stats,
    error: statsError,
  } = await supabase
    .from("about_at_a_glance_stats")
    .select("*")
    .eq("section_id", settings.id)
    .order("sort_order", {
      ascending: true,
    });

  if (statsError) {
    console.error(
      "At a Glance statistics error:",
      statsError
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          About Us
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          At a Glance
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the introduction and key statistics
          displayed in the At a Glance section.
        </p>
      </div>

      <AtAGlanceForm
        settings={settings}
        stats={stats ?? []}
      />
    </div>
  );
}