"use client";

import {
  FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  Check,
  ChevronDown,
  Loader2,
  Save,
} from "lucide-react";

import ProductImageUpload from "./ProductImageUpload";
import ProductGalleryUpload from "./ProductGalleryUpload";
import ProductContentList from "./ProductContentList";

import {
  createProduct,
  updateProduct,
} from "@/app/admin/(dashboard)/products/actions";

import type {
  ProductFormData,
  ProductStatus,
} from "@/types/product";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ProductFormProps = {
  mode?: "create" | "edit";
  productId?: string;
  initialData?: ProductFormData;
};

/* ==========================================================================
   OPTIONS
   ========================================================================== */

const categoryOptions = [
  "Software",
  "Hardware",
  "Platform",
  "Service",
  "Other",
];

const statusOptions: {
  value: ProductStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "draft",
    label: "Draft",
    description:
      "Only visible inside the admin dashboard.",
  },
  {
    value: "published",
    label: "Published",
    description:
      "Visible publicly on the website.",
  },
  {
    value: "archived",
    label: "Archived",
    description:
      "Hidden from the public website.",
  },
];

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

function createEmptyForm(): ProductFormData {
  return {
    name: "",
    slug: "",
    category: "Software",

    shortDescription: "",
    description: "",

    imageUrl: "",

    features: [],
    benefits: [],
    gallery: [],

    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoImageUrl: "",

    primaryButtonText: "Request a Demo",
    primaryButtonUrl: "/contact",

    secondaryButtonText: "Learn More",
    secondaryButtonUrl: "#overview",

    status: "draft",
    featured: false,
    sortOrder: 0,
  };
}

/* ==========================================================================
   PRODUCT FORM
   ========================================================================== */

