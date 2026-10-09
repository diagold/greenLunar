import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import CoreSolutionsForm from "@/components/admin/homepage/core-solutions/CoreSolutionsForm";

export default async function CoreSolutionsAdminPage() {
  const supabase = await createClient();

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /* =========================================================
     LOAD SECTION SETTINGS
  ========================================================= */

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("homepage_core_solutions")
    .select(`
      id,
      eyebrow,
      heading,
      highlight,
      description,
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
     LOAD CORE SOLUTION ITEMS
  ========================================================= */

  const {
    data: items,
    error: itemsError,
  } = await supabase
    .from("homepage_core_solution_items")
    .select(`
      id,
      section_id,
      title,
      description,
      image_url,
      link_url,
      link_label,
      sort_order,
      is_active,
      created_at,
      updated_at
    `)
    .order("sort_order", {
      ascending: true,
    });

  /* =========================================================
     ERROR HANDLING
  ========================================================= */

  if (
    settingsError ||
    itemsError ||
    !settings
  ) {
    console.error(
      "Core Solutions CMS error:",
      {
        settingsError,
        itemsError,
      }
    );

    return (
      <div className="space-y-6">
        <Link
          href="/admin/homepage"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition
            hover:text-gray-900
          "
        >
          <ArrowLeft size={17} />

          Back to Homepage
        </Link>

        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-6
          "
        >
          <h1 className="font-semibold text-red-800">
            Unable to load Core Solutions
          </h1>

          <p className="mt-2 text-sm text-red-600">
            Please confirm the Core Solutions database
            tables and policies have been created
            correctly.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     FILTER ITEMS FOR CURRENT SECTION
  ========================================================= */

  const sectionItems =
    items?.filter(
      (item) =>
        item.section_id === settings.id
    ) ?? [];

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <Link
          href="/admin/homepage"
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition
            hover:text-gray-900
          "
        >
          <ArrowLeft size={17} />

          Back to Homepage
        </Link>

        <div>
          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
              sm:text-3xl
            "
          >
            Core Solutions
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-gray-500
            "
          >
            Manage the Core Solutions section displayed
            on the Green Lunar homepage. These cards are
            managed independently from the main Services
            section of the website.
          </p>
        </div>
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}

      <CoreSolutionsForm
        settings={settings}
        items={sectionItems}
      />
    </div>
  );
}