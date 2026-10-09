"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type WhoWeAreSettingsData = {
  eyebrow: string;
  heading: string;
  highlight: string;

  paragraphOne: string;
  paragraphTwo: string;
  paragraphThree: string;

  isActive: boolean;
};

export type WhoWeAreImageData = {
  sectionId: string;

  imageUrl: string;
  imageAlt: string;

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

function revalidateWhoWeAre() {
  revalidatePath("/about");

  revalidatePath("/admin/about");

  revalidatePath(
    "/admin/about/who-we-are"
  );
}


/* =========================================================
   UPDATE SECTION
========================================================= */

export async function updateWhoWeAreSettings(
  id: string,
  data: WhoWeAreSettingsData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.heading.trim()) {
    throw new Error(
      "Section heading is required."
    );
  }

  const { error } = await supabase
    .from("about_who_we_are")
    .update({
      eyebrow:
        data.eyebrow.trim() || null,

      heading:
        data.heading.trim(),

      highlight:
        data.highlight.trim() || null,

      paragraph_one:
        data.paragraphOne.trim() || null,

      paragraph_two:
        data.paragraphTwo.trim() || null,

      paragraph_three:
        data.paragraphThree.trim() || null,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhoWeAre();
}


/* =========================================================
   CREATE IMAGE
========================================================= */

export async function createWhoWeAreImage(
  data: WhoWeAreImageData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.imageUrl.trim()) {
    throw new Error(
      "Image is required."
    );
  }

  let sortOrder =
    data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const {
      data: lastImage,
      error: orderError,
    } = await supabase
      .from(
        "about_who_we_are_images"
      )
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

    if (orderError) {
      throw new Error(
        orderError.message
      );
    }

    sortOrder =
      (lastImage?.sort_order ?? 0) +
      1;
  }

  const {
    data: image,
    error,
  } = await supabase
    .from(
      "about_who_we_are_images"
    )
    .insert({
      section_id:
        data.sectionId,

      image_url:
        data.imageUrl.trim(),

      image_alt:
        data.imageAlt.trim() ||
        "GreenLunar",

      sort_order: sortOrder,

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

  revalidateWhoWeAre();

  return { image };
}


/* =========================================================
   UPDATE IMAGE
========================================================= */

export async function updateWhoWeAreImage(
  id: string,
  data: WhoWeAreImageData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.imageUrl.trim()) {
    throw new Error(
      "Image is required."
    );
  }

  const { error } = await supabase
    .from(
      "about_who_we_are_images"
    )
    .update({
      section_id:
        data.sectionId,

      image_url:
        data.imageUrl.trim(),

      image_alt:
        data.imageAlt.trim() ||
        "GreenLunar",

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

  revalidateWhoWeAre();
}


/* =========================================================
   TOGGLE IMAGE
========================================================= */

export async function toggleWhoWeAreImage(
  id: string,
  isActive: boolean
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "about_who_we_are_images"
    )
    .update({
      is_active: isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhoWeAre();
}


/* =========================================================
   DELETE IMAGE
========================================================= */

export async function deleteWhoWeAreImage(
  id: string
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "about_who_we_are_images"
    )
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateWhoWeAre();
}


/* =========================================================
   REORDER IMAGES
========================================================= */

export async function reorderWhoWeAreImages(
  imageIds: string[]
) {
  const supabase =
    await getAuthenticatedClient();

  const results =
    await Promise.all(
      imageIds.map(
        (id, index) =>
          supabase
            .from(
              "about_who_we_are_images"
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

  revalidateWhoWeAre();
}