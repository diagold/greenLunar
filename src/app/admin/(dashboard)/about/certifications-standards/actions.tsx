"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";


/* =========================================================
   TYPES
========================================================= */

export type CertificationSettingsData = {
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;

  frameworksEyebrow: string;
  frameworksHeading: string;
  frameworksHighlight: string;
  frameworksDescription: string;

  isActive: boolean;
};


export type CertificationItemData = {
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};


export type CertificationLogoData = {
  sectionId: string;

  name: string;
  logoUrl: string;
  imageAlt: string;
  websiteUrl: string;

  sortOrder: number;
  isActive: boolean;
};


/* =========================================================
   AUTHENTICATED CLIENT
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
   REVALIDATE
========================================================= */

function revalidateCertifications() {
  revalidatePath("/about");

  revalidatePath("/admin/about");

  revalidatePath(
    "/admin/about/certifications-standards"
  );
}


/* =========================================================
   UPDATE SECTION SETTINGS
========================================================= */

export async function updateCertificationSettings(
  id: string,
  data: CertificationSettingsData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.heading.trim()) {
    throw new Error(
      "Heading is required."
    );
  }

  const { error } = await supabase
    .from(
      "about_certifications_standards"
    )
    .update({
      eyebrow:
        data.eyebrow.trim() ||
        null,

      heading:
        data.heading.trim(),

      highlight:
        data.highlight.trim() ||
        null,

      description:
        data.description.trim() ||
        null,

      frameworks_eyebrow:
        data.frameworksEyebrow.trim() ||
        null,

      frameworks_heading:
        data.frameworksHeading.trim() ||
        null,

      frameworks_highlight:
        data.frameworksHighlight.trim() ||
        null,

      frameworks_description:
        data.frameworksDescription.trim() ||
        null,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Update certifications error:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      error.message ||
        "Unable to update certifications."
    );
  }

  revalidateCertifications();
}


/* =========================================================
   CREATE STANDARD CARD
========================================================= */

export async function createCertificationItem(
  data: CertificationItemData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.title.trim()) {
    throw new Error(
      "Standard title is required."
    );
  }

  let sortOrder =
    data.sortOrder;

  if (
    !sortOrder ||
    sortOrder < 1
  ) {
    const {
      data: lastItem,
      error: orderError,
    } = await supabase
      .from(
        "about_certification_items"
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
      (lastItem?.sort_order ??
        0) + 1;
  }

  const {
    data: item,
    error,
  } = await supabase
    .from(
      "about_certification_items"
    )
    .insert({
      section_id:
        data.sectionId,

      title:
        data.title.trim(),

      description:
        data.description.trim() ||
        null,

      icon:
        data.icon.trim() ||
        "shield",

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
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();

  return { item };
}


/* =========================================================
   UPDATE STANDARD CARD
========================================================= */

export async function updateCertificationItem(
  id: string,
  data: CertificationItemData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.title.trim()) {
    throw new Error(
      "Standard title is required."
    );
  }

  const { error } = await supabase
    .from(
      "about_certification_items"
    )
    .update({
      title:
        data.title.trim(),

      description:
        data.description.trim() ||
        null,

      icon:
        data.icon.trim() ||
        "shield",

      sort_order:
        data.sortOrder,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();
}


/* =========================================================
   TOGGLE STANDARD
========================================================= */

export async function toggleCertificationItem(
  id: string,
  isActive: boolean
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "about_certification_items"
    )
    .update({
      is_active:
        isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();
}


/* =========================================================
   DELETE STANDARD
========================================================= */

export async function deleteCertificationItem(
  id: string
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "about_certification_items"
    )
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();
}


/* =========================================================
   REORDER STANDARDS
========================================================= */

export async function reorderCertificationItems(
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
              "about_certification_items"
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

  revalidateCertifications();
}


/* =========================================================
   CREATE LOGO
========================================================= */

export async function createCertificationLogo(
  data: CertificationLogoData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.name.trim()) {
    throw new Error(
      "Certification name is required."
    );
  }

  if (!data.logoUrl.trim()) {
    throw new Error(
      "Certification logo is required."
    );
  }

  let sortOrder =
    data.sortOrder;

  if (
    !sortOrder ||
    sortOrder < 1
  ) {
    const {
      data: lastLogo,
      error: orderError,
    } = await supabase
      .from(
        "about_certification_logos"
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
      (lastLogo?.sort_order ??
        0) + 1;
  }

  const {
    data: logo,
    error,
  } = await supabase
    .from(
      "about_certification_logos"
    )
    .insert({
      section_id:
        data.sectionId,

      name:
        data.name.trim(),

      logo_url:
        data.logoUrl.trim(),

      image_alt:
        data.imageAlt.trim() ||
        data.name.trim(),

      website_url:
        data.websiteUrl.trim() ||
        null,

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
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();

  return { logo };
}


/* =========================================================
   UPDATE LOGO
========================================================= */

export async function updateCertificationLogo(
  id: string,
  data: CertificationLogoData
) {
  const supabase =
    await getAuthenticatedClient();

  if (!data.name.trim()) {
    throw new Error(
      "Certification name is required."
    );
  }

  if (!data.logoUrl.trim()) {
    throw new Error(
      "Certification logo is required."
    );
  }

  const { error } = await supabase
    .from(
      "about_certification_logos"
    )
    .update({
      name:
        data.name.trim(),

      logo_url:
        data.logoUrl.trim(),

      image_alt:
        data.imageAlt.trim() ||
        data.name.trim(),

      website_url:
        data.websiteUrl.trim() ||
        null,

      sort_order:
        data.sortOrder,

      is_active:
        data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();
}


/* =========================================================
   TOGGLE LOGO
========================================================= */

export async function toggleCertificationLogo(
  id: string,
  isActive: boolean
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "about_certification_logos"
    )
    .update({
      is_active:
        isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();
}


/* =========================================================
   DELETE LOGO
========================================================= */

export async function deleteCertificationLogo(
  id: string
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "about_certification_logos"
    )
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidateCertifications();
}


/* =========================================================
   REORDER LOGOS
========================================================= */

export async function reorderCertificationLogos(
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
              "about_certification_logos"
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

  revalidateCertifications();
}