export default function ProductForm({
  mode = "create",
  productId,
  initialData,
}: ProductFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [formData, setFormData] =
    useState<ProductFormData>(
      () => initialData ?? createEmptyForm()
    );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [
    slugManuallyEdited,
    setSlugManuallyEdited,
  ] = useState(mode === "edit");

  const [categoryOpen, setCategoryOpen] =
    useState(false);

  const [statusOpen, setStatusOpen] =
    useState(false);

  /* ========================================================================
     SYNC INITIAL DATA
     ======================================================================== */

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  /* ========================================================================
     GENERIC FIELD UPDATE
     ======================================================================== */

  function updateField<
    K extends keyof ProductFormData,
  >(
    field: K,
    value: ProductFormData[K]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* ========================================================================
     PRODUCT NAME
     ======================================================================== */

  function handleNameChange(value: string) {
    setFormData((current) => ({
      ...current,

      name: value,

      slug: slugManuallyEdited
        ? current.slug
        : generateSlug(value),
    }));
  }

  /* ========================================================================
     SLUG
     ======================================================================== */

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);

    updateField(
      "slug",
      generateSlug(value)
    );
  }

  /* ========================================================================
     SUBMIT
     ======================================================================== */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError(
        "Please enter a product name."
      );

      return;
    }

    if (!formData.slug.trim()) {
      setError(
        "Please enter a valid product slug."
      );

      return;
    }

    if (
      mode === "edit" &&
      !productId
    ) {
      setError(
        "Product ID is missing."
      );

      return;
    }

    startTransition(async () => {
      try {
        /* --------------------------------------------------------------
           UPDATE PRODUCT
           -------------------------------------------------------------- */

        if (mode === "edit") {
          await updateProduct(
            productId!,
            formData
          );

          setSuccess(
            "Product updated successfully."
          );

          router.refresh();

          return;
        }

        /* --------------------------------------------------------------
           CREATE PRODUCT
           -------------------------------------------------------------- */

        const result =
          await createProduct(formData);

        if (result?.id) {
          router.push(
            `/admin/products/${result.id}`
          );

          router.refresh();

          return;
        }

        setSuccess(
          "Product created successfully."
        );

        router.push(
          "/admin/products"
        );

        router.refresh();
      } catch (submitError) {
        console.error(
          "Product form error:",
          submitError
        );

        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to save product."
        );
      }
    });
  }

  /* ========================================================================
     SELECTED STATUS
     ======================================================================== */

  const selectedStatus =
    statusOptions.find(
      (status) =>
        status.value ===
        formData.status
    ) ?? statusOptions[0];

  /* ========================================================================
     RENDER
     ======================================================================== */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ================================================================== */}
      {/* FORM MESSAGES                                                      */}
      {/* ================================================================== */}

      {error && (
        <div
          className="
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border border-green-200
            bg-green-50
            px-4 py-3
            text-sm
            text-green-700
          "
        >
          <Check size={17} />

          {success}
        </div>
      )}

      {/* ================================================================== */}
      {/* BASIC INFORMATION                                                  */}
      {/* ================================================================== */}

      <section
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6">
          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Basic Information
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Enter the main information displayed
            for this product.
          </p>
        </div>

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
          "
        >
          {/* PRODUCT NAME */}

          <div>
            <label
              htmlFor="product-name"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Product Name

              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              id="product-name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                handleNameChange(
                  event.target.value
                )
              }
              placeholder="e.g. Lunar VMS"
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          {/* SLUG */}

          <div>
            <label
              htmlFor="product-slug"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              URL Slug

              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              id="product-slug"
              type="text"
              value={formData.slug}
              onChange={(event) =>
                handleSlugChange(
                  event.target.value
                )
              }
              placeholder="lunar-vms"
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              Public URL: /products/
              {formData.slug ||
                "product-slug"}
            </p>
          </div>

          {/* CATEGORY */}

          <div className="relative">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Category
            </label>

            <button
              type="button"
              onClick={() => {
                setCategoryOpen(
                  (current) => !current
                );

                setStatusOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-left
                text-sm
                text-gray-900
                transition
                hover:border-gray-300
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            >
              <span>
                {formData.category}
              </span>

              <ChevronDown
                size={17}
                className={`
                  text-gray-400
                  transition-transform
                  ${
                    categoryOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {categoryOpen && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  z-30
                  mt-2
                  overflow-hidden
                  rounded-xl
                  border border-gray-200
                  bg-white
                  shadow-lg
                "
              >
                {categoryOptions.map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        updateField(
                          "category",
                          category
                        );

                        setCategoryOpen(
                          false
                        );
                      }}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4 py-3
                        text-left
                        text-sm
                        transition
                        hover:bg-gray-50
                        ${
                          formData.category ===
                          category
                            ? "bg-green-50 font-semibold text-[#073f30]"
                            : "text-gray-700"
                        }
                      `}
                    >
                      {category}

                      {formData.category ===
                        category && (
                        <Check
                          size={16}
                        />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* SORT ORDER */}

          <div>
            <label
              htmlFor="sort-order"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Sort Order
            </label>

            <input
              id="sort-order"
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(event) =>
                updateField(
                  "sortOrder",
                  Number(
                    event.target.value
                  )
                )
              }
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              Lower numbers appear first.
            </p>
          </div>
        </div>

        {/* SHORT DESCRIPTION */}

        <div className="mt-6">
          <label
            htmlFor="short-description"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-gray-700
            "
          >
            Short Description
          </label>

          <textarea
            id="short-description"
            rows={3}
            value={
              formData.shortDescription
            }
            onChange={(event) =>
              updateField(
                "shortDescription",
                event.target.value
              )
            }
            placeholder="A short summary of the product..."
            className="
              w-full
              resize-none
              rounded-xl
              border border-gray-200
              px-4 py-3
              text-sm
              text-gray-900
              outline-none
              transition
              focus:border-[#073f30]
              focus:ring-2
              focus:ring-green-100
            "
          />
        </div>

        {/* FULL DESCRIPTION */}

        <div className="mt-6">
          <label
            htmlFor="description"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-gray-700
            "
          >
            Full Description
          </label>

          <textarea
            id="description"
            rows={8}
            value={formData.description}
            onChange={(event) =>
              updateField(
                "description",
                event.target.value
              )
            }
            placeholder="Describe the product, its purpose and how it works..."
            className="
              w-full
              resize-y
              rounded-xl
              border border-gray-200
              px-4 py-3
              text-sm
              leading-7
              text-gray-900
              outline-none
              transition
              focus:border-[#073f30]
              focus:ring-2
              focus:ring-green-100
            "
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* MAIN PRODUCT IMAGE                                                 */}
      {/* ================================================================== */}

      <ProductImageUpload
        value={formData.imageUrl}
        slug={formData.slug}
        onChange={(imageUrl) =>
          updateField(
            "imageUrl",
            imageUrl
          )
        }
      />

      {/* ================================================================== */}
      {/* PRODUCT GALLERY                                                    */}
      {/* ================================================================== */}

      <ProductGalleryUpload
        slug={formData.slug}
        items={formData.gallery}
        onChange={(gallery) =>
          updateField(
            "gallery",
            gallery
          )
        }
      />

      {/* ================================================================== */}
      {/* FEATURES                                                           */}
      {/* ================================================================== */}

      <ProductContentList
        title="Product Features"
        description="Add the main capabilities and functions of this product."
        items={formData.features}
        onChange={(features) =>
          updateField(
            "features",
            features
          )
        }
      />

      {/* ================================================================== */}
      {/* BENEFITS                                                           */}
      {/* ================================================================== */}

      <ProductContentList
        title="Product Benefits"
        description="Explain the key benefits customers receive from using this product."
        items={formData.benefits}
        onChange={(benefits) =>
          updateField(
            "benefits",
            benefits
          )
        }
      />

      {/* ================================================================== */}
      {/* SEO                                                                */}
      {/* ================================================================== */}

      <section
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6">
          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Search Engine Optimisation
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Control how this product appears in
            search engines and when shared online.
          </p>
        </div>

        <div className="space-y-6">
          {/* SEO TITLE */}

          <div>
            <div
              className="
                mb-2
                flex
                items-center
                justify-between
              "
            >
              <label
                htmlFor="seo-title"
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                SEO Title
              </label>

              <span
                className={`
                  text-xs
                  ${
                    formData.seoTitle.length >
                    60
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                `}
              >
                {formData.seoTitle.length}
                /60
              </span>
            </div>

            <input
              id="seo-title"
              type="text"
              maxLength={60}
              value={formData.seoTitle}
              onChange={(event) =>
                updateField(
                  "seoTitle",
                  event.target.value
                )
              }
              placeholder={
                formData.name
                  ? `${formData.name} | Green Lunar`
                  : "Product SEO title"
              }
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              Leave empty to use the product
              name automatically.
            </p>
          </div>

          {/* SEO DESCRIPTION */}

          <div>
            <div
              className="
                mb-2
                flex
                items-center
                justify-between
              "
            >
              <label
                htmlFor="seo-description"
                className="
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Meta Description
              </label>

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                {
                  formData
                    .seoDescription
                    .length
                }
                /160
              </span>
            </div>

            <textarea
              id="seo-description"
              rows={4}
              maxLength={160}
              value={
                formData.seoDescription
              }
              onChange={(event) =>
                updateField(
                  "seoDescription",
                  event.target.value
                )
              }
              placeholder="Describe this product for search engines..."
              className="
                w-full
                resize-none
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                leading-6
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              Leave empty to use the short
              product description.
            </p>
          </div>

          {/* KEYWORDS */}

          <div>
            <label
              htmlFor="seo-keywords"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Keywords
            </label>

            <input
              id="seo-keywords"
              type="text"
              value={formData.seoKeywords}
              onChange={(event) =>
                updateField(
                  "seoKeywords",
                  event.target.value
                )
              }
              placeholder="visitor management, access control, security"
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              Separate keywords with commas.
            </p>
          </div>

          {/* SOCIAL IMAGE */}

          <div>
            <label
              htmlFor="seo-image"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Social Sharing Image URL
            </label>

            <input
              id="seo-image"
              type="url"
              value={formData.seoImageUrl}
              onChange={(event) =>
                updateField(
                  "seoImageUrl",
                  event.target.value
                )
              }
              placeholder="Leave empty to use the main product image"
              className="
                w-full
                rounded-xl
                border border-gray-200
                px-4 py-3
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />

            <p
              className="
                mt-2
                text-xs
                text-gray-400
              "
            >
              If empty, the main product image
              will be used when the page is
              shared.
            </p>

            {(formData.seoImageUrl ||
              formData.imageUrl) && (
              <div
                className="
                  mt-4
                  max-w-md
                  overflow-hidden
                  rounded-xl
                  border border-gray-200
                  bg-gray-50
                "
              >
                <img
                  src={
                    formData.seoImageUrl ||
                    formData.imageUrl
                  }
                  alt="Social sharing preview"
                  className="
                    aspect-[1.91/1]
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    border-t
                    border-gray-200
                    p-3
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-gray-500
                    "
                  >
                    Social sharing preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PRODUCT BUTTONS                                                    */}
      {/* ================================================================== */}

        <section
        className="
            rounded-2xl
            border border-gray-200
            bg-white
            p-6
            shadow-sm
        "
        >
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
            Product Buttons
            </h2>

            <p className="mt-1 text-sm text-gray-500">
            Configure the call-to-action buttons displayed on
            the public product page.
            </p>
        </div>

        {/* PRIMARY BUTTON */}

        <div className="mb-8">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Primary Button
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
            <div>
                <label
                htmlFor="primary-button-text"
                className="
                    mb-2 block
                    text-sm
                    font-semibold
                    text-gray-700
                "
                >
                Button Text
                </label>

                <input
                id="primary-button-text"
                type="text"
                value={formData.primaryButtonText}
                onChange={(event) =>
                    updateField(
                    "primaryButtonText",
                    event.target.value
                    )
                }
                placeholder="Request a Demo"
                className="
                    w-full
                    rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-[#073f30]
                    focus:ring-2
                    focus:ring-green-100
                "
                />
            </div>

            <div>
                <label
                htmlFor="primary-button-url"
                className="
                    mb-2 block
                    text-sm
                    font-semibold
                    text-gray-700
                "
                >
                Button URL
                </label>

                <input
                id="primary-button-url"
                type="text"
                value={formData.primaryButtonUrl}
                onChange={(event) =>
                    updateField(
                    "primaryButtonUrl",
                    event.target.value
                    )
                }
                placeholder="/contact"
                className="
                    w-full
                    rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-[#073f30]
                    focus:ring-2
                    focus:ring-green-100
                "
                />

                <p className="mt-2 text-xs text-gray-400">
                Examples: /contact, /services/technology or
                https://example.com
                </p>
            </div>
            </div>
        </div>

        {/* SECONDARY BUTTON */}

        <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Secondary Button
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
            <div>
                <label
                htmlFor="secondary-button-text"
                className="
                    mb-2 block
                    text-sm
                    font-semibold
                    text-gray-700
                "
                >
                Button Text
                </label>

                <input
                id="secondary-button-text"
                type="text"
                value={formData.secondaryButtonText}
                onChange={(event) =>
                    updateField(
                    "secondaryButtonText",
                    event.target.value
                    )
                }
                placeholder="Learn More"
                className="
                    w-full
                    rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-[#073f30]
                    focus:ring-2
                    focus:ring-green-100
                "
                />
            </div>

            <div>
                <label
                htmlFor="secondary-button-url"
                className="
                    mb-2 block
                    text-sm
                    font-semibold
                    text-gray-700
                "
                >
                Button URL
                </label>

                <input
                id="secondary-button-url"
                type="text"
                value={formData.secondaryButtonUrl}
                onChange={(event) =>
                    updateField(
                    "secondaryButtonUrl",
                    event.target.value
                    )
                }
                placeholder="#overview"
                className="
                    w-full
                    rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-[#073f30]
                    focus:ring-2
                    focus:ring-green-100
                "
                />

                <p className="mt-2 text-xs text-gray-400">
                You can use an internal URL, page section or
                external website.
                </p>
            </div>
            </div>
        </div>
        </section>

      {/* ================================================================== */}
      {/* PUBLISHING                                                         */}
      {/* ================================================================== */}

      <section
        className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6">
          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Publishing
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Control the visibility and placement
            of this product.
          </p>
        </div>

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
          "
        >
          {/* STATUS */}

          <div className="relative">
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Status
            </label>

            <button
              type="button"
              onClick={() => {
                setStatusOpen(
                  (current) => !current
                );

                setCategoryOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-left
                transition
                hover:border-gray-300
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  {selectedStatus.label}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-400
                  "
                >
                  {
                    selectedStatus.description
                  }
                </p>
              </div>

              <ChevronDown
                size={17}
                className={`
                  shrink-0
                  text-gray-400
                  transition-transform
                  ${
                    statusOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {statusOpen && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  z-30
                  mt-2
                  overflow-hidden
                  rounded-xl
                  border border-gray-200
                  bg-white
                  shadow-lg
                "
              >
                {statusOptions.map(
                  (status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => {
                        updateField(
                          "status",
                          status.value
                        );

                        setStatusOpen(
                          false
                        );
                      }}
                      className={`
                        flex
                        w-full
                        items-start
                        justify-between
                        gap-4
                        px-4 py-3
                        text-left
                        transition
                        hover:bg-gray-50
                        ${
                          formData.status ===
                          status.value
                            ? "bg-green-50"
                            : ""
                        }
                      `}
                    >
                      <div>
                        <p
                          className={`
                            text-sm
                            font-semibold
                            ${
                              formData.status ===
                              status.value
                                ? "text-[#073f30]"
                                : "text-gray-800"
                            }
                          `}
                        >
                          {status.label}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-gray-400
                          "
                        >
                          {
                            status.description
                          }
                        </p>
                      </div>

                      {formData.status ===
                        status.value && (
                        <Check
                          size={16}
                          className="
                            mt-1
                            shrink-0
                            text-[#073f30]
                          "
                        />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* FEATURED */}

          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Featured Product
            </label>

            <button
              type="button"
              role="switch"
              aria-checked={
                formData.featured
              }
              onClick={() =>
                updateField(
                  "featured",
                  !formData.featured
                )
              }
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-3
                text-left
                transition
                hover:border-gray-300
              "
            >
              <div className="pr-4">
                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  {formData.featured
                    ? "Featured"
                    : "Not Featured"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-400
                  "
                >
                  Highlight this product in
                  featured product sections.
                </p>
              </div>

              <div
                className={`
                  relative
                  h-6
                  w-11
                  shrink-0
                  rounded-full
                  transition-colors
                  ${
                    formData.featured
                      ? "bg-[#073f30]"
                      : "bg-gray-200"
                  }
                `}
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
                    transition-transform
                    ${
                      formData.featured
                        ? "translate-x-6"
                        : "translate-x-1"
                    }
                  `}
                />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SAVE BAR                                                           */}
      {/* ================================================================== */}

      <div
        className="
          sticky
          bottom-4
          z-20
          flex
          flex-col
          gap-4
          rounded-2xl
          border border-gray-200
          bg-white/95
          p-4
          shadow-xl
          backdrop-blur
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              font-semibold
              text-gray-900
            "
          >
            {mode === "edit"
              ? "Update Product"
              : "Create Product"}
          </p>

          <p
            className="
              mt-0.5
              text-xs
              text-gray-400
            "
          >
            {formData.status ===
            "published"
              ? "This product will be visible on the public website."
              : formData.status ===
                  "archived"
                ? "This product will remain hidden from the public website."
                : "This product will remain a draft until published."}
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              router.push(
                "/admin/products"
              )
            }
            className="
              rounded-xl
              border border-gray-200
              bg-white
              px-5 py-3
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="
              inline-flex
              min-w-[150px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#073f30]
              px-5 py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#09543f]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isPending ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={17} />

                {mode === "edit"
                  ? "Save Changes"
                  : "Create Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}