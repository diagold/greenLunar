"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AboutHeroData = {
  heading: string;
  highlight: string;
  ending: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
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

export async function updateAboutHero(
  id: string,
  data: AboutHeroData
) {
  const supabase = await getAuthenticatedClient();

  if (!data.heading.trim()) {
    throw new Error("Hero heading is required.");
  }

  if (!data.imageUrl.trim()) {
    throw new Error("Hero image is required.");
  }

  const { error } = await supabase
    .from("about_hero")
    .update({
      heading: data.heading.trim(),
      highlight: data.highlight.trim() || null,
      ending: data.ending.trim() || null,
      description: data.description.trim() || null,
      image_url: data.imageUrl.trim(),
      image_alt: data.imageAlt.trim() || "GreenLunar",
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/about");
  revalidatePath("/admin/about");
  revalidatePath("/admin/about/hero");

  return {
    success: true,
  };
}