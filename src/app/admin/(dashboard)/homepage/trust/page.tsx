import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import TrustSectionForm from "@/components/admin/homepage/trust/TrustSectionForm";

export default async function TrustSectionAdminPage() {
  const supabase =
    await createClient();

  /* =========================================================
     AUTH
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /* =========================================================
     SECTION
  ========================================================= */

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("homepage_trust_section")
    .select(`
      id,
      eyebrow,
      heading,
      highlight,
      description,
      cta_label,
      cta_url,
      is_active,
      created_at,
      updated_at
    `)
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  /* =========================================================
     STATISTICS
  ========================================================= */

  const {
    data: stats,
    error: statsError,
  } = await supabase
    .from("homepage_trust_stats")
    .select(`
      id,
      section_id,
      value,
      unit,
      label,
      icon,
      sort_order,
      is_active,
      created_at,
      updated_at
    `)
    .order("sort_order", {
      ascending: true,
    });

  /* =========================================================
     ERROR
  ========================================================= */

  if (
    settingsError ||
    statsError ||
    !settings
  ) {
    console.error(
      "Trust Section load error:",
      {
        settingsError,
        statsError,
      }
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load Trust Section
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Please confirm that the Trust
          Section database tables and
          seed data have been created.
        </p>
      </div>
    );
  }

  const sectionStats =
    (stats ?? []).filter(
      (stat) =>
        stat.section_id ===
        settings.id
    );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          Homepage
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Trust Section
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the homepage trust
          statement, statistics and
          partnership call-to-action.
        </p>
      </div>

      <TrustSectionForm
        settings={settings}
        stats={sectionStats}
      />
    </div>
  );
}