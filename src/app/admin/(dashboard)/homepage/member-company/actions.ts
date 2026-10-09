"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MemberCompanySettingsData = {
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
  secondaryDescription: string;

  statementEyebrow: string;
  statementHeading: string;
  statementHighlight: string;
  statementDescription: string;

  ctaLabel: string;
  ctaUrl: string;

  isActive: boolean;
};

export type MemberCompanyItemData = {
  sectionId: string;
  name: string;
  imageUrl: string;
  linkUrl: string;
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

function revalidateMemberCompany() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath(
    "/admin/homepage/member-company"
  );
}

/* =========================================================
   UPDATE SECTION SETTINGS
========================================================= */

export async function updateMemberCompanySettings(
  id: string,
  data: MemberCompanySettingsData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.heading.trim()) {
    throw new Error(
      "Section heading is required."
    );
  }

  const { error } = await supabase
    .from("homepage_member_company")
    .update({
      eyebrow:
        data.eyebrow.trim() || null,

      heading:
        data.heading.trim(),

      highlight:
        data.highlight.trim() || null,

      description:
        data.description.trim() || null,

      secondary_description:
        data.secondaryDescription.trim() ||
        null,

      statement_eyebrow:
        data.statementEyebrow.trim() ||
        null,

      statement_heading:
        data.statementHeading.trim() ||
        null,

      statement_highlight:
        data.statementHighlight.trim() ||
        null,

      statement_description:
        data.statementDescription.trim() ||
        null,

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

  revalidateMemberCompany();
}

/* =========================================================
   CREATE COMPANY
========================================================= */

export async function createMemberCompanyItem(
  data: MemberCompanyItemData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.name.trim()) {
    throw new Error(
      "Company name is required."
    );
  }

  if (!data.imageUrl.trim()) {
    throw new Error(
      "Company image/logo is required."
    );
  }

  let sortOrder = data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const {
      data: lastItem,
      error: lastItemError,
    } = await supabase
      .from(
        "homepage_member_company_items"
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

    if (lastItemError) {
      throw new Error(
        lastItemError.message
      );
    }

    sortOrder =
      (lastItem?.sort_order ?? 0) + 1;
  }

  const {
    data: item,
    error,
  } = await supabase
    .from(
      "homepage_member_company_items"
    )
    .insert({
      section_id: data.sectionId,

      name: data.name.trim(),

      image_url:
        data.imageUrl.trim(),

      link_url:
        data.linkUrl.trim() || null,

      sort_order: sortOrder,

      is_active: data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateMemberCompany();

  return { item };
}

/* =========================================================
   UPDATE COMPANY
========================================================= */

export async function updateMemberCompanyItem(
  id: string,
  data: MemberCompanyItemData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.name.trim()) {
    throw new Error(
      "Company name is required."
    );
  }

  if (!data.imageUrl.trim()) {
    throw new Error(
      "Company image/logo is required."
    );
  }

  const { error } = await supabase
    .from(
      "homepage_member_company_items"
    )
    .update({
      section_id:
        data.sectionId,

      name:
        data.name.trim(),

      image_url:
        data.imageUrl.trim(),

      link_url:
        data.linkUrl.trim() || null,

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

  revalidateMemberCompany();
}

/* =========================================================
   TOGGLE COMPANY VISIBILITY
========================================================= */

export async function toggleMemberCompanyItem(
  id: string,
  isActive: boolean
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "homepage_member_company_items"
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

  revalidateMemberCompany();
}

/* =========================================================
   DELETE COMPANY
========================================================= */

export async function deleteMemberCompanyItem(
  id: string
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "homepage_member_company_items"
    )
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMemberCompany();
}

/* =========================================================
   REORDER COMPANIES
========================================================= */

export async function reorderMemberCompanyItems(
  itemIds: string[]
) {
  const supabase =
    await getAuthenticatedClient();

  const results =
    await Promise.all(
      itemIds.map((id, index) =>
        supabase
          .from(
            "homepage_member_company_items"
          )
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

  revalidateMemberCompany();
}