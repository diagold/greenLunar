
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import MemberCompanyForm from "@/components/admin/homepage/member-company/MemberCompanyForm";

export const dynamic = "force-dynamic";

const SETTINGS_TABLE = "MemberCompanySettings";
const COMPANIES_TABLE = "MemberCompanyItem";

export default async function MemberCompanyAdminPage() {
  // Initialize Supabase inside the request scope
  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error(
      "Member Company authentication error:",
      authError.message
    );
  }

  if (!user) {
    redirect("/admin/login");
  }

  // GET MEMBER COMPANY SETTINGS
  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from(SETTINGS_TABLE)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    console.error("Member Company settings query failed:", {
      message: settingsError.message,
      code: settingsError.code,
      details: settingsError.details,
      hint: settingsError.hint,
    });

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-700">
          Unable to load Member Company
        </h1>

        <p className="mt-2 text-sm text-red-600">
          The Member Company settings could not be retrieved
          from Supabase. Please verify the database table,
          access permissions and server logs.
        </p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-lg font-semibold text-amber-800">
          Member Company settings not configured
        </h1>

        <p className="mt-2 text-sm text-amber-700">
          The settings table exists, but no configuration
          record was returned. Please create the initial
          Member Company settings record in Supabase.
        </p>
      </div>
    );
  }

  // GET MEMBER COMPANY ITEMS
  const {
    data: companies,
    error: companiesError,
  } = await supabase
    .from(COMPANIES_TABLE)
    .select("*")
    .eq("section_id", settings.id)
    .order("sort_order", {
      ascending: true,
    });

  if (companiesError) {
    console.error("Member Companies query failed:", {
      message: companiesError.message,
      code: companiesError.code,
      details: companiesError.details,
      hint: companiesError.hint,
    });

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-700">
          Unable to load Member Companies
        </h1>

        <p className="mt-2 text-sm text-red-600">
          The settings were loaded successfully, but the
          associated Member Company records could not be
          retrieved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <p className="text-sm font-medium text-green-700">
          Homepage
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Member Companies
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the homepage Member Companies section,
          company logos, destination links, visibility,
          display order and group statement.
        </p>
      </div>

      {/* MEMBER COMPANY MANAGEMENT FORM */}
      <MemberCompanyForm
        settings={settings}
        companies={companies ?? []}
      />
    </div>
  );
}
