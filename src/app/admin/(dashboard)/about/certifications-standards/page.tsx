import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import CertificationsStandardsForm from "@/components/admin/about/certifications-standards/CertificationsStandardsForm";


export default async function CertificationsStandardsPage() {
  const supabase =
    await createClient();


  /* =======================================================
     AUTH
  ======================================================= */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();


  if (authError || !user) {
    redirect("/admin/login");
  }


  /* =======================================================
     SECTION SETTINGS
  ======================================================= */

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from(
      "about_certifications_standards"
    )
    .select(`
      id,
      eyebrow,
      heading,
      highlight,
      description,

      frameworks_eyebrow,
      frameworks_heading,
      frameworks_highlight,
      frameworks_description,

      is_active,
      created_at,
      updated_at
    `)
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();


  if (settingsError) {
    console.error(
      "Certifications settings error:",
      {
        message:
          settingsError.message,

        details:
          settingsError.details,

        hint:
          settingsError.hint,

        code:
          settingsError.code,
      }
    );

    return (
      <div className="space-y-6">

        <PageHeading />


        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <h2 className="font-semibold text-red-800">
            Unable to load
            Certifications & Standards
          </h2>


          <div className="mt-4 space-y-2 text-sm text-red-700">

            <p>
              <strong>
                Message:
              </strong>{" "}
              {settingsError.message ||
                "Unknown error"}
            </p>


            {settingsError.code && (
              <p>
                <strong>
                  Code:
                </strong>{" "}
                {settingsError.code}
              </p>
            )}


            {settingsError.details && (
              <p>
                <strong>
                  Details:
                </strong>{" "}
                {settingsError.details}
              </p>
            )}


            {settingsError.hint && (
              <p>
                <strong>
                  Hint:
                </strong>{" "}
                {settingsError.hint}
              </p>
            )}

          </div>

        </div>

      </div>
    );
  }


  /* =======================================================
     NO SETTINGS RECORD
  ======================================================= */

  if (!settings) {
    return (
      <div className="space-y-6">

        <PageHeading />


        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

          <h2 className="font-semibold text-amber-800">
            No section record found
          </h2>


          <p className="mt-2 text-sm leading-6 text-amber-700">
            The
            about_certifications_standards
            table exists, but no section
            record was found.
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     STANDARD CARDS
  ======================================================= */

  const {
    data: certificationItems,
    error: certificationItemsError,
  } = await supabase
    .from(
      "about_certification_items"
    )
    .select(`
      id,
      section_id,
      title,
      description,
      icon,
      sort_order,
      is_active
    `)
    .eq(
      "section_id",
      settings.id
    )
    .order("sort_order", {
      ascending: true,
    });


  if (certificationItemsError) {
    console.error(
      "Certification items error:",
      {
        message:
          certificationItemsError.message,

        details:
          certificationItemsError.details,

        hint:
          certificationItemsError.hint,

        code:
          certificationItemsError.code,
      }
    );
  }


  /* =======================================================
     CERTIFICATION LOGOS
  ======================================================= */

  const {
    data: certificationLogos,
    error: certificationLogosError,
  } = await supabase
    .from(
      "about_certification_logos"
    )
    .select(`
      id,
      section_id,
      name,
      logo_url,
      image_alt,
      website_url,
      sort_order,
      is_active
    `)
    .eq(
      "section_id",
      settings.id
    )
    .order("sort_order", {
      ascending: true,
    });


  if (certificationLogosError) {
    console.error(
      "Certification logos error:",
      {
        message:
          certificationLogosError.message,

        details:
          certificationLogosError.details,

        hint:
          certificationLogosError.hint,

        code:
          certificationLogosError.code,
      }
    );
  }


  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="space-y-8">

      <PageHeading />


      {certificationItemsError && (
        <ErrorNotice
          title="Standards cards could not be loaded."
          message={
            certificationItemsError.message
          }
        />
      )}


      {certificationLogosError && (
        <ErrorNotice
          title="Certification logos could not be loaded."
          message={
            certificationLogosError.message
          }
        />
      )}


      <CertificationsStandardsForm
        settings={settings}
        items={
          certificationItems ?? []
        }
        logos={
          certificationLogos ?? []
        }
      />

    </div>
  );
}


/* =========================================================
   PAGE HEADING
========================================================= */

function PageHeading() {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
        About Us
      </p>


      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
        Certifications & Standards
      </h1>


      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
        Manage regulatory standards,
        certifications, frameworks and
        certification logos displayed on
        the About Us page.
      </p>

    </div>
  );
}


/* =========================================================
   ERROR NOTICE
========================================================= */

function ErrorNotice({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">

      <p className="text-sm font-semibold text-red-800">
        {title}
      </p>


      <p className="mt-1 text-sm text-red-700">
        {message}
      </p>

    </div>
  );
}