"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";


/* =========================================================
   TYPES
========================================================= */

export type LeadershipSettingsData = {
  // Section introduction
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;

  // Chairman
  chairmanImageUrl: string;
  chairmanImageAlt: string;
  chairmanLabel: string;
  chairmanPosition: string;
  chairmanName: string;
  chairmanDescription: string;

  // Executive section
  executivesEyebrow: string;
  executivesHeading: string;

  // Wider leadership panel
  teamDescription: string;
  teamLabel: string;

  // Section visibility
  isActive: boolean;
};


export type LeadershipMemberData = {
  sectionId: string;

  name: string;
  role: string;

  description: string;

  imageUrl: string;
  imageAlt: string;

  profileUrl: string;

  sortOrder: number;

  isActive: boolean;
};


/* =========================================================
   AUTHENTICATED SUPABASE CLIENT
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

function revalidateLeadership() {
  revalidatePath("/about");

  revalidatePath("/admin/about");

  revalidatePath("/admin/about/leadership");
}


/* =========================================================
   UPDATE LEADERSHIP SETTINGS
========================================================= */

export async function updateLeadershipSettings(
  id: string,
  data: LeadershipSettingsData
) {
  const supabase = await getAuthenticatedClient();

  if (!id) {
    throw new Error("Leadership section ID is required.");
  }

  if (!data.heading.trim()) {
    throw new Error("Leadership heading is required.");
  }

  if (!data.chairmanName.trim()) {
    throw new Error("Chairman name is required.");
  }

  if (!data.chairmanPosition.trim()) {
    throw new Error("Chairman position is required.");
  }

  const { error } = await supabase
    .from("about_leadership")
    .update({
      /* Section introduction */
      eyebrow: data.eyebrow.trim() || null,
      heading: data.heading.trim(),
      highlight: data.highlight.trim() || null,
      description: data.description.trim() || null,

      /* Chairman */
      chairman_image_url:
        data.chairmanImageUrl.trim() || null,

      chairman_image_alt:
        data.chairmanImageAlt.trim() || null,

      chairman_label:
        data.chairmanLabel.trim() || null,

      chairman_position:
        data.chairmanPosition.trim(),

      chairman_name:
        data.chairmanName.trim(),

      chairman_description:
        data.chairmanDescription.trim() || null,

      /* Executive section */
      executives_eyebrow:
        data.executivesEyebrow.trim() || null,

      executives_heading:
        data.executivesHeading.trim() || null,

      /* Wider leadership panel */
      team_description:
        data.teamDescription.trim() || null,

      team_label:
        data.teamLabel.trim() || null,

      /* Visibility */
      is_active: data.isActive,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update leadership settings error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      error.message || "Unable to update leadership section."
    );
  }

  revalidateLeadership();

  return {
    success: true,
  };
}


/* =========================================================
   CREATE EXECUTIVE MEMBER
========================================================= */

export async function createLeadershipMember(
  data: LeadershipMemberData
) {
  const supabase = await getAuthenticatedClient();

  if (!data.sectionId) {
    throw new Error("Leadership section ID is required.");
  }

  if (!data.name.trim()) {
    throw new Error("Executive name is required.");
  }

  if (!data.role.trim()) {
    throw new Error("Executive role is required.");
  }

  let sortOrder = data.sortOrder;

  /*
   * If no valid sort order is supplied,
   * place the executive at the end.
   */
  if (!sortOrder || sortOrder < 1) {
    const {
      data: lastMember,
      error: orderError,
    } = await supabase
      .from("about_leadership_members")
      .select("sort_order")
      .eq("section_id", data.sectionId)
      .order("sort_order", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      console.error("Leadership member order error:", {
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code,
      });

      throw new Error(
        orderError.message ||
          "Unable to determine executive position."
      );
    }

    sortOrder = (lastMember?.sort_order ?? 0) + 1;
  }

  const {
    data: member,
    error,
  } = await supabase
    .from("about_leadership_members")
    .insert({
      section_id: data.sectionId,

      name: data.name.trim(),

      role: data.role.trim(),

      description:
        data.description.trim() || null,

      image_url:
        data.imageUrl.trim() || null,

      image_alt:
        data.imageAlt.trim() ||
        data.name.trim(),

      profile_url:
        data.profileUrl.trim() || null,

      sort_order: sortOrder,

      is_active: data.isActive,

      updated_at: new Date().toISOString(),
    })
    .select(`
      id,
      section_id,
      name,
      role,
      description,
      image_url,
      image_alt,
      profile_url,
      sort_order,
      is_active
    `)
    .single();

  if (error) {
    console.error("Create leadership member error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      error.message || "Unable to create executive member."
    );
  }

  revalidateLeadership();

  return {
    member,
  };
}


