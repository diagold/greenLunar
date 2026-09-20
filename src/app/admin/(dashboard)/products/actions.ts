"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ProductStatus =
  | "draft"
  | "published"
  | "archived";

export type ProductFormData = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(
  product: ProductFormData
) {
  const supabase = await createClient();

  // Confirm the user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = product.name.trim();

  if (!name) {
    throw new Error("Product name is required.");
  }

  const slug =
    generateSlug(product.slug || product.name);

  if (!slug) {
    throw new Error("A valid product slug is required.");
  }

  // Check for duplicate slug
  const { data: existingProduct } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingProduct) {
    throw new Error(
      "A product with this URL slug already exists."
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      category:
        product.category.trim() || null,

      short_description:
        product.shortDescription.trim() || null,

      description:
        product.description.trim() || null,

      image_url:
        product.imageUrl.trim() || null,

      status: product.status,

      featured: product.featured,

      sort_order:
        Number(product.sortOrder) || 0,

      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Create product error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(
      "Unable to create product."
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");

  redirect(`/admin/products/${data.id}`);
}