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

  features: ProductContentItem[];
  benefits: ProductContentItem[];

  gallery: ProductGalleryItem[];

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoImageUrl: string;

  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
};

export type ProductGalleryItem = {
  url: string;
  alt: string;
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ProductContentItem = {
  title: string;
  description: string;
};

export async function createProduct(
  product: ProductFormData
) {
  const supabase = await createClient();

  /* ----------------------------------------------------------------------
     Authentication
     ---------------------------------------------------------------------- */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }


  /* ----------------------------------------------------------------------
     Validate product name
     ---------------------------------------------------------------------- */

  const name = product.name.trim();

  if (!name) {
    throw new Error(
      "Product name is required."
    );
  }


  /* ----------------------------------------------------------------------
     Generate and validate slug
     ---------------------------------------------------------------------- */

  const slug = generateSlug(
    product.slug || product.name
  );

  if (!slug) {
    throw new Error(
      "A valid product slug is required."
    );
  }


  /* ----------------------------------------------------------------------
     Check duplicate slug
     ---------------------------------------------------------------------- */

  const {
    data: existingProduct,
    error: slugCheckError,
  } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugCheckError) {
    console.error(
      "Product slug check error:",
      {
        message:
          slugCheckError.message,

        details:
          slugCheckError.details,

        hint:
          slugCheckError.hint,

        code:
          slugCheckError.code,
      }
    );

    throw new Error(
      "Unable to validate the product URL."
    );
  }

  if (existingProduct) {
    throw new Error(
      "A product with this URL slug already exists."
    );
  }


  /* ----------------------------------------------------------------------
     Clean Features
     ---------------------------------------------------------------------- */

  const features = (
    product.features ?? []
  )
    .map((feature) => ({
      title:
        feature.title?.trim() ?? "",

      description:
        feature.description?.trim() ?? "",
    }))
    .filter(
      (feature) =>
        feature.title ||
        feature.description
    );


  /* ----------------------------------------------------------------------
     Clean Benefits
     ---------------------------------------------------------------------- */

  const benefits = (
    product.benefits ?? []
  )
    .map((benefit) => ({
      title:
        benefit.title?.trim() ?? "",

      description:
        benefit.description?.trim() ?? "",
    }))
    .filter(
      (benefit) =>
        benefit.title ||
        benefit.description
    );


  /* ----------------------------------------------------------------------
     Clean Gallery
     ---------------------------------------------------------------------- */

  const gallery = (
    product.gallery ?? []
  )
    .map((image) => ({
      url:
        image.url?.trim() ?? "",

      alt:
        image.alt?.trim() ?? "",
    }))
    .filter(
      (image) => image.url
    );


  /* ----------------------------------------------------------------------
     Create Product
     ---------------------------------------------------------------------- */

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .insert({
      /* Basic Information */

      name,

      slug,

      category:
        product.category.trim() ||
        null,

      short_description:
        product.shortDescription.trim() ||
        null,

      description:
        product.description.trim() ||
        null,


      /* Media */

      image_url:
        product.imageUrl.trim() ||
        null,

      gallery,


      /* Structured Content */

      features,

      benefits,


      /* SEO */

      seo_title:
        product.seoTitle.trim() ||
        null,

      seo_description:
        product.seoDescription.trim() ||
        null,

      seo_keywords:
        product.seoKeywords.trim() ||
        null,

      seo_image_url:
        product.seoImageUrl.trim() ||
        null,


      /* Publishing */

      status:
        product.status,

      featured:
        product.featured,

      sort_order:
        Number(product.sortOrder) ||
        0,


      /* Timestamp */

      updated_at:
        new Date().toISOString(),
    })
    .select("id")
    .single();


  /* ----------------------------------------------------------------------
     Handle database error
     ---------------------------------------------------------------------- */

  if (error) {
    console.error(
      "Create product error:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      "Unable to create product."
    );
  }


  /* ----------------------------------------------------------------------
     Revalidate Pages
     ---------------------------------------------------------------------- */

  revalidatePath(
    "/admin/products"
  );

  revalidatePath(
    "/products"
  );


  /* ----------------------------------------------------------------------
     Redirect to Edit Page
     ---------------------------------------------------------------------- */

  // redirect(
  //   `/admin/products/${data.id}`
  // );
    return {
    success: true,
    id: data.id,
  };
}


