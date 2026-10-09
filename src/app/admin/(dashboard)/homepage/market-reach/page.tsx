import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import MarketReachForm from "@/components/admin/homepage/market-reach/MarketReachForm";

export default async function MarketReachAdminPage() {
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
     SECTION SETTINGS
  ========================================================= */

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("homepage_market_reach")
    .select(`
      id,
      eyebrow,
      heading,
      highlight,
      description,
      map_image_url,
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
     LOCATIONS
  ========================================================= */

  const {
    data: locations,
    error: locationsError,
  } = await supabase
    .from(
      "homepage_market_reach_locations"
    )
    .select(`
      id,
      section_id,
      name,
      address,
      link_url,
      link_label,
      marker_left,
      marker_top,
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
    locationsError ||
    !settings
  ) {
    console.error(
      "Market Reach load error:",
      {
        settingsError,
        locationsError,
      }
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load Market Reach
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Please confirm that the Market
          Reach database tables and seed
          data have been created.
        </p>
      </div>
    );
  }

  /* =========================================================
     FILTER CURRENT SECTION
  ========================================================= */

  const sectionLocations =
    (locations ?? []).filter(
      (location) =>
        location.section_id ===
        settings.id
    );

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          Homepage
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Market Reach
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the Market Reach section,
          Nigeria map, location cards and
          map markers displayed on the
          homepage.
        </p>
      </div>

      <MarketReachForm
        settings={settings}
        locations={sectionLocations}
      />
    </div>
  );
}