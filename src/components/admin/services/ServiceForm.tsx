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
  Loader2,
  Save,
} from "lucide-react";

import {
  createService,
  updateService,
} from "@/app/admin/(dashboard)/services/actions";

import type {
  ServiceFormData,
  ServiceStatus,
} from "@/types/service";

import ServiceContentList from "./ServiceContentList";
import ServiceGalleryUpload from "./ServiceGalleryUpload";
import ServiceImageUpload from "./ServiceImageUpload";

type Props = {
  mode?: "create" | "edit";
  serviceId?: string;
  initialData?: ServiceFormData;
};

const categories = [
  "Technology",
  "Construction",
  "Fitness & Wellness",
  "Media & Entertainment",
  "Real Estate & Hospitality",
  "Other",
];

function generateSlug(
  value: string
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

function emptyForm(): ServiceFormData {
  return {
    name: "",
    slug: "",
    category: "Technology",

    shortDescription: "",
    description: "",

    imageUrl: "",
    gallery: [],

    capabilities: [],
    benefits: [],

    primaryButtonText:
      "Get Started",

    primaryButtonUrl:
      "/contact",

    secondaryButtonText:
      "Learn More",

    secondaryButtonUrl:
      "#overview",

    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoImageUrl: "",

    status: "draft",

    featured: false,

    sortOrder: 0,
  };
}

export default function ServiceForm({
  mode = "create",
  serviceId,
  initialData,
}: Props) {
  const router =
    useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    formData,
    setFormData,
  ] = useState<ServiceFormData>(
    () =>
      initialData ??
      emptyForm()
  );

  const [
    slugEdited,
    setSlugEdited,
  ] = useState(
    mode === "edit"
  );

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(
        initialData
      );
    }
  }, [initialData]);

  function updateField<
    K extends keyof ServiceFormData,
  >(
    field: K,
    value: ServiceFormData[K]
  ) {
    setFormData(
      (current) => ({
        ...current,
        [field]: value,
      })
    );
  }

  function handleName(
    value: string
  ) {
    setFormData(
      (current) => ({
        ...current,

        name: value,

        slug: slugEdited
          ? current.slug
          : generateSlug(
              value
            ),
      })
    );
  }

  // function submit(
  //   event: FormEvent<HTMLFormElement>
  // ) {
  //   event.preventDefault();

  //   setError("");
  //   setSuccess("");

  //   if (
  //     !formData.name.trim()
  //   ) {
  //     setError(
  //       "Please enter a service name."
  //     );

  //     return;
  //   }

  //   if (
  //     !formData.slug.trim()
  //   ) {
  //     setError(
  //       "Please enter a valid service slug."
  //     );

  //     return;
  //   }

  //   startTransition(
  //     async () => {
  //       try {
  //         if (
  //           mode === "edit"
  //         ) {
  //           if (!serviceId) {
  //             throw new Error(
  //               "Service ID is missing."
  //             );
  //           }

  //           await updateService(
  //             serviceId,
  //             formData
  //           );

  //           setSuccess(
  //             "Service updated successfully."
  //           );

  //           router.refresh();

  //           return;
  //         }

  //         const result =
  //           await createService(
  //             formData
  //           );

  //         router.push(
  //           `/admin/services/${result.id}`
  //         );

  //         router.refresh();
  //       } catch (
  //         submitError
  //       ) {
  //         console.error(
  //           submitError
  //         );

  //         setError(
  //           submitError instanceof
  //             Error
  //             ? submitError.message
  //             : "Unable to save service."
  //         );
  //       }
  //     }
  //   );
  // }

  function submit(
  event: FormEvent<HTMLFormElement>
    ) {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!formData.name.trim()) {
        setError(
          "Please enter a service name."
        );

        return;
      }

      if (!formData.slug.trim()) {
        setError(
          "Please enter a valid service slug."
        );

        return;
      }

      startTransition(
        async () => {
          try {
            /* =========================================
              EDIT EXISTING SERVICE
            ========================================= */

            if (mode === "edit") {
              if (!serviceId) {
                throw new Error(
                  "Service ID is missing."
                );
              }

              await updateService(
                serviceId,
                formData
              );

              setSuccess(
                "Service updated successfully."
              );

              router.refresh();

              return;
            }

            /* =========================================
              CREATE NEW SERVICE
            ========================================= */

            const result =
              await createService(
                formData
              );

            if (!result?.success) {
              throw new Error(
                "The service could not be created."
              );
            }

            /*
            * After creating the service, return to
            * the Services list instead of opening
            * the edit page.
            *
            * The service name is passed so the list
            * page can display a success message.
            */

            router.push(
              `/admin/services?created=${encodeURIComponent(
                formData.name.trim()
              )}`
            );

            router.refresh();
          } catch (submitError) {
            console.error(
              "Unable to save service:",
              submitError
            );

            setError(
              submitError instanceof Error
                ? submitError.message
                : "Unable to save service."
            );
          }
        }
      );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check
            size={16}
          />

          {success}
        </div>
      )}

      {/* BASIC INFORMATION */}

      <section
        id="overview"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the core information for this service.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field
            label="Service Name"
            required
          >
            <input
              value={
                formData.name
              }
              onChange={(
                event
              ) =>
                handleName(
                  event.target
                    .value
                )
              }
              placeholder="Technology"
              className={inputClass}
            />
          </Field>

          <Field
            label="URL Slug"
            required
          >
            <input
              value={
                formData.slug
              }
              onChange={(
                event
              ) => {
                setSlugEdited(
                  true
                );

                updateField(
                  "slug",
                  generateSlug(
                    event.target
                      .value
                  )
                );
              }}
              placeholder="technology"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-400">
              /services/
              {formData.slug ||
                "service-slug"}
            </p>
          </Field>

          <Field label="Category">
            <select
              value={
                formData.category
              }
              onChange={(
                event
              ) =>
                updateField(
                  "category",
                  event.target
                    .value
                )
              }
              className={inputClass}
            >
              {categories.map(
                (category) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {category}
                  </option>
                )
              )}
            </select>
          </Field>

          <Field label="Sort Order">
            <input
              type="number"
              min={0}
              value={
                formData.sortOrder
              }
              onChange={(
                event
              ) =>
                updateField(
                  "sortOrder",
                  Number(
                    event.target
                      .value
                  )
                )
              }
              className={inputClass}
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field label="Short Description">
            <textarea
              rows={3}
              value={
                formData.shortDescription
              }
              onChange={(
                event
              ) =>
                updateField(
                  "shortDescription",
                  event.target
                    .value
                )
              }
              placeholder="A concise summary of this service..."
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        <div className="mt-6">
          <Field label="Full Description">
            <textarea
              rows={8}
              value={
                formData.description
              }
              onChange={(
                event
              ) =>
                updateField(
                  "description",
                  event.target
                    .value
                )
              }
              placeholder="Describe the service in detail..."
              className={`${inputClass} resize-y leading-7`}
            />
          </Field>
        </div>
      </section>

      <ServiceImageUpload
        value={
          formData.imageUrl
        }
        slug={
          formData.slug
        }
        onChange={(
          imageUrl
        ) =>
          updateField(
            "imageUrl",
            imageUrl
          )
        }
      />

      <ServiceGalleryUpload
        slug={
          formData.slug
        }
        items={
          formData.gallery
        }
        onChange={(
          gallery
        ) =>
          updateField(
            "gallery",
            gallery
          )
        }
      />

      <ServiceContentList
        title="Service Capabilities"
        description="Add the main capabilities offered under this service."
        itemLabel="Capability"
        items={
          formData.capabilities
        }
        onChange={(
          capabilities
        ) =>
          updateField(
            "capabilities",
            capabilities
          )
        }
      />

      <ServiceContentList
        title="Service Benefits"
        description="Explain the main value and benefits customers receive from this service."
        itemLabel="Benefit"
        items={
          formData.benefits
        }
        onChange={(
          benefits
        ) =>
          updateField(
            "benefits",
            benefits
          )
        }
      />

      {/* BUTTONS */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Service Buttons
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure the calls to action displayed on the public service page.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field label="Primary Button Text">
            <input
              value={
                formData.primaryButtonText
              }
              onChange={(
                event
              ) =>
                updateField(
                  "primaryButtonText",
                  event.target
                    .value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Primary Button URL">
            <input
              value={
                formData.primaryButtonUrl
              }
              onChange={(
                event
              ) =>
                updateField(
                  "primaryButtonUrl",
                  event.target
                    .value
                )
              }
              placeholder="/contact"
              className={inputClass}
            />
          </Field>

          <Field label="Secondary Button Text">
            <input
              value={
                formData.secondaryButtonText
              }
              onChange={(
                event
              ) =>
                updateField(
                  "secondaryButtonText",
                  event.target
                    .value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Secondary Button URL">
            <input
              value={
                formData.secondaryButtonUrl
              }
              onChange={(
                event
              ) =>
                updateField(
                  "secondaryButtonUrl",
                  event.target
                    .value
                )
              }
              placeholder="#overview"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* SEO */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Search Engine Optimisation
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Control how this service appears in search engines and social sharing.
        </p>

        <div className="mt-6 space-y-6">
          <Field label="SEO Title">
            <input
              maxLength={60}
              value={
                formData.seoTitle
              }
              onChange={(
                event
              ) =>
                updateField(
                  "seoTitle",
                  event.target
                    .value
                )
              }
              placeholder="Technology Services | Green Lunar"
              className={inputClass}
            />
          </Field>

          <Field label="Meta Description">
            <textarea
              rows={4}
              maxLength={160}
              value={
                formData.seoDescription
              }
              onChange={(
                event
              ) =>
                updateField(
                  "seoDescription",
                  event.target
                    .value
                )
              }
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Keywords">
            <input
              value={
                formData.seoKeywords
              }
              onChange={(
                event
              ) =>
                updateField(
                  "seoKeywords",
                  event.target
                    .value
                )
              }
              placeholder="technology, software, enterprise solutions"
              className={inputClass}
            />
          </Field>

          <Field label="Social Sharing Image URL">
            <input
              type="url"
              value={
                formData.seoImageUrl
              }
              onChange={(
                event
              ) =>
                updateField(
                  "seoImageUrl",
                  event.target
                    .value
                )
              }
              placeholder="Leave empty to use the main image"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* PUBLISHING */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Publishing
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field label="Status">
            <select
              value={
                formData.status
              }
              onChange={(
                event
              ) =>
                updateField(
                  "status",
                  event.target
                    .value as ServiceStatus
                )
              }
              className={inputClass}
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>

              <option value="archived">
                Archived
              </option>
            </select>
          </Field>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">
              Featured Service
            </p>

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
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.featured
                    ? "Featured"
                    : "Not Featured"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Highlight this service in featured sections.
                </p>
              </div>

              <div
                className={`relative h-6 w-11 rounded-full transition ${
                  formData.featured
                    ? "bg-[#073f30]"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    formData.featured
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* SAVE */}

      <div className="sticky bottom-4 z-20 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {mode === "edit"
              ? "Update Service"
              : "Create Service"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formData.status ===
            "published"
              ? "This service will be visible on the public website."
              : "This service will not be publicly visible until published."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={
              isPending
            }
            onClick={() =>
              router.push(
                "/admin/services"
              )
            }
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isPending
            }
            className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#073f30] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09543f] disabled:opacity-60"
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
                <Save
                  size={17}
                />

                {mode === "edit"
                  ? "Save Changes"
                  : "Create Service"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#073f30] focus:ring-2 focus:ring-green-100";

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}

        {required && (
          <span className="text-red-500">
            {" "}*
          </span>
        )}
      </label>

      {children}
    </div>
  );
}