export async function updateProduct(
  id: string,
  product: ProductFormData
) {
  const supabase = await createClient();

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Product Name
  |--------------------------------------------------------------------------
  */

  const name = product.name.trim();

  if (!name) {
    throw new Error(
      "Product name is required."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Generate / Validate Slug
  |--------------------------------------------------------------------------
  */

  const slug = generateSlug(
    product.slug || product.name
  );

  if (!slug) {
    throw new Error(
      "A valid product slug is required."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check Slug Uniqueness
  |--------------------------------------------------------------------------
  |
  | The current product ID is excluded from the check,
  | allowing the product to keep its existing slug.
  |
  */

  const {
    data: existingProduct,
    error: slugCheckError,
  } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (slugCheckError) {
    console.error(
      "Product slug check error:",
      {
        message: slugCheckError.message,
        details: slugCheckError.details,
        hint: slugCheckError.hint,
        code: slugCheckError.code,
      }
    );

    throw new Error(
      "Unable to validate the product URL."
    );
  }

  if (existingProduct) {
    throw new Error(
      "Another product already uses this URL slug."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Clean Features
  |--------------------------------------------------------------------------
  |
  | Prevent completely empty feature records from
  | being stored in Supabase.
  |
  */

  const features = (
    product.features ?? []
  )
    .map((feature) => ({
      title:
        feature.title?.trim() ?? "",

      description:
        feature.description?.trim() ?? "",
    }))
    .filter(
      (feature) =>
        feature.title ||
        feature.description
    );

  /*
  |--------------------------------------------------------------------------
  | Clean Benefits
  |--------------------------------------------------------------------------
  */

  const benefits = (
    product.benefits ?? []
  )
    .map((benefit) => ({
      title:
        benefit.title?.trim() ?? "",

      description:
        benefit.description?.trim() ?? "",
    }))
    .filter(
      (benefit) =>
        benefit.title ||
        benefit.description
    );

  /*
  |--------------------------------------------------------------------------
  | Clean Gallery
  |--------------------------------------------------------------------------
  |
  | Only gallery records containing an image URL
  | will be saved.
  |
  */

  const gallery = (
    product.gallery ?? []
  )
    .map((image) => ({
      url:
        image.url?.trim() ?? "",

      alt:
        image.alt?.trim() ?? "",
    }))
    .filter(
      (image) => image.url
    );

  /*
  |--------------------------------------------------------------------------
  | Update Product
  |--------------------------------------------------------------------------
  */

  const {
    data: updatedProduct,
    error,
  } = await supabase
    .from("products")
    .update({
      /*
      |--------------------------------------------------------------
      | Basic Information
      |--------------------------------------------------------------
      */

      name,

      slug,

      category:
        product.category.trim() ||
        null,

      short_description:
        product.shortDescription.trim() ||
        null,

      description:
        product.description.trim() ||
        null,

      /*
      |--------------------------------------------------------------
      | Media
      |--------------------------------------------------------------
      */

      image_url:
        product.imageUrl.trim() ||
        null,

      gallery,

      /*
      |--------------------------------------------------------------
      | Structured Content
      |--------------------------------------------------------------
      */

      features,

      benefits,

      /*
      |--------------------------------------------------------------
      | SEO
      |--------------------------------------------------------------
      */

      seo_title:
        product.seoTitle.trim() ||
        null,

      seo_description:
        product.seoDescription.trim() ||
        null,

      seo_keywords:
        product.seoKeywords.trim() ||
        null,

      seo_image_url:
        product.seoImageUrl.trim() ||
        null,

      /*
      |--------------------------------------------------------------
      | Publishing
      |--------------------------------------------------------------
      */

      status:
        product.status,

      featured:
        product.featured,

      sort_order:
        Number(product.sortOrder) ||
        0,

      /*
      |--------------------------------------------------------------
      | Timestamp
      |--------------------------------------------------------------
      */

      updated_at:
        new Date().toISOString(),
    })

    .eq("id", id)

    .select("*")

    .single();

  /*
  |--------------------------------------------------------------------------
  | Handle Database Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    console.error(
      "Update product error:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );

    throw new Error(
      "Unable to update product."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Revalidate Admin Pages
  |--------------------------------------------------------------------------
  */

  revalidatePath(
    "/admin/products"
  );

  revalidatePath(
    `/admin/products/${id}`
  );

  /*
  |--------------------------------------------------------------------------
  | Revalidate Public Pages
  |--------------------------------------------------------------------------
  */

  revalidatePath(
    "/products"
  );

  revalidatePath(
    `/products/${slug}`
  );

  /*
  |--------------------------------------------------------------------------
  | Return Updated Product
  |--------------------------------------------------------------------------
  */

  return {
    success: true,
    product: updatedProduct,
  };
}


export async function archiveProduct(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("products")
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Archive product error:", error);
    throw new Error("Unable to archive product.");
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");

  return { success: true };
}

export async function restoreProduct(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Restore to draft instead of immediately publishing
  const { error } = await supabase
    .from("products")
    .update({
      status: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Restore product error:", error);
    throw new Error("Unable to restore product.");
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");

  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get the product before deleting it.
  const { data: product, error: productError } =
    await supabase
      .from("products")
      .select("id, slug, image_url")
      .eq("id", id)
      .single();

  if (productError || !product) {
    throw new Error("Product not found.");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete product error:", error);
    throw new Error("Unable to delete product.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    success: true,
    slug: product.slug,
  };
}