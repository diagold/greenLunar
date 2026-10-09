import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import LeadershipForm from "@/components/admin/about/leadership/LeadershipForm";


/* =========================================================
   PAGE
========================================================= */

export default async function LeadershipPage() {
  const supabase = await createClient();


  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();


  if (authError || !user) {
    redirect("/admin/login");
  }


  /* =======================================================
     LEADERSHIP SETTINGS
  ======================================================= */

  const {
    data: leadership,
    error: leadershipError,
  } = await supabase
    .from("about_leadership")
    .select(`
      id,

      eyebrow,
      heading,
      highlight,
      description,

      chairman_image_url,
      chairman_image_alt,
      chairman_label,
      chairman_position,
      chairman_name,
      chairman_description,

      executives_eyebrow,
      executives_heading,

      team_description,
      team_label,

      is_active,

      created_at,
      updated_at
    `)
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();


  /* =======================================================
     LEADERSHIP QUERY ERROR
  ======================================================= */

  if (leadershipError) {
    console.error(
      "Leadership settings error:",
      {
        message:
          leadershipError.message,

        details:
          leadershipError.details,

        hint:
          leadershipError.hint,

        code:
          leadershipError.code,
      }
    );


    return (
      <div className="space-y-6">

        <PageHeading />


        <ErrorPanel
          title="Unable to load Leadership"
          message={
            leadershipError.message ||
            "An unknown database error occurred."
          }
          code={
            leadershipError.code
          }
          details={
            leadershipError.details
          }
          hint={
            leadershipError.hint
          }
        />

      </div>
    );
  }


  /* =======================================================
     NO LEADERSHIP RECORD
  ======================================================= */

  if (!leadership) {
    return (
      <div className="space-y-6">

        <PageHeading />


        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

          <h2 className="text-base font-semibold text-amber-900">
            Leadership section not found
          </h2>


          <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-700">
            The{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">
              about_leadership
            </code>{" "}
            table exists, but no Leadership
            section record was found.
          </p>


          <p className="mt-3 text-sm leading-6 text-amber-700">
            Run the Leadership seed SQL before
            using this admin page.
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     EXECUTIVE MEMBERS
  ======================================================= */

  const {
    data: members,
    error: membersError,
  } = await supabase
    .from("about_leadership_members")
    .select(`
      id,
      section_id,

      name,
      role,

      description,

      image_url,
      image_alt,

      profile_url,

      sort_order,
      is_active,

      created_at,
      updated_at
    `)
    .eq(
      "section_id",
      leadership.id
    )
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    });


  /* =======================================================
     EXECUTIVE QUERY ERROR
  ======================================================= */

  if (membersError) {
    console.error(
      "Leadership members error:",
      {
        message:
          membersError.message,

        details:
          membersError.details,

        hint:
          membersError.hint,

        code:
          membersError.code,
      }
    );
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-8">

      <PageHeading />


      {membersError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">

          <p className="text-sm font-semibold text-red-800">
            Executive members could not be loaded.
          </p>


          <p className="mt-1 text-sm text-red-700">
            {membersError.message}
          </p>

        </div>
      )}


      <LeadershipForm
        leadership={leadership}
        members={members ?? []}
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
        Leadership
      </h1>


      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
        Manage the Leadership section of the
        About Us page, including the Group
        Chairman, executive leadership and
        supporting leadership content.
      </p>

    </div>
  );
}


/* =========================================================
   ERROR PANEL
========================================================= */

function ErrorPanel({
  title,
  message,
  code,
  details,
  hint,
}: {
  title: string;

  message: string;

  code?: string | null;

  details?: string | null;

  hint?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

      <h2 className="font-semibold text-red-800">
        {title}
      </h2>


      <div className="mt-4 space-y-2 text-sm text-red-700">

        <p>
          <strong>
            Message:
          </strong>{" "}
          {message}
        </p>


        {code && (
          <p>
            <strong>
              Code:
            </strong>{" "}
            {code}
          </p>
        )}


        {details && (
          <p>
            <strong>
              Details:
            </strong>{" "}
            {details}
          </p>
        )}


        {hint && (
          <p>
            <strong>
              Hint:
            </strong>{" "}
            {hint}
          </p>
        )}

      </div>

    </div>
  );
}