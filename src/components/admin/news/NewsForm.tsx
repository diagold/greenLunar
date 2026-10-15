
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  author: string | null;
  featured_image: string | null;
  status: string | null;
  is_featured: boolean | null;
  published_at: string | null;
};

type NewsFormProps = {
  article?: NewsArticle | null;
};

type NewsFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string;
  status: "draft" | "published";
  is_featured: boolean;
};

const categories = [
  "Company News",
  "Technology",
  "Construction",
  "Renewable Energy",
  "Fitness & Wellness",
  "Media & Entertainment",
  "Events",
  "Partnerships",
  "Other",
];

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getInitialData(
  article?: NewsArticle | null
): NewsFormData {
  return {
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    category: article?.category ?? "",
    author: article?.author ?? "",
    featured_image: article?.featured_image ?? "",
    status:
      article?.status === "published"
        ? "published"
        : "draft",
    is_featured: article?.is_featured ?? false,
  };
}

export default function NewsForm({
  article,
}: NewsFormProps) {
  const router = useRouter();

  const isEditing = Boolean(article?.id);

  const [formData, setFormData] =
    useState<NewsFormData>(() => getInitialData(article));

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(Boolean(article?.slug));

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageError, setImageError] = useState(false);

  // Populate fields when editing an existing article.
  useEffect(() => {
    setFormData(getInitialData(article));
    setSlugManuallyEdited(Boolean(article?.slug));
    setImageError(false);
  }, [article]);

  function updateField<K extends keyof NewsFormData>(
    field: K,
    value: NewsFormData[K]
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setFormData((previous) => ({
      ...previous,
      title: value,
      slug: slugManuallyEdited
        ? previous.slug
        : generateSlug(value),
    }));
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    updateField("slug", generateSlug(value));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setErrorMessage("");
    setSuccessMessage("");

    const title = formData.title.trim();
    const slug = generateSlug(formData.slug || title);
    const content = formData.content.trim();

    if (!title) {
      setErrorMessage("Article title is required.");
      return;
    }

    if (!slug) {
      setErrorMessage("A valid article slug is required.");
      return;
    }

    if (!content) {
      setErrorMessage("Article content is required.");
      return;
    }

    setLoading(true);

    try {
      // Important:
      // Initialize the Supabase client INSIDE this
      // async function to resolve its Promise.
      const supabase = await createClient();

      // Check whether another article uses this slug.
      let duplicateQuery = supabase
        .from("news")
        .select("id")
        .eq("slug", slug);

      if (article?.id) {
        duplicateQuery = duplicateQuery.neq(
          "id",
          article.id
        );
      }

      const {
        data: duplicates,
        error: duplicateError,
      } = await duplicateQuery.limit(1);

      if (duplicateError) {
        throw duplicateError;
      }

      if (duplicates && duplicates.length > 0) {
        throw new Error(
          "Another news article already uses this slug. Please choose a different slug."
        );
      }

      // Prepare the article payload.
      const payload = {
        title,
        slug,
        excerpt: formData.excerpt.trim() || null,
        content,
        category: formData.category || null,
        author: formData.author.trim() || null,
        featured_image:
          formData.featured_image.trim() || null,
        status: formData.status,
        is_featured: formData.is_featured,
        published_at:
          formData.status === "published"
            ? article?.published_at ??
              new Date().toISOString()
            : null,
      };

      if (isEditing && article) {
        // Update the existing article.
        const { data: updatedArticle, error } =
          await supabase
            .from("news")
            .update(payload)
            .eq("id", article.id)
            .select("id")
            .single();

        if (error) throw error;

        if (!updatedArticle) {
          throw new Error(
            "The article could not be updated."
          );
        }

        setSuccessMessage(
          "News article updated successfully."
        );
      } else {
        // Create a new article.
        const { data: createdArticle, error } =
          await supabase
            .from("news")
            .insert(payload)
            .select("id")
            .single();

        if (error) throw error;

        if (!createdArticle) {
          throw new Error(
            "The article could not be created."
          );
        }

        setSuccessMessage(
          "News article created successfully."
        );
      }

      router.push("/admin/news");
      router.refresh();
    } catch (error: unknown) {
  console.error("News save error:", error);

  if (error && typeof error === "object") {
    console.error(
      "Detailed Supabase error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
  }

  const details =
    error && typeof error === "object"
      ? (error as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
        })
      : null;

  setErrorMessage(
    [
      details?.message || "Failed to save news article.",
      details?.code ? `Code: ${details.code}` : "",
      details?.details || "",
      details?.hint || "",
    ]
      .filter(Boolean)
      .join(" | ")
  );
} finally {
  setLoading(false);
}
    
   
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/10";

  const labelClass =
    "block text-sm font-medium text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Feedback messages */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </div>
      )}

      {/* Article Information */}
      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Article Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? "Update the existing news article."
              : "Create a new article for the Green Lunar website."}
          </p>
        </div>

        <div>
          <label
            htmlFor="news-title"
            className={labelClass}
          >
            Article Title *
          </label>
          <input
            id="news-title"
            type="text"
            required
            value={formData.title}
            onChange={(event) =>
              handleTitleChange(event.target.value)
            }
            placeholder="Enter news article title"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="news-slug"
            className={labelClass}
          >
            Article Slug *
          </label>
          <input
            id="news-slug"
            type="text"
            required
            value={formData.slug}
            onChange={(event) =>
              handleSlugChange(event.target.value)
            }
            placeholder="article-url-slug"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-gray-500">
            The slug determines the article URL.
            Changing it may affect previously shared links.
          </p>
        </div>

        <div>
          <label
            htmlFor="news-excerpt"
            className={labelClass}
          >
            Article Summary
          </label>
          <textarea
            id="news-excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(event) =>
              updateField("excerpt", event.target.value)
            }
            placeholder="Write a short article summary"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="news-content"
            className={labelClass}
          >
            Article Content *
          </label>
          <textarea
            id="news-content"
            rows={12}
            required
            value={formData.content}
            onChange={(event) =>
              updateField("content", event.target.value)
            }
            placeholder="Write the full news article here..."
            className={inputClass}
          />
        </div>
      </section>

      {/* Classification and Author */}
      <section className="space-y-5 border-t border-gray-100 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Classification & Author
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="news-category"
              className={labelClass}
            >
              Category
            </label>
            <select
              id="news-category"
              value={formData.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="">Select category</option>

              {formData.category &&
                !categories.includes(formData.category) && (
                  <option value={formData.category}>
                    {formData.category}
                  </option>
                )}

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="news-author"
              className={labelClass}
            >
              Author
            </label>
            <input
              id="news-author"
              type="text"
              value={formData.author}
              onChange={(event) =>
                updateField(
                  "author",
                  event.target.value
                )
              }
              placeholder="Author or organization"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="space-y-5 border-t border-gray-100 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Featured Image
        </h2>

        <div>
          <label
            htmlFor="news-image"
            className={labelClass}
          >
            Image URL
          </label>
          <input
            id="news-image"
            type="text"
            value={formData.featured_image}
            onChange={(event) => {
              updateField(
                "featured_image",
                event.target.value
              );
              setImageError(false);
            }}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
        </div>

        {formData.featured_image && !imageError && (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-3">
            <img
              key={formData.featured_image}
              src={formData.featured_image}
              alt="News article preview"
              className="h-64 w-full rounded-lg object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {imageError && (
          <p className="text-sm text-red-600">
            Unable to preview this image. Please check the URL.
          </p>
        )}
      </section>

      {/* Publication Settings */}
      <section className="space-y-5 border-t border-gray-100 pt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Publication Settings
        </h2>

        <div>
          <label
            htmlFor="news-status"
            className={labelClass}
          >
            Publication Status
          </label>
          <select
            id="news-status"
            value={formData.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as NewsFormData["status"]
              )
            }
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-[#f7faf8] p-4">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(event) =>
              updateField(
                "is_featured",
                event.target.checked
              )
            }
            className="h-4 w-4 accent-green-600"
          />

          <span>
            <span className="block text-sm font-medium text-gray-900">
              Featured Article
            </span>
            <span className="mt-1 block text-xs text-gray-500">
              Highlight this article in the featured news section.
            </span>
          </span>
        </label>
      </section>

      {/* Form Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-6">
        <Link
          href="/admin/news"
          className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#063d2b] px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Article"
              : "Save Article"}
        </button>
      </div>
    </form>
  );
}
