import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import AboutHeroForm from "@/components/admin/about/hero/AboutHeroForm";

export default async function AboutHeroAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const {
    data: hero,
    error,
  } = await supabase
    .from("about_hero")
    .select("*")
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (error || !hero) {
    console.error(
      "About hero error:",
      error
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load About Hero
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Confirm that the about_hero
          table and seed record exist in
          Supabase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          About Us
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Hero Section
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the main banner shown at
          the top of the GreenLunar About
          Us page.
        </p>
      </div>

      <AboutHeroForm hero={hero} />
    </div>
  );
}