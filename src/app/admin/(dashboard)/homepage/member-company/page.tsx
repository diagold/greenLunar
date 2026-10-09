import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import MemberCompanyForm from "@/components/admin/homepage/member-company/MemberCompanyForm";

export default async function MemberCompanyAdminPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /* =========================================================
     GET SECTION
  ========================================================= */

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("homepage_member_company")
    .select("*")
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (settingsError || !settings) {
    console.error(
      "Member Company settings error:",
      settingsError
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load Member Company
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Please confirm that the
          homepage_member_company table
          and seed record have been
          created in Supabase.
        </p>
      </div>
    );
  }

  /* =========================================================
     GET COMPANIES
  ========================================================= */

  const {
    data: companies,
    error: companiesError,
  } = await supabase
    .from(
      "homepage_member_company_items"
    )
    .select("*")
    .eq(
      "section_id",
      settings.id
    )
    .order("sort_order", {
      ascending: true,
    });

  if (companiesError) {
    console.error(
      "Member Companies error:",
      companiesError
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load Member Companies
        </h1>

        <p className="mt-2 text-sm text-red-600">
          The section exists, but the
          member company records could
          not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          Homepage
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Member Companies
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the homepage Member
          Companies section, company
          logos, destination links,
          visibility, display order and
          group statement.
        </p>
      </div>

      <MemberCompanyForm
        settings={settings}
        companies={companies ?? []}
      />
    </div>
  );
}