"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";


/* =========================================================
   TYPES
========================================================= */

export type PurposeSettingsData = {
  eyebrow: string;
  heading: string;
  highlight: string;

  missionLabel: string;
  missionHeading: string;
  missionDescription: string;

  visionLabel: string;
  visionHeading: string;
  visionDescription: string;

  valuesLabel: string;
  valuesHeading: string;

  isActive: boolean;
};

export type CoreValueData = {
  sectionId: string;

  number: string;
  title: string;

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

function revalidatePurpose() {
  revalidatePath("/about");

  revalidatePath("/admin/about");

  revalidatePath(
    "/admin/about/purpose"
  );
}


/* =========================================================
   UPDATE PURPOSE
========================================================= */

export async function updatePurposeSettings(
  id: string,
  data: PurposeSettingsData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.heading.trim()) {
    throw new Error(
      "Purpose heading is required."
    );
  }

  const { error } = await supabase
    .from("about_purpose")
    .update({
      eyebrow:
        data.eyebrow.trim() || null,

      heading:
        data.heading.trim(),

      highlight:
        data.highlight.trim() || null,

      mission_label:
        data.missionLabel.trim() || null,

      mission_heading:
        data.missionHeading.trim() || null,

      mission_description:
        data.missionDescription.trim() ||
        null,

      vision_label:
        data.visionLabel.trim() || null,

      vision_heading:
        data.visionHeading.trim() || null,

      vision_description:
        data.visionDescription.trim() ||
        null,

      values_label:
        data.valuesLabel.trim() || null,

      values_heading:
        data.valuesHeading.trim() || null,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePurpose();
}


/* =========================================================
   CREATE CORE VALUE
========================================================= */

export async function createCoreValue(
  data: CoreValueData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.title.trim()) {
    throw new Error(
      "Core value title is required."
    );
  }

  let sortOrder =
    data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const {
      data: lastValue,
      error,
    } = await supabase
      .from("about_core_values")
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

    if (error) {
      throw new Error(error.message);
    }

    sortOrder =
      (lastValue?.sort_order ?? 0) +
      1;
  }

  const {
    data: coreValue,
    error,
  } = await supabase
    .from("about_core_values")
    .insert({
      section_id:
        data.sectionId,

      number:
        data.number.trim() || null,

      title:
        data.title.trim(),

      sort_order:
        sortOrder,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePurpose();

  return { coreValue };
}


/* =========================================================
   UPDATE CORE VALUE
========================================================= */

export async function updateCoreValue(
  id: string,
  data: CoreValueData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.title.trim()) {
    throw new Error(
      "Core value title is required."
    );
  }

  const { error } = await supabase
    .from("about_core_values")
    .update({
      number:
        data.number.trim() || null,

      title:
        data.title.trim(),

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

  revalidatePurpose();
}


/* =========================================================
   TOGGLE CORE VALUE
========================================================= */

export async function toggleCoreValue(
  id: string,
  isActive: boolean
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from("about_core_values")
    .update({
      is_active:
        isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePurpose();
}


/* =========================================================
   DELETE CORE VALUE
========================================================= */

export async function deleteCoreValue(
  id: string
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from("about_core_values")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePurpose();
}


/* =========================================================
   REORDER CORE VALUES
========================================================= */

export async function reorderCoreValues(
  ids: string[]
) {
  const supabase =
    await getAuthenticatedClient();

  const results =
    await Promise.all(
      ids.map(
        (id, index) =>
          supabase
            .from(
              "about_core_values"
            )
            .update({
              sort_order:
                index + 1,

              updated_at:
                new Date().toISOString(),
            })
            .eq("id", id)
      )
    );

  const failed =
    results.find(
      (result) =>
        result.error
    );

  if (failed?.error) {
    throw new Error(
      failed.error.message
    );
  }

  revalidatePurpose();
}