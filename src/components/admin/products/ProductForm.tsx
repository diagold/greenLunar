"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  Check,
  ChevronDown,
  ImageIcon,
  Loader2,
  Save,
  Star,
} from "lucide-react";

import {
  createProduct,
  ProductFormData,
  ProductStatus,
} from "@/app/admin/(dashboard)/products/actions";

type ProductFormProps = {
  mode?: "create" | "edit";
};

const categories = [
  "Software",
  "FinTech",
  "Hardware",
  "Healthcare",
  "Education",
  "Transportation",
  "Other",
];

const statuses: {
  value: ProductStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "draft",
    label: "Draft",
    description: "Only visible in the admin dashboard.",
  },
  {
    value: "published",
    label: "Published",
    description: "Visible on the public website.",
  },
  {
    value: "archived",
    label: "Archived",
    description: "Hidden but retained in the CMS.",
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({
  mode = "create",
}: ProductFormProps) {
  const [isPending, startTransition] =
    useTransition();

  const [error, setError] =
    useState("");

  const [slugEdited, setSlugEdited] =
    useState(false);

  const [categoryOpen, setCategoryOpen] =
    useState(false);

  const [statusOpen, setStatusOpen] =
    useState(false);

  const [formData, setFormData] =
    useState<ProductFormData>({
      name: "",
      slug: "",
      category: "Software",
      shortDescription: "",
      description: "",
      imageUrl: "",
      status: "draft",
      featured: false,
      sortOrder: 0,
    });

  // Automatically generate slug from product name
  useEffect(() => {
    if (!slugEdited) {
      setFormData((previous) => ({
        ...previous,
        slug: slugify(previous.name),
      }));
    }
  }, [formData.name, slugEdited]);

  const selectedStatus =
    statuses.find(
      (item) =>
        item.value === formData.status
    ) ?? statuses[0];

  function updateField<
    K extends keyof ProductFormData
  >(
    field: K,
    value: ProductFormData[K]
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError(
        "Please enter a product name."
      );
      return;
    }

    if (!formData.slug.trim()) {
      setError(
        "Please enter a product slug."
      );
      return;
    }

    startTransition(async () => {
      try {
        await createProduct(formData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to save product."
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      {/* MAIN CONTENT */}

      <div className="space-y-6">

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Product information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the main information displayed
              on the Green Lunar website.
            </p>
          </div>

          <div className="space-y-5">

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                value={formData.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                placeholder="e.g. Lunar VMS"
                className="
                  w-full rounded-xl
                  border border-gray-200
                  px-4 py-3
                  text-sm text-gray-900
                  outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#073f30]
                  focus:ring-4 focus:ring-green-100
                "
              />
            </div>

            {/* SLUG */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                URL slug
              </label>

              <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#073f30] focus-within:ring-4 focus-within:ring-green-100">

                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 text-sm text-gray-500">
                  /products/
                </span>

                <input
                  value={formData.slug}
                  onChange={(event) => {
                    setSlugEdited(true);

                    updateField(
                      "slug",
                      slugify(
                        event.target.value
                      )
                    );
                  }}
                  placeholder="lunar-vms"
                  className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                />

              </div>

              <p className="mt-2 text-xs text-gray-400">
                Automatically generated from the
                product name. You can edit it.
              </p>
            </div>

            {/* SHORT DESCRIPTION */}

            <div>
              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-semibold text-gray-700">
                  Short description
                </label>

                <span className="text-xs text-gray-400">
                  {
                    formData.shortDescription
                      .length
                  }
                  /180
                </span>

              </div>

              <textarea
                value={
                  formData.shortDescription
                }
                maxLength={180}
                rows={3}
                onChange={(event) =>
                  updateField(
                    "shortDescription",
                    event.target.value
                  )
                }
                placeholder="A brief summary of the product..."
                className="
                  w-full resize-none
                  rounded-xl border
                  border-gray-200
                  px-4 py-3
                  text-sm outline-none
                  transition
                  focus:border-[#073f30]
                  focus:ring-4 focus:ring-green-100
                "
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full description
              </label>

              <textarea
                value={formData.description}
                rows={10}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe the product, its capabilities and benefits..."
                className="
                  w-full resize-y
                  rounded-xl border
                  border-gray-200
                  px-4 py-3
                  text-sm leading-6
                  outline-none transition
                  focus:border-[#073f30]
                  focus:ring-4 focus:ring-green-100
                "
              />
            </div>

          </div>

        </div>

        {/* IMAGE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Product image
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              For now, enter a publicly accessible
              image URL. We'll add Supabase Storage
              upload next.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[180px_1fr]">

            <div className="flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">

              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon
                    size={28}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Image preview
                  </p>
                </div>
              )}

            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Image URL
              </label>

              <input
                type="url"
                value={formData.imageUrl}
                onChange={(event) =>
                  updateField(
                    "imageUrl",
                    event.target.value
                  )
                }
                placeholder="https://..."
                className="
                  w-full rounded-xl
                  border border-gray-200
                  px-4 py-3
                  text-sm outline-none
                  focus:border-[#073f30]
                  focus:ring-4 focus:ring-green-100
                "
              />
            </div>

          </div>

        </div>

      </div>

      {/* SIDEBAR */}

      <div className="space-y-6">

        {/* PUBLISH */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-gray-900">
            Publishing
          </h2>

          <div className="mt-5 space-y-5">

            {/* STATUS */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </label>

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setStatusOpen(
                      (previous) => !previous
                    )
                  }
                  className="
                    flex w-full items-center
                    justify-between rounded-xl
                    border border-gray-200
                    px-4 py-3
                    text-left text-sm
                    transition
                    hover:border-gray-300
                  "
                >
                  <span>
                    <span className="block font-semibold text-gray-800">
                      {selectedStatus.label}
                    </span>

                    <span className="mt-0.5 block text-xs text-gray-400">
                      {
                        selectedStatus.description
                      }
                    </span>
                  </span>

                  <ChevronDown
                    size={17}
                    className={`
                      text-gray-400 transition
                      ${
                        statusOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {statusOpen && (
                  <div className="
                    absolute left-0 right-0
                    top-full z-30 mt-2
                    rounded-2xl
                    border border-gray-100
                    bg-white p-1.5
                    shadow-xl
                  ">

                    {statuses.map(
                      (status) => {
                        const selected =
                          status.value ===
                          formData.status;

                        return (
                          <button
                            key={
                              status.value
                            }
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
                              flex w-full
                              items-center
                              justify-between
                              rounded-xl
                              px-3 py-2.5
                              text-left
                              transition

                              ${
                                selected
                                  ? "bg-green-50"
                                  : "hover:bg-gray-50"
                              }
                            `}
                          >
                            <span>
                              <span className="block text-sm font-semibold text-gray-700">
                                {
                                  status.label
                                }
                              </span>

                              <span className="mt-0.5 block text-xs text-gray-400">
                                {
                                  status.description
                                }
                              </span>
                            </span>

                            {selected && (
                              <Check
                                size={17}
                                className="text-[#073f30]"
                              />
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>
                )}

              </div>
            </div>

            {/* FEATURED */}

            <button
              type="button"
              onClick={() =>
                updateField(
                  "featured",
                  !formData.featured
                )
              }
              className="
                flex w-full items-center
                justify-between
                rounded-xl border
                border-gray-200
                p-4 text-left
              "
            >
              <span className="flex items-center gap-3">

                <span
                  className={`
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    ${
                      formData.featured
                        ? "bg-amber-50 text-amber-600"
                        : "bg-gray-50 text-gray-400"
                    }
                  `}
                >
                  <Star
                    size={18}
                    fill={
                      formData.featured
                        ? "currentColor"
                        : "none"
                    }
                  />
                </span>

                <span>
                  <span className="block text-sm font-semibold text-gray-700">
                    Featured product
                  </span>

                  <span className="mt-0.5 block text-xs text-gray-400">
                    Highlight this product.
                  </span>
                </span>

              </span>

              <span
                className={`
                  relative h-6 w-11
                  rounded-full
                  transition
                  ${
                    formData.featured
                      ? "bg-[#073f30]"
                      : "bg-gray-200"
                  }
                `}
              >
                <span
                  className={`
                    absolute top-1
                    h-4 w-4
                    rounded-full bg-white
                    shadow transition
                    ${
                      formData.featured
                        ? "left-6"
                        : "left-1"
                    }
                  `}
                />
              </span>

            </button>

          </div>

        </div>

        {/* ORGANIZATION */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-gray-900">
            Organization
          </h2>

          <div className="mt-5 space-y-5">

            {/* CATEGORY */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </label>

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setCategoryOpen(
                      (previous) => !previous
                    )
                  }
                  className="
                    flex w-full items-center
                    justify-between
                    rounded-xl border
                    border-gray-200
                    px-4 py-3
                    text-sm font-medium
                    text-gray-700
                  "
                >
                  {formData.category}

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
                  <div className="
                    absolute left-0 right-0
                    top-full z-30
                    mt-2 rounded-2xl
                    border border-gray-100
                    bg-white p-1.5
                    shadow-xl
                  ">

                    {categories.map(
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
                            flex w-full
                            items-center
                            justify-between
                            rounded-xl
                            px-3 py-2.5
                            text-left text-sm
                            transition

                            ${
                              formData.category ===
                              category
                                ? "bg-green-50 font-semibold text-[#073f30]"
                                : "text-gray-600 hover:bg-gray-50"
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
            </div>

            {/* SORT ORDER */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Display order
              </label>

              <input
                type="number"
                min="0"
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
                  w-full rounded-xl
                  border border-gray-200
                  px-4 py-3
                  text-sm outline-none
                  focus:border-[#073f30]
                  focus:ring-4 focus:ring-green-100
                "
              />

              <p className="mt-2 text-xs text-gray-400">
                Lower numbers appear first.
              </p>
            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* SAVE */}

        <button
          type="submit"
          disabled={isPending}
          className="
            flex w-full items-center
            justify-center gap-2
            rounded-xl
            bg-[#073f30]
            px-5 py-3
            text-sm font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#09543f]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isPending ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />

              {mode === "create"
                ? "Create Product"
                : "Save Changes"}
            </>
          )}
        </button>

      </div>
    </form>
  );
}