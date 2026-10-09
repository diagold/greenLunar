"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { HeroSlideFormData } from "@/types/hero";

/* =========================================================
   HELPERS
========================================================= */

function cleanText(value: string | undefined | null) {
  const cleaned = value?.trim();

  return cleaned ? cleaned : null;
}

async function requireAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in to manage homepage hero slides.");
  }

  return supabase;
}

function revalidateHeroPaths() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/hero");
}

/* =========================================================
   CREATE HERO SLIDE
========================================================= */

export async function createHeroSlide(formData: HeroSlideFormData) {
  const supabase = await requireAuthenticatedUser();

  const title = formData.title.trim();

  if (!title) {
    throw new Error("Hero title is required.");
  }

  const { data, error } = await supabase
    .from("homepage_hero_slides")
    .insert({
      eyebrow: cleanText(formData.eyebrow),
      title,
      highlight: cleanText(formData.highlight),
      ending: cleanText(formData.ending),
      description: cleanText(formData.description),
      image_url: cleanText(formData.imageUrl),
      sort_order: Number(formData.sortOrder) || 0,
      is_active: formData.isActive,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Create hero slide error:", error);
    throw new Error(error.message || "Unable to create hero slide.");
  }

  revalidateHeroPaths();

  return {
    success: true,
    id: data.id,
  };
}

/* =========================================================
   UPDATE HERO SLIDE
========================================================= */

export async function updateHeroSlide(
  id: string,
  formData: HeroSlideFormData
) {
  const supabase = await requireAuthenticatedUser();

  if (!id) {
    throw new Error("Hero slide ID is required.");
  }

  const title = formData.title.trim();

  if (!title) {
    throw new Error("Hero title is required.");
  }

  const { error } = await supabase
    .from("homepage_hero_slides")
    .update({
      eyebrow: cleanText(formData.eyebrow),
      title,
      highlight: cleanText(formData.highlight),
      ending: cleanText(formData.ending),
      description: cleanText(formData.description),
      image_url: cleanText(formData.imageUrl),
      sort_order: Number(formData.sortOrder) || 0,
      is_active: formData.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update hero slide error:", error);
    throw new Error(error.message || "Unable to update hero slide.");
  }

  revalidateHeroPaths();

  return {
    success: true,
    id,
  };
}

/* =========================================================
   ACTIVATE / DEACTIVATE HERO SLIDE
========================================================= */

export async function setHeroSlideActive(
  id: string,
  isActive: boolean
) {
  const supabase = await requireAuthenticatedUser();

  if (!id) {
    throw new Error("Hero slide ID is required.");
  }

  const { error } = await supabase
    .from("homepage_hero_slides")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Hero active status error:", error);
    throw new Error(
      error.message || "Unable to change hero slide status."
    );
  }

  revalidateHeroPaths();

  return {
    success: true,
    id,
    isActive,
  };
}

/* =========================================================
   DELETE HERO SLIDE
========================================================= */

export async function deleteHeroSlide(id: string) {
  const supabase = await requireAuthenticatedUser();

  if (!id) {
    throw new Error("Hero slide ID is required.");
  }

  const { error } = await supabase
    .from("homepage_hero_slides")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete hero slide error:", error);
    throw new Error(error.message || "Unable to delete hero slide.");
  }

  revalidateHeroPaths();

  return {
    success: true,
    id,
  };
}

/* =========================================================
   REORDER HERO SLIDES
========================================================= */

export async function reorderHeroSlides(
  slides: Array<{
    id: string;
    sortOrder: number;
  }>
) {
  const supabase = await requireAuthenticatedUser();

  if (!slides.length) {
    return {
      success: true,
    };
  }

  for (const slide of slides) {
    if (!slide.id) {
      continue;
    }

    const { error } = await supabase
      .from("homepage_hero_slides")
      .update({
        sort_order: slide.sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", slide.id);

    if (error) {
      console.error("Reorder hero slides error:", error);

      throw new Error(
        error.message || "Unable to reorder hero slides."
      );
    }
  }

  revalidateHeroPaths();

  return {
    success: true,
  };
}