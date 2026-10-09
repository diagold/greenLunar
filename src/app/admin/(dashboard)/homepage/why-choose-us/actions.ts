"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in to perform this action.");
  }

  return { supabase, user };
}

export type WhyChooseUsSettingsData = {
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
  imageUrl: string;
  statValue: string;
  statLabel: string;
  isActive: boolean;
};

function revalidateWhyChooseUs() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/why-choose-us");
}

/* =========================================================
   UPDATE SECTION
========================================================= */

export async function updateWhyChooseUs(
  id: string,
  data: WhyChooseUsSettingsData
) {
  const { supabase } = await requireAuthenticatedUser();

  if (!id) {
    throw new Error("Why Choose Us section ID is required.");
  }

  if (!data.heading.trim()) {
    throw new Error("Heading is required.");
  }

  const { error } = await supabase
    .from("homepage_why_choose_us")
    .update({
      eyebrow: data.eyebrow.trim() || null,
      heading: data.heading.trim(),
      highlight: data.highlight.trim() || null,
      description: data.description.trim() || null,
      image_url: data.imageUrl.trim() || null,
      stat_value: data.statValue.trim() || null,
      stat_label: data.statLabel.trim() || null,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhyChooseUs();

  return { success: true };
}

/* =========================================================
   CREATE REASON
========================================================= */

export async function createWhyChooseUsReason(data: {
  sectionId: string;
  title: string;
  description: string;
}) {
  const { supabase } = await requireAuthenticatedUser();

  if (!data.title.trim()) {
    throw new Error("Reason title is required.");
  }

  const { data: existingReasons, error: loadError } =
    await supabase
      .from("homepage_why_choose_us_reasons")
      .select("sort_order")
      .eq("section_id", data.sectionId)
      .order("sort_order", { ascending: false })
      .limit(1);

  if (loadError) {
    throw new Error(loadError.message);
  }

  const nextSortOrder =
    (existingReasons?.[0]?.sort_order ?? 0) + 1;

  const number = String(nextSortOrder).padStart(2, "0");

  const { error } = await supabase
    .from("homepage_why_choose_us_reasons")
    .insert({
      section_id: data.sectionId,
      number,
      title: data.title.trim(),
      description: data.description.trim() || null,
      sort_order: nextSortOrder,
      is_active: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhyChooseUs();

  return { success: true };
}

/* =========================================================
   UPDATE REASON
========================================================= */

export async function updateWhyChooseUsReason(
  id: string,
  data: {
    title: string;
    description: string;
  }
) {
  const { supabase } = await requireAuthenticatedUser();

  if (!data.title.trim()) {
    throw new Error("Reason title is required.");
  }

  const { error } = await supabase
    .from("homepage_why_choose_us_reasons")
    .update({
      title: data.title.trim(),
      description: data.description.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhyChooseUs();

  return { success: true };
}

/* =========================================================
   TOGGLE REASON
========================================================= */

export async function toggleWhyChooseUsReason(
  id: string,
  isActive: boolean
) {
  const { supabase } = await requireAuthenticatedUser();

  const { error } = await supabase
    .from("homepage_why_choose_us_reasons")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhyChooseUs();

  return { success: true };
}

/* =========================================================
   DELETE REASON
========================================================= */

export async function deleteWhyChooseUsReason(id: string) {
  const { supabase } = await requireAuthenticatedUser();

  const { error } = await supabase
    .from("homepage_why_choose_us_reasons")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhyChooseUs();

  return { success: true };
}

/* =========================================================
   REORDER REASONS
========================================================= */

export async function reorderWhyChooseUsReasons(
  reasons: {
    id: string;
    sortOrder: number;
  }[]
) {
  const { supabase } = await requireAuthenticatedUser();

  for (let index = 0; index < reasons.length; index++) {
    const reason = reasons[index];

    const { error } = await supabase
      .from("homepage_why_choose_us_reasons")
      .update({
        sort_order: reason.sortOrder,
        number: String(reason.sortOrder).padStart(2, "0"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", reason.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidateWhyChooseUs();

  return { success: true };
}