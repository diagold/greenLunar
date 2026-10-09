import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import PurposeForm from "@/components/admin/about/purpose/PurposeForm";


export default async function PurposeAdminPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }


  /* =========================================================
     PURPOSE SETTINGS
  ========================================================= */

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("about_purpose")
    .select("*")
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (
    settingsError ||
    !settings
  ) {
    console.error(
      "Purpose settings error:",
      settingsError
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load Our Purpose
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Confirm that the
          about_purpose table and seed
          record have been created in
          Supabase.
        </p>
      </div>
    );
  }


  /* =========================================================
     CORE VALUES
  ========================================================= */

  const {
    data: coreValues,
    error: coreValuesError,
  } = await supabase
    .from("about_core_values")
    .select("*")
    .eq(
      "section_id",
      settings.id
    )
    .order("sort_order", {
      ascending: true,
    });

  if (coreValuesError) {
    console.error(
      "Core values error:",
      coreValuesError
    );
  }


  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          About Us
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Our Purpose
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the mission, vision
          and core values displayed on
          the About Us page.
        </p>
      </div>

      <PurposeForm
        settings={settings}
        coreValues={
          coreValues ?? []
        }
      />
    </div>
  );
}