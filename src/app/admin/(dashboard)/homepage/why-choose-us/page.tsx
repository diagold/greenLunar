import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import WhyChooseUsForm from "@/components/admin/homepage/why-choose-us/WhyChooseUsForm";
import WhyChooseUsReasons from "@/components/admin/homepage/why-choose-us/WhyChooseUsReasons";

export default async function WhyChooseUsAdminPage() {
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
     SECTION
  ========================================================= */

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("homepage_why_choose_us")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  /* =========================================================
     REASONS
  ========================================================= */

  const {
    data: reasons,
    error: reasonsError,
  } = await supabase
    .from("homepage_why_choose_us_reasons")
    .select("*")
    .order("sort_order", { ascending: true });

  /* =========================================================
     ERROR
  ========================================================= */

  if (settingsError || reasonsError || !settings) {
    console.error("Why Choose Us CMS error:", {
      settingsError,
      reasonsError,
    });

    return (
      <div className="space-y-6">
        <Link
          href="/admin/homepage"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Homepage
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-800">
            Unable to load Why Choose Us
          </h1>

          <p className="mt-2 text-sm text-red-600">
            Please confirm the Why Choose Us tables and RLS
            policies are configured correctly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/homepage"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Homepage
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Why Choose Us
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Manage the Why Choose Green Lunar section displayed on
          the public homepage.
        </p>
      </div>

      <WhyChooseUsForm settings={settings} />

      <WhyChooseUsReasons
        sectionId={settings.id}
        reasons={reasons ?? []}
      />
    </div>
  );
}