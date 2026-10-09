"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/* =========================================================
   TYPES
========================================================= */

export type MarketReachSettingsData = {
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
  mapImageUrl: string;
  isActive: boolean;
};

export type MarketReachLocationData = {
  sectionId: string;
  name: string;
  address: string;
  linkUrl: string;
  linkLabel: string;
  markerLeft: number;
  markerTop: number;
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
   REVALIDATE
========================================================= */

function revalidateMarketReach() {
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath(
    "/admin/homepage/market-reach"
  );
}

/* =========================================================
   UPDATE SECTION
========================================================= */

export async function updateMarketReachSettings(
  id: string,
  data: MarketReachSettingsData
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from("homepage_market_reach")
    .update({
      eyebrow:
        data.eyebrow.trim() || null,

      heading: data.heading.trim(),

      highlight:
        data.highlight.trim() || null,

      description:
        data.description.trim() || null,

      map_image_url:
        data.mapImageUrl.trim() || null,

      is_active: data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMarketReach();
}

/* =========================================================
   CREATE LOCATION
========================================================= */

export async function createMarketReachLocation(
  data: MarketReachLocationData
) {
  const supabase =
    await getAuthenticatedClient();

  let sortOrder = data.sortOrder;

  if (!sortOrder || sortOrder < 1) {
    const {
      data: lastLocation,
      error: lastLocationError,
    } = await supabase
      .from(
        "homepage_market_reach_locations"
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

    if (lastLocationError) {
      throw new Error(
        lastLocationError.message
      );
    }

    sortOrder =
      (lastLocation?.sort_order ?? 0) +
      1;
  }

  const {
    data: location,
    error,
  } = await supabase
    .from(
      "homepage_market_reach_locations"
    )
    .insert({
      section_id: data.sectionId,

      name: data.name.trim(),

      address:
        data.address.trim() || null,

      link_url:
        data.linkUrl.trim() || null,

      link_label:
        data.linkLabel.trim() ||
        "Learn More",

      marker_left:
        data.markerLeft,

      marker_top:
        data.markerTop,

      sort_order: sortOrder,

      is_active: data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .select(`
      id,
      section_id,
      name,
      address,
      link_url,
      link_label,
      marker_left,
      marker_top,
      sort_order,
      is_active,
      created_at,
      updated_at
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidateMarketReach();

  return { location };
}

/* =========================================================
   UPDATE LOCATION
========================================================= */

export async function updateMarketReachLocation(
  id: string,
  data: MarketReachLocationData
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "homepage_market_reach_locations"
    )
    .update({
      section_id: data.sectionId,

      name: data.name.trim(),

      address:
        data.address.trim() || null,

      link_url:
        data.linkUrl.trim() || null,

      link_label:
        data.linkLabel.trim() ||
        "Learn More",

      marker_left:
        data.markerLeft,

      marker_top:
        data.markerTop,

      sort_order: data.sortOrder,

      is_active: data.isActive,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMarketReach();
}

/* =========================================================
   TOGGLE LOCATION
========================================================= */

export async function toggleMarketReachLocation(
  id: string,
  isActive: boolean
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "homepage_market_reach_locations"
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

  revalidateMarketReach();
}

/* =========================================================
   DELETE LOCATION
========================================================= */

export async function deleteMarketReachLocation(
  id: string
) {
  const supabase =
    await getAuthenticatedClient();

  const { error } = await supabase
    .from(
      "homepage_market_reach_locations"
    )
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateMarketReach();
}

/* =========================================================
   REORDER LOCATIONS
========================================================= */

export async function reorderMarketReachLocations(
  locationIds: string[]
) {
  const supabase =
    await getAuthenticatedClient();

  const updates = locationIds.map(
    (id, index) =>
      supabase
        .from(
          "homepage_market_reach_locations"
        )
        .update({
          sort_order: index + 1,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
  );

  const results =
    await Promise.all(updates);

  const failedResult =
    results.find(
      (result) => result.error
    );

  if (failedResult?.error) {
    throw new Error(
      failedResult.error.message
    );
  }

  revalidateMarketReach();
}