"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AtAGlanceSettingsData = {
  eyebrow: string;
  description: string;
  isActive: boolean;
};

export type AtAGlanceStatData = {
  sectionId: string;
  value: number;
  suffix: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

async function getAuthenticatedClient() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized.");
  }

  return supabase;
}

function revalidateAtAGlance() {
  revalidatePath("/about");
  revalidatePath("/admin/about");
  revalidatePath("/admin/about/at-a-glance");
}

export async function updateAtAGlanceSettings(
  id: string,
  data: AtAGlanceSettingsData
) {
  const supabase = await getAuthenticatedClient();

  const { error } = await supabase
    .from("about_at_a_glance")
    .update({
      eyebrow: data.eyebrow.trim() || null,
      description: data.description.trim() || null,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAtAGlance();
}

export async function createAtAGlanceStat(
  data: AtAGlanceStatData
) {
  const supabase = await getAuthenticatedClient();

  if (!data.title.trim()) {
    throw new Error("Statistic title is required.");
  }

  if (!Number.isFinite(data.value) || data.value < 0) {
    throw new Error("Enter a valid statistic value.");
  }

  let sortOrder = data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const { data: lastStat, error } = await supabase
      .from("about_at_a_glance_stats")
      .select("sort_order")
      .eq("section_id", data.sectionId)
      .order("sort_order", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    sortOrder = (lastStat?.sort_order ?? 0) + 1;
  }

  const { data: stat, error } = await supabase
    .from("about_at_a_glance_stats")
    .insert({
      section_id: data.sectionId,
      value: data.value,
      suffix: data.suffix.trim() || null,
      title: data.title.trim(),
      description: data.description.trim() || null,
      sort_order: sortOrder,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateAtAGlance();

  return { stat };
}

export async function updateAtAGlanceStat(
  id: string,
  data: AtAGlanceStatData
) {
  const supabase = await getAuthenticatedClient();

  if (!data.title.trim()) {
    throw new Error("Statistic title is required.");
  }

  const { error } = await supabase
    .from("about_at_a_glance_stats")
    .update({
      value: data.value,
      suffix: data.suffix.trim() || null,
      title: data.title.trim(),
      description: data.description.trim() || null,
      sort_order: data.sortOrder,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAtAGlance();
}

export async function toggleAtAGlanceStat(
  id: string,
  isActive: boolean
) {
  const supabase = await getAuthenticatedClient();

  const { error } = await supabase
    .from("about_at_a_glance_stats")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAtAGlance();
}

export async function deleteAtAGlanceStat(
  id: string
) {
  const supabase = await getAuthenticatedClient();

  const { error } = await supabase
    .from("about_at_a_glance_stats")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateAtAGlance();
}

export async function reorderAtAGlanceStats(
  ids: string[]
) {
  const supabase = await getAuthenticatedClient();

  const results = await Promise.all(
    ids.map((id, index) =>
      supabase
        .from("about_at_a_glance_stats")
        .update({
          sort_order: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
    )
  );

  const failed = results.find(
    (result) => result.error
  );

  if (failed?.error) {
    throw new Error(failed.error.message);
  }

  revalidateAtAGlance();
}