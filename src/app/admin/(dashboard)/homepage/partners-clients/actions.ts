"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PartnersClientsSettingsData = {
  eyebrow: string;
  heading: string;
  description: string;

  partnersEyebrow: string;
  partnersHeading: string;
  partnersDescription: string;

  clientsEyebrow: string;
  clientsHeading: string;
  clientsDescription: string;

  isActive: boolean;
};

export type PartnerClientItemData = {
  sectionId: string;
  itemType: "partner" | "client";
  name: string;
  logoUrl: string;
  websiteUrl: string;
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

function revalidatePartnersClients() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/partners-clients");
}

export async function updatePartnersClientsSettings(
  id: string,
  data: PartnersClientsSettingsData
) {
  const supabase = await getAuthenticatedClient();

  if (!data.heading.trim()) {
    throw new Error("Section heading is required.");
  }

  const { error } = await supabase
    .from("homepage_partners_clients")
    .update({
      eyebrow: data.eyebrow.trim() || null,
      heading: data.heading.trim(),
      description: data.description.trim() || null,

      partners_eyebrow: data.partnersEyebrow.trim() || null,
      partners_heading: data.partnersHeading.trim() || null,
      partners_description: data.partnersDescription.trim() || null,

      clients_eyebrow: data.clientsEyebrow.trim() || null,
      clients_heading: data.clientsHeading.trim() || null,
      clients_description: data.clientsDescription.trim() || null,

      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePartnersClients();
}

export async function createPartnerClientItem(
  data: PartnerClientItemData
) {
  const supabase = await getAuthenticatedClient();

  if (!data.name.trim()) {
    throw new Error("Name is required.");
  }

  if (!data.logoUrl.trim()) {
    throw new Error("Logo is required.");
  }

  let sortOrder = data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const { data: lastItem, error: lastItemError } = await supabase
      .from("homepage_partner_client_items")
      .select("sort_order")
      .eq("section_id", data.sectionId)
      .eq("item_type", data.itemType)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastItemError) {
      throw new Error(lastItemError.message);
    }

    sortOrder = (lastItem?.sort_order ?? 0) + 1;
  }

  const { data: item, error } = await supabase
    .from("homepage_partner_client_items")
    .insert({
      section_id: data.sectionId,
      item_type: data.itemType,
      name: data.name.trim(),
      logo_url: data.logoUrl.trim(),
      website_url: data.websiteUrl.trim() || null,
      sort_order: sortOrder,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePartnersClients();

  return { item };
}

export async function updatePartnerClientItem(
  id: string,
  data: PartnerClientItemData
) {
  const supabase = await getAuthenticatedClient();

  if (!data.name.trim()) {
    throw new Error("Name is required.");
  }

  if (!data.logoUrl.trim()) {
    throw new Error("Logo is required.");
  }

  const { error } = await supabase
    .from("homepage_partner_client_items")
    .update({
      section_id: data.sectionId,
      item_type: data.itemType,
      name: data.name.trim(),
      logo_url: data.logoUrl.trim(),
      website_url: data.websiteUrl.trim() || null,
      sort_order: data.sortOrder,
      is_active: data.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePartnersClients();
}

export async function togglePartnerClientItem(
  id: string,
  isActive: boolean
) {
  const supabase = await getAuthenticatedClient();

  const { error } = await supabase
    .from("homepage_partner_client_items")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePartnersClients();
}

export async function deletePartnerClientItem(id: string) {
  const supabase = await getAuthenticatedClient();

  const { error } = await supabase
    .from("homepage_partner_client_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePartnersClients();
}

export async function reorderPartnerClientItems(
  itemIds: string[]
) {
  const supabase = await getAuthenticatedClient();

  const results = await Promise.all(
    itemIds.map((id, index) =>
      supabase
        .from("homepage_partner_client_items")
        .update({
          sort_order: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
    )
  );

  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new Error(failed.error.message);
  }

  revalidatePartnersClients();
}