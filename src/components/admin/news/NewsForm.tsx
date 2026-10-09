"use client";

import {
  ChangeEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createNewsArticle,
  type NewsActionState,
} from "@/app/admin/(dashboard)/news/action";

import RichTextEditor from "./RichTextEditor";

const categories = [
  "Technology",
  "Construction",
  "Business",
  "Real Estate",
  "Hospitality",
  "Fitness & Wellness",
  "Media & Entertainment",
  "Group News",
];

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewsForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [category, setCategory] =
    useState("Group News");

  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [author, setAuthor] =
    useState("GreenLunar Group");

  const [readTime, setReadTime] = useState(3);

  const [featured, setFeatured] = useState(false);

  const [image, setImage] = useState<File | null>(
    null
  );

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [slugEdited, setSlugEdited] =
    useState(false);

  /* =========================================================
     TITLE
  ========================================================= */

  function handleTitleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    setTitle(value);

    if (!slugEdited) {
      setSlug(generateSlug(value));
    }
  }

  /* =========================================================
     SLUG
  ========================================================= */

  function handleSlugChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setSlugEdited(true);

    setSlug(generateSlug(event.target.value));
  }

  /* =========================================================
     IMAGE
  ========================================================= */

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Featured image must not exceed 5 MB."
      );
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG or WebP image."
      );
      return;
    }

    setError(null);
    setImage(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

 async function submitArticle(
  status: "draft" | "published"
) {

    if (!title.trim()) {
      setError("Please enter an article title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter the article content.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("category", category);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("author", author);

      formData.append(
        "read_time",
        String(readTime)
      );

      formData.append(
        "featured",
        String(featured)
      );

      formData.append("status", status);

      if (image) {
        formData.append("featured_image", image);
      }

      const result: NewsActionState =
        await createNewsArticle(formData);

      if (result && !result.success) {
        setError(result.message);
        setIsSubmitting(false);
        return;
      }

      router.refresh();
    } catch (submissionError) {
      console.error(submissionError);

      setError(
        "Something went wrong while saving the article."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-8">

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div
          className="
            rounded-lg
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-8
          xl:grid-cols-[minmax(0,1fr)_340px]
        "
      >

        {/* ===================================================
            LEFT
        ==================================================== */}

        <div className="space-y-6">

          {/* ARTICLE DETAILS */}
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Article Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the basic information for this
                news article.
              </p>
            </div>


            {/* TITLE */}
            <div className="mt-6">

              <label
                htmlFor="title"
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Article Title
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter article title"
                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-green-600
                  focus:ring-2
                  focus:ring-green-600/10
                "
              />

            </div>


            {/* SLUG */}
            <div className="mt-5">

              <label
                htmlFor="slug"
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                URL Slug
              </label>

              <div
                className="
                  mt-2
                  flex
                  overflow-hidden
                  rounded-lg
                  border
                  border-gray-200
                  focus-within:border-green-600
                  focus-within:ring-2
                  focus-within:ring-green-600/10
                "
              >

                <span
                  className="
                    flex
                    items-center
                    border-r
                    border-gray-200
                    bg-gray-50
                    px-3
                    text-sm
                    text-gray-400
                  "
                >
                  /news/
                </span>

                <input
                  id="slug"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="article-slug"
                  className="
                    min-w-0
                    flex-1
                    px-4
                    py-3
                    text-sm
                    text-gray-700
                    outline-none
                  "
                />

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Generated automatically from the title.
                You can edit it before publishing.
              </p>

            </div>


            {/* CATEGORY */}
            <div className="mt-5">

              <label
                htmlFor="category"
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-green-600
                  focus:ring-2
                  focus:ring-green-600/10
                "
              >

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>


            {/* EXCERPT */}
            <div className="mt-5">

              <div className="flex items-center justify-between">

                <label
                  htmlFor="excerpt"
                  className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                >
                  Short Description
                </label>

                <span className="text-xs text-gray-400">
                  {excerpt.length}/300
                </span>

              </div>

              <textarea
                id="excerpt"
                value={excerpt}
                maxLength={300}
                onChange={(event) =>
                  setExcerpt(event.target.value)
                }
                rows={4}
                placeholder="Write a short summary of the article..."
                className="
                  mt-2
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-gray-700
                  outline-none
                  placeholder:text-gray-400
                  focus:border-green-600
                  focus:ring-2
                  focus:ring-green-600/10
                "
              />

            </div>

          </div>


          {/* =================================================
              ARTICLE CONTENT
          ================================================== */}

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
            "
          >

          <div className="space-y-3">
            <h2 className="block text-lg font-semibold text-gray-900">
              Article Content
            </h2>
              <p className="mt-1 text-sm text-gray-500">
                Write the full content of the news
                article.
              </p>

            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </div>

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                text-xs
                text-gray-400
              "
            >

              <span>
                Separate paragraphs with a blank line.
              </span>

              <span>
                {content
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length}{" "}
                words
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT SIDEBAR
        ==================================================== */}

        <div className="space-y-6">


          {/* FEATURED IMAGE */}
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <h3 className="text-base font-semibold text-gray-900">
              Featured Image
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Recommended landscape image. JPG, PNG
              or WebP, maximum 5 MB.
            </p>


            <label
              className="
                group
                relative
                mt-5
                flex
                min-h-[210px]
                cursor-pointer
                items-center
                justify-center
                overflow-hidden
                rounded-lg
                border
                border-dashed
                border-gray-300
                bg-gray-50
                transition
                hover:border-green-600
                hover:bg-green-50/30
              "
            >

              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Featured image preview"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-black/40
                      opacity-0
                      transition
                      group-hover:opacity-100
                    "
                  >

                    <span
                      className="
                        rounded-md
                        bg-white
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        text-gray-800
                      "
                    >
                      Change Image
                    </span>

                  </div>
                </>
              ) : (
                <div className="px-5 text-center">

                  <div
                    className="
                      mx-auto
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#ecfdf5]
                      text-green-700
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                  </div>

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Upload featured image
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Click to select an image
                  </p>

                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="sr-only"
              />

            </label>

          </div>


          {/* PUBLISH SETTINGS */}
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <h3 className="text-base font-semibold text-gray-900">
              Publishing
            </h3>


            {/* AUTHOR */}
            <div className="mt-5">

              <label
                htmlFor="author"
                className="
                  block
                  text-xs
                  font-medium
                  text-gray-600
                "
              >
                Author
              </label>

              <input
                id="author"
                value={author}
                onChange={(event) =>
                  setAuthor(event.target.value)
                }
                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  px-3
                  py-2.5
                  text-sm
                  text-gray-700
                  outline-none
                  focus:border-green-600
                "
              />

            </div>


            {/* READ TIME */}
            <div className="mt-5">

              <label
                htmlFor="read-time"
                className="
                  block
                  text-xs
                  font-medium
                  text-gray-600
                "
              >
                Reading Time
              </label>

              <div className="relative mt-2">

                <input
                  id="read-time"
                  type="number"
                  min={1}
                  max={60}
                  value={readTime}
                  onChange={(event) =>
                    setReadTime(
                      Number(event.target.value)
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    px-3
                    py-2.5
                    pr-14
                    text-sm
                    text-gray-700
                    outline-none
                    focus:border-green-600
                  "
                />

                <span
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-xs
                    text-gray-400
                  "
                >
                  min
                </span>

              </div>

            </div>


            {/* FEATURED */}
            <div
              className="
                mt-5
                border-t
                border-gray-100
                pt-5
              "
            >

              <label
                className="
                  flex
                  cursor-pointer
                  items-start
                  justify-between
                  gap-4
                "
              >

                <div>
                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >
                    Featured Article
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-gray-400
                    "
                  >
                    Display this story prominently on
                    the News page.
                  </p>
                </div>


                <button
                  type="button"
                  onClick={() =>
                    setFeatured(!featured)
                  }
                  className={`
                    relative
                    mt-0.5
                    h-6
                    w-11
                    shrink-0
                    rounded-full
                    transition-colors
                    duration-300

                    ${
                      featured
                        ? "bg-[#063d2b]"
                        : "bg-gray-200"
                    }
                  `}
                  aria-pressed={featured}
                >

                  <span
                    className={`
                      absolute
                      top-1
                      h-4
                      w-4
                      rounded-full
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300

                      ${
                        featured
                          ? "left-6"
                          : "left-1"
                      }
                    `}
                  />

                </button>

              </label>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ACTION BAR
      ====================================================== */}

      <div
        className="
          sticky
          bottom-4
          z-20
          flex
          flex-col
          gap-3
          rounded-xl
          border
          border-gray-200
          bg-white/95
          px-5
          py-4
          shadow-[0_15px_45px_rgba(0,0,0,0.10)]
          backdrop-blur
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <Link
          href="/admin/news"
          className="
            text-center
            text-sm
            font-medium
            text-gray-500
            transition
            hover:text-gray-900
          "
        >
          Cancel
        </Link>


        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >

          {/* SAVE DRAFT */}

            <button
            type="button"
            disabled={isSubmitting}
            onClick={() => submitArticle("draft")}
            className="
                rounded-lg
                border
                border-gray-200
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
            >
            {isSubmitting ? "Saving..." : "Save Draft"}
            </button>


          {/* PUBLISH */}
            <button
            type="button"
            disabled={isSubmitting}
            onClick={() => submitArticle("published")}
            className="
                inline-flex
                items-center
                justify-center
                rounded-lg
                bg-[#063d2b]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0a5039]
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
            >
            {isSubmitting ? "Publishing..." : "Publish Article"}
            </button>

        </div>

      </div>

    </form>
  );
}