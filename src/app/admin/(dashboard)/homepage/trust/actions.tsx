"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/* =========================================================
   TYPES
========================================================= */

export type TrustSectionData = {
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
};

export type TrustStatData = {
  sectionId: string;
  value: string;
  unit: string;
  label: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};

/* =========================================================
   AUTH
========================================================= */

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

/* =========================================================
   REVALIDATION
========================================================= */

function revalidateTrustSection() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/trust");
}

/* =========================================================
   UPDATE SECTION
========================================================= */

export async function updateTrustSection(
  id: string,
  data: TrustSectionData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.heading.trim()) {
    throw new Error(
      "Section heading is required."
    );
  }

  const { error } = await supabase
    .from("homepage_trust_section")
    .update({
      eyebrow:
        data.eyebrow.trim() || null,

      heading:
        data.heading.trim(),

      highlight:
        data.highlight.trim() || null,

      description:
        data.description.trim() || null,

      cta_label:
        data.ctaLabel.trim() || null,

      cta_url:
        data.ctaUrl.trim() || null,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateTrustSection();
}

/* =========================================================
   CREATE STAT
========================================================= */

export async function createTrustStat(
  data: TrustStatData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.value.trim()) {
    throw new Error(
      "Statistic value is required."
    );
  }

  if (!data.label.trim()) {
    throw new Error(
      "Statistic label is required."
    );
  }

  let sortOrder = data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const {
      data: lastStat,
      error: lastStatError,
    } = await supabase
      .from("homepage_trust_stats")
      .select("sort_order")
      .eq(
        "section_id",
        data.sectionId
      )
      .order("sort_order", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (lastStatError) {
      throw new Error(
        lastStatError.message
      );
    }

    sortOrder =
      (lastStat?.sort_order ?? 0) + 1;
  }

  const {
    data: stat,
    error,
  } = await supabase
    .from("homepage_trust_stats")
    .insert({
      section_id:
        data.sectionId,

      value:
        data.value.trim(),

      unit:
        data.unit.trim() || null,

      label:
        data.label.trim(),

      icon:
        data.icon.trim() || "users",

      sort_order:
        sortOrder,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .select(`
      id,
      section_id,
      value,
      unit,
      label,
      icon,
      sort_order,
      is_active,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateTrustSection();

  return { stat };
}

/* =========================================================
   UPDATE STAT
========================================================= */

export async function updateTrustStat(
  id: string,
  data: TrustStatData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.value.trim()) {
    throw new Error(
      "Statistic value is required."
    );
  }

  if (!data.label.trim()) {
    throw new Error(
      "Statistic label is required."
    );
  }

  const { error } = await supabase
    .from("homepage_trust_stats")
    .update({
      section_id:
        data.sectionId,

      value:
        data.value.trim(),

      unit:
        data.unit.trim() || null,

      label:
        data.label.trim(),

      icon:
        data.icon.trim() || "users",

      sort_order:
        data.sortOrder,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateTrustSection();
}

/* =========================================================
   TOGGLE STAT
========================================================= */

export async function toggleTrustStat(
  id: string,
  isActive: boolean
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from("homepage_trust_stats")
    .update({
      is_active: isActive,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateTrustSection();
}

/* =========================================================
   DELETE STAT
========================================================= */

export async function deleteTrustStat(
  id: string
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from("homepage_trust_stats")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateTrustSection();
}

/* =========================================================
   REORDER STATS
========================================================= */

export async function reorderTrustStats(
  statIds: string[]
) {
  const supabase =
    await getAuthenticatedClient();

  const results = await Promise.all(
    statIds.map((id, index) =>
      supabase
        .from("homepage_trust_stats")
        .update({
          sort_order: index + 1,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
    )
  );

  const failed =
    results.find(
      (result) => result.error
    );

  if (failed?.error) {
    throw new Error(
      failed.error.message
    );
  }

  revalidateTrustSection();
}