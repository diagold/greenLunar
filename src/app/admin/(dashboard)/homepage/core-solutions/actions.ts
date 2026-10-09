"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/* =========================================================
   AUTH
========================================================= */

async function requireAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error(
      "You must be logged in to perform this action."
    );
  }

  return { supabase, user };
}

/* =========================================================
   TYPES
========================================================= */

export type CoreSolutionsSettingsData = {
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
  isActive: boolean;
};

export type CoreSolutionItemData = {
  sectionId: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkLabel: string;
  sortOrder: number;
  isActive: boolean;
};

/* =========================================================
   REVALIDATE
========================================================= */

function revalidateCoreSolutions() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath(
    "/admin/homepage/core-solutions"
  );
}

/* =========================================================
   UPDATE SECTION SETTINGS
========================================================= */

export async function updateCoreSolutionsSettings(
  id: string,
  data: CoreSolutionsSettingsData
) {
  const { supabase } =
    await requireAuthenticatedUser();

  if (!id) {
    throw new Error(
      "Core Solutions settings ID is required."
    );
  }

  if (!data.heading.trim()) {
    throw new Error(
      "Section heading is required."
    );
  }

  const { error } = await supabase
    .from("homepage_core_solutions")
    .update({
      eyebrow: data.eyebrow.trim() || null,
      heading: data.heading.trim(),
      highlight: data.highlight.trim() || null,
      description:
        data.description.trim() || null,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCoreSolutions();

  return {
    success: true,
  };
}

/* =========================================================
   CREATE CORE SOLUTION ITEM
========================================================= */

export async function createCoreSolutionItem(
  data: CoreSolutionItemData
) {
  const { supabase } =
    await requireAuthenticatedUser();

  if (!data.sectionId) {
    throw new Error(
      "Core Solutions section ID is required."
    );
  }

  if (!data.title.trim()) {
    throw new Error(
      "Core Solution title is required."
    );
  }

  /*
   * If no sort order was supplied, place the new card
   * after the current last card.
   */

  let sortOrder = data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const { data: lastItem, error: orderError } =
      await supabase
        .from("homepage_core_solution_items")
        .select("sort_order")
        .eq("section_id", data.sectionId)
        .order("sort_order", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (orderError) {
      throw new Error(orderError.message);
    }

    sortOrder =
      (lastItem?.sort_order ?? 0) + 1;
  }

  const { data: item, error } =
    await supabase
      .from("homepage_core_solution_items")
      .insert({
        section_id: data.sectionId,
        title: data.title.trim(),
        description:
          data.description.trim() || null,
        image_url:
          data.imageUrl.trim() || null,
        link_url:
          data.linkUrl.trim() || null,
        link_label:
          data.linkLabel.trim() ||
          "Learn More",
        sort_order: sortOrder,
        is_active: data.isActive,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateCoreSolutions();

  return {
    success: true,
    item,
  };
}

/* =========================================================
   UPDATE CORE SOLUTION ITEM
========================================================= */

export async function updateCoreSolutionItem(
  id: string,
  data: CoreSolutionItemData
) {
  const { supabase } =
    await requireAuthenticatedUser();

  if (!id) {
    throw new Error(
      "Core Solution item ID is required."
    );
  }

  if (!data.title.trim()) {
    throw new Error(
      "Core Solution title is required."
    );
  }

  const { error } = await supabase
    .from("homepage_core_solution_items")
    .update({
      section_id: data.sectionId,
      title: data.title.trim(),
      description:
        data.description.trim() || null,
      image_url:
        data.imageUrl.trim() || null,
      link_url:
        data.linkUrl.trim() || null,
      link_label:
        data.linkLabel.trim() ||
        "Learn More",
      sort_order: data.sortOrder,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCoreSolutions();

  return {
    success: true,
  };
}

/* =========================================================
   TOGGLE CORE SOLUTION ITEM
========================================================= */

export async function toggleCoreSolutionItem(
  id: string,
  isActive: boolean
) {
  const { supabase } =
    await requireAuthenticatedUser();

  if (!id) {
    throw new Error(
      "Core Solution item ID is required."
    );
  }

  const { error } = await supabase
    .from("homepage_core_solution_items")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCoreSolutions();

  return {
    success: true,
  };
}

/* =========================================================
   DELETE CORE SOLUTION ITEM
========================================================= */

export async function deleteCoreSolutionItem(
  id: string
) {
  const { supabase } =
    await requireAuthenticatedUser();

  if (!id) {
    throw new Error(
      "Core Solution item ID is required."
    );
  }

  const { error } = await supabase
    .from("homepage_core_solution_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateCoreSolutions();

  return {
    success: true,
  };
}

/* =========================================================
   REORDER CORE SOLUTION ITEMS
========================================================= */

export async function reorderCoreSolutionItems(
  itemIds: string[]
) {
  const { supabase } =
    await requireAuthenticatedUser();

  if (!itemIds.length) {
    throw new Error(
      "No Core Solution items were supplied."
    );
  }

  /*
   * Update each item's sort order.
   *
   * Using Promise.all keeps the action simple and gives
   * us deterministic 1, 2, 3... ordering.
   */

  const results = await Promise.all(
    itemIds.map((id, index) =>
      supabase
        .from("homepage_core_solution_items")
        .update({
          sort_order: index + 1,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
    )
  );

  const failedResult = results.find(
    (result) => result.error
  );

  if (failedResult?.error) {
    throw new Error(
      failedResult.error.message
    );
  }

  revalidateCoreSolutions();

  return {
    success: true,
  };
}