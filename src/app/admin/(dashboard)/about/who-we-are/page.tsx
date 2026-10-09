import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import WhoWeAreForm from "@/components/admin/about/who-we-are/WhoWeAreForm";

export default async function WhoWeAreAdminPage() {
  const supabase =
    await createClient();

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
    .from("about_who_we_are")
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
      "Who We Are settings error:",
      settingsError
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load Who We Are
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Confirm that the
          about_who_we_are table and
          seed record have been created
          in Supabase.
        </p>
      </div>
    );
  }

  /* =========================================================
     IMAGES
  ========================================================= */

  const {
    data: images,
    error: imagesError,
  } = await supabase
    .from(
      "about_who_we_are_images"
    )
    .select("*")
    .eq(
      "section_id",
      settings.id
    )
    .order("sort_order", {
      ascending: true,
    });

  if (imagesError) {
    console.error(
      "Who We Are images error:",
      imagesError
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          About Us
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Who We Are
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the company
          introduction, supporting
          paragraphs and image gallery
          displayed in the Who We Are
          section.
        </p>
      </div>

      <WhoWeAreForm
        settings={settings}
        images={images ?? []}
      />
    </div>
  );
}