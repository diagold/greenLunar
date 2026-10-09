"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type {
  ServiceContentItem,
  ServiceFormData,
  ServiceGalleryItem,
} from "@/types/service";

/* ==========================================================================
   HELPERS
   ========================================================================== */

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanContentItems(
  items: ServiceContentItem[]
): ServiceContentItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      title: item.title?.trim() ?? "",
      description:
        item.description?.trim() ?? "",
    }))
    .filter(
      (item) =>
        item.title.length > 0 ||
        item.description.length > 0
    );
}

function cleanGallery(
  gallery: ServiceGalleryItem[]
): ServiceGalleryItem[] {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery
    .map((item) => ({
      url: item.url?.trim() ?? "",
      alt: item.alt?.trim() ?? "",
    }))
    .filter(
      (item) => item.url.length > 0
    );
}

function revalidateServicePaths(
  slug?: string,
  oldSlug?: string
) {
  revalidatePath("/admin");
  revalidatePath("/admin/services");

  revalidatePath("/services");

  if (slug) {
    revalidatePath(
      `/services/${slug}`
    );
  }

  if (
    oldSlug &&
    oldSlug !== slug
  ) {
    revalidatePath(
      `/services/${oldSlug}`
    );
  }
}

/* ==========================================================================
   CREATE SERVICE
   ========================================================================== */

export async function createService(
  service: ServiceFormData
) {
  const supabase =
    await createClient();

  /* ------------------------------------------------------------------------
     AUTHENTICATION
     ------------------------------------------------------------------------ */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    throw new Error(
      "You must be signed in to create a service."
    );
  }

  /* ------------------------------------------------------------------------
     VALIDATION
     ------------------------------------------------------------------------ */

  const name =
    service.name.trim();

  if (!name) {
    throw new Error(
      "Service name is required."
    );
  }

  const slug =
    generateSlug(
      service.slug || name
    );

  if (!slug) {
    throw new Error(
      "A valid service slug is required."
    );
  }

  /* ------------------------------------------------------------------------
     CHECK DUPLICATE SLUG
     ------------------------------------------------------------------------ */

  const {
    data: existingService,
    error: duplicateError,
  } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (duplicateError) {
    console.error(
      "Service slug check error:",
      duplicateError
    );

    throw new Error(
      "Unable to validate the service URL."
    );
  }

  if (existingService) {
    throw new Error(
      "A service with this URL slug already exists."
    );
  }

  /* ------------------------------------------------------------------------
     CLEAN STRUCTURED CONTENT
     ------------------------------------------------------------------------ */

  const capabilities =
    cleanContentItems(
      service.capabilities
    );

  const benefits =
    cleanContentItems(
      service.benefits
    );

  const gallery =
    cleanGallery(
      service.gallery
    );

  /* ------------------------------------------------------------------------
     INSERT
     ------------------------------------------------------------------------ */

  const {
    data,
    error,
  } = await supabase
    .from("services")
    .insert({
      name,

      slug,

      category:
        service.category.trim() ||
        null,

      short_description:
        service.shortDescription.trim() ||
        null,

      description:
        service.description.trim() ||
        null,

      image_url:
        service.imageUrl.trim() ||
        null,

      gallery,

      capabilities,

      benefits,

      primary_button_text:
        service.primaryButtonText.trim() ||
        null,

      primary_button_url:
        service.primaryButtonUrl.trim() ||
        null,

      secondary_button_text:
        service.secondaryButtonText.trim() ||
        null,

      secondary_button_url:
        service.secondaryButtonUrl.trim() ||
        null,

      seo_title:
        service.seoTitle.trim() ||
        null,

      seo_description:
        service.seoDescription.trim() ||
        null,

      seo_keywords:
        service.seoKeywords.trim() ||
        null,

      seo_image_url:
        service.seoImageUrl.trim() ||
        null,

      status:
        service.status,

      featured:
        service.featured,

      sort_order:
        service.sortOrder,
    })
    .select("id, slug")
    .single();

  if (error) {
    console.error(
      "Create service error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to create service."
    );
  }

  revalidateServicePaths(
    data.slug
  );

  return {
    success: true,
    id: data.id,
    slug: data.slug,
  };
}

/* ==========================================================================
   UPDATE SERVICE
   ========================================================================== */