/* =========================================================
   UPDATE EXECUTIVE MEMBER
========================================================= */

export async function updateLeadershipMember(
  id: string,
  data: LeadershipMemberData
) {
  const supabase = await getAuthenticatedClient();

  if (!id) {
    throw new Error("Executive ID is required.");
  }

  if (!data.name.trim()) {
    throw new Error("Executive name is required.");
  }

  if (!data.role.trim()) {
    throw new Error("Executive role is required.");
  }

  const { error } = await supabase
    .from("about_leadership_members")
    .update({
      name: data.name.trim(),

      role: data.role.trim(),

      description:
        data.description.trim() || null,

      image_url:
        data.imageUrl.trim() || null,

      image_alt:
        data.imageAlt.trim() ||
        data.name.trim(),

      profile_url:
        data.profileUrl.trim() || null,

      sort_order: data.sortOrder,

      is_active: data.isActive,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update leadership member error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      error.message || "Unable to update executive member."
    );
  }

  revalidateLeadership();

  return {
    success: true,
  };
}


/* =========================================================
   TOGGLE EXECUTIVE VISIBILITY
========================================================= */

export async function toggleLeadershipMember(
  id: string,
  isActive: boolean
) {
  const supabase = await getAuthenticatedClient();

  if (!id) {
    throw new Error("Executive ID is required.");
  }

  const { error } = await supabase
    .from("about_leadership_members")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Toggle leadership member error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      error.message || "Unable to change executive visibility."
    );
  }

  revalidateLeadership();

  return {
    success: true,
  };
}


/* =========================================================
   DELETE EXECUTIVE MEMBER
========================================================= */

export async function deleteLeadershipMember(
  id: string
) {
  const supabase = await getAuthenticatedClient();

  if (!id) {
    throw new Error("Executive ID is required.");
  }

  const { error } = await supabase
    .from("about_leadership_members")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete leadership member error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      error.message || "Unable to delete executive member."
    );
  }

  revalidateLeadership();

  return {
    success: true,
  };
}


/* =========================================================
   REORDER EXECUTIVE MEMBERS
========================================================= */

export async function reorderLeadershipMembers(
  ids: string[]
) {
  const supabase = await getAuthenticatedClient();

  if (!Array.isArray(ids)) {
    throw new Error("Invalid executive order.");
  }

  /*
   * Nothing needs to be updated if the
   * collection is empty.
   */
  if (ids.length === 0) {
    return {
      success: true,
    };
  }

  const updatedAt = new Date().toISOString();

  const results = await Promise.all(
    ids.map((id, index) =>
      supabase
        .from("about_leadership_members")
        .update({
          sort_order: index + 1,
          updated_at: updatedAt,
        })
        .eq("id", id)
    )
  );

  const failedResult = results.find(
    (result) => result.error
  );

  if (failedResult?.error) {
    console.error("Reorder leadership members error:", {
      message: failedResult.error.message,
      details: failedResult.error.details,
      hint: failedResult.error.hint,
      code: failedResult.error.code,
    });

    throw new Error(
      failedResult.error.message ||
        "Unable to reorder executive members."
    );
  }

  revalidateLeadership();

  return {
    success: true,
  };
}