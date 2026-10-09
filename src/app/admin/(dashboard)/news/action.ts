"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type NewsActionState = {
  success: boolean;
  message: string;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createNewsArticle(
  formData: FormData
): Promise<NewsActionState> {
  const supabase = await createClient();

  const title = String(formData.get("title") || "").trim();
  const suppliedSlug = String(formData.get("slug") || "").trim();

  const slug = createSlug(suppliedSlug || title);

  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(
    formData.get("category") || "Group News"
  ).trim();

  const author = String(
    formData.get("author") || "GreenLunar Group"
  ).trim();

  const status =
    formData.get("status") === "published"
      ? "published"
      : "draft";

  const featured = formData.get("featured") === "true";

  const readTimeValue = Number(formData.get("read_time"));

  const readTime =
    Number.isFinite(readTimeValue) && readTimeValue > 0
      ? Math.round(readTimeValue)
      : 3;

  /* =========================================================
     VALIDATION
  ========================================================= */

  if (!title) {
    return {
      success: false,
      message: "Article title is required.",
    };
  }

  if (!slug) {
    return {
      success: false,
      message: "Article slug is required.",
    };
  }

  if (!content) {
    return {
      success: false,
      message: "Article content is required.",
    };
  }

  /* =========================================================
     CHECK DUPLICATE SLUG
  ========================================================= */

  const { data: existingArticle } = await supabase
    .from("news")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingArticle) {
    return {
      success: false,
      message:
        "An article already uses this slug. Please change the slug.",
    };
  }

  /* =========================================================
     IMAGE UPLOAD
  ========================================================= */

  let featuredImageUrl: string | null = null;

  const image = formData.get("featured_image");

  if (image instanceof File && image.size > 0) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(image.type)) {
      return {
        success: false,
        message:
          "Featured image must be JPG, PNG or WebP.",
      };
    }

    // 5 MB maximum
    if (image.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message:
          "Featured image must not exceed 5 MB.",
      };
    }

    const extension =
      image.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${slug}-${Date.now()}.${extension}`;

    const filePath = `articles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: false,
        contentType: image.type,
      });

    if (uploadError) {
      console.error(
        "News image upload error:",
        uploadError
      );

      return {
        success: false,
        message: `Image upload failed: ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("news-images")
      .getPublicUrl(filePath);

    featuredImageUrl = publicUrlData.publicUrl;
  }

  /* =========================================================
     IF THIS IS THE FEATURED PUBLISHED ARTICLE,
     REMOVE FEATURED FROM THE CURRENT ARTICLE
  ========================================================= */

  if (featured && status === "published") {
    const { error: featuredError } = await supabase
      .from("news")
      .update({
        featured: false,
      })
      .eq("featured", true)
      .eq("status", "published");

    if (featuredError) {
      console.error(
        "Unable to reset featured article:",
        featuredError
      );

      return {
        success: false,
        message:
          "The existing featured article could not be updated.",
      };
    }
  }

  /* =========================================================
     CREATE ARTICLE
  ========================================================= */

  const { error } = await supabase.from("news").insert({
    title,
    slug,
    excerpt: excerpt || null,
    content,
    category,
    author,
    featured_image: featuredImageUrl,
    status,
    featured,
    read_time: readTime,

    published_at:
      status === "published"
        ? new Date().toISOString()
        : null,
  });

  if (error) {
    console.error("Create news error:", error);

    return {
      success: false,
      message: `Unable to create article: ${error.message}`,
    };
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");

  redirect("/admin/news");
}