export async function updateService(
  id: string,
  service: ServiceFormData
) {
  const supabase =
    await createClient();

  /* ------------------------------------------------------------------------
     AUTHENTICATION
     ------------------------------------------------------------------------ */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    throw new Error(
      "You must be signed in to update a service."
    );
  }

  /* ------------------------------------------------------------------------
     VALIDATION
     ------------------------------------------------------------------------ */

  if (!id) {
    throw new Error(
      "Service ID is required."
    );
  }

  const name =
    service.name.trim();

  if (!name) {
    throw new Error(
      "Service name is required."
    );
  }

  const slug =
    generateSlug(
      service.slug || name
    );

  if (!slug) {
    throw new Error(
      "A valid service slug is required."
    );
  }

  /* ------------------------------------------------------------------------
     CURRENT SERVICE
     ------------------------------------------------------------------------ */

  const {
    data: currentService,
    error: currentError,
  } = await supabase
    .from("services")
    .select("id, slug")
    .eq("id", id)
    .maybeSingle();

  if (
    currentError ||
    !currentService
  ) {
    console.error(
      "Load service error:",
      currentError
    );

    throw new Error(
      "Service could not be found."
    );
  }

  /* ------------------------------------------------------------------------
     CHECK DUPLICATE SLUG
     ------------------------------------------------------------------------ */

  const {
    data: duplicateService,
    error: duplicateError,
  } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (duplicateError) {
    console.error(
      "Service slug check error:",
      duplicateError
    );

    throw new Error(
      "Unable to validate the service URL."
    );
  }

  if (duplicateService) {
    throw new Error(
      "Another service already uses this URL slug."
    );
  }

  /* ------------------------------------------------------------------------
     CLEAN STRUCTURED CONTENT
     ------------------------------------------------------------------------ */

  const capabilities =
    cleanContentItems(
      service.capabilities
    );

  const benefits =
    cleanContentItems(
      service.benefits
    );

  const gallery =
    cleanGallery(
      service.gallery
    );

  /* ------------------------------------------------------------------------
     UPDATE
     ------------------------------------------------------------------------ */

  const {
    data: updatedService,
    error,
  } = await supabase
    .from("services")
    .update({
      name,

      slug,

      category:
        service.category.trim() ||
        null,

      short_description:
        service.shortDescription.trim() ||
        null,

      description:
        service.description.trim() ||
        null,

      image_url:
        service.imageUrl.trim() ||
        null,

      gallery,

      capabilities,

      benefits,

      primary_button_text:
        service.primaryButtonText.trim() ||
        null,

      primary_button_url:
        service.primaryButtonUrl.trim() ||
        null,

      secondary_button_text:
        service.secondaryButtonText.trim() ||
        null,

      secondary_button_url:
        service.secondaryButtonUrl.trim() ||
        null,

      seo_title:
        service.seoTitle.trim() ||
        null,

      seo_description:
        service.seoDescription.trim() ||
        null,

      seo_keywords:
        service.seoKeywords.trim() ||
        null,

      seo_image_url:
        service.seoImageUrl.trim() ||
        null,

      status:
        service.status,

      featured:
        service.featured,

      sort_order:
        service.sortOrder,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) {
    console.error(
      "Update service error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to update service."
    );
  }

  revalidateServicePaths(
    updatedService.slug,
    currentService.slug
  );

  revalidatePath(
    `/admin/services/${id}`
  );

  return {
    success: true,
    id: updatedService.id,
    slug: updatedService.slug,
  };
}

/* ==========================================================================
   ARCHIVE SERVICE
   ========================================================================== */

export async function archiveService(
  id: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    throw new Error(
      "You must be signed in to archive a service."
    );
  }

  const {
    data: service,
    error,
  } = await supabase
    .from("services")
    .update({
      status: "archived",
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) {
    console.error(
      "Archive service error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to archive service."
    );
  }

  revalidateServicePaths(
    service.slug
  );

  revalidatePath(
    `/admin/services/${id}`
  );

  return {
    success: true,
  };
}

/* ==========================================================================
   RESTORE SERVICE
   ========================================================================== */

export async function restoreService(
  id: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    throw new Error(
      "You must be signed in to restore a service."
    );
  }

  const {
    data: service,
    error,
  } = await supabase
    .from("services")
    .update({
      status: "draft",
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) {
    console.error(
      "Restore service error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to restore service."
    );
  }

  revalidateServicePaths(
    service.slug
  );

  revalidatePath(
    `/admin/services/${id}`
  );

  return {
    success: true,
  };
}

/* ==========================================================================
   DELETE SERVICE
   ========================================================================== */

export async function deleteService(
  id: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    throw new Error(
      "You must be signed in to delete a service."
    );
  }

  /* ------------------------------------------------------------------------
     GET SLUG BEFORE DELETE
     ------------------------------------------------------------------------ */

  const {
    data: service,
    error: loadError,
  } = await supabase
    .from("services")
    .select("id, slug")
    .eq("id", id)
    .maybeSingle();

  if (
    loadError ||
    !service
  ) {
    throw new Error(
      "Service could not be found."
    );
  }

  /* ------------------------------------------------------------------------
     DELETE
     ------------------------------------------------------------------------ */

  const { error } =
    await supabase
      .from("services")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "Delete service error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to delete service."
    );
  }

  revalidateServicePaths(
    service.slug
  );

  return {
    success: true,
  };
}