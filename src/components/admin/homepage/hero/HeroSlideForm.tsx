"use client";

import {
  FormEvent,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";

import {
  createHeroSlide,
  updateHeroSlide,
} from "@/app/admin/(dashboard)/homepage/hero/actions";

import type { HeroSlideFormData } from "@/types/hero";

import HeroImageUpload from "./HeroImageUpload";

type HeroSlideFormProps = {
  mode: "create" | "edit";
  slideId?: string;
  initialData?: HeroSlideFormData;
};

const emptyForm: HeroSlideFormData = {
  eyebrow: "",
  title: "",
  highlight: "",
  ending: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function HeroSlideForm({
  mode,
  slideId,
  initialData,
}: HeroSlideFormProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [formData, setFormData] =
    useState<HeroSlideFormData>(
      initialData ?? emptyForm
    );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<K extends keyof HeroSlideFormData>(
    field: K,
    value: HeroSlideFormData[K]
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Hero title is required.");
      return;
    }

    startTransition(async () => {
      try {
        if (mode === "edit") {
          if (!slideId) {
            throw new Error(
              "Hero slide ID is missing."
            );
          }

          await updateHeroSlide(
            slideId,
            formData
          );

          setSuccess(
            "Hero slide updated successfully."
          );

          router.refresh();

          return;
        }

        await createHeroSlide(formData);

        router.push(
          "/admin/homepage/hero?created=1"
        );

        router.refresh();
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      }
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-8"
    >
      {/* IMAGE */}
      <Section
        title="Hero Image"
        description="Upload the background image displayed for this hero slide."
      >
        <HeroImageUpload
          value={formData.imageUrl}
          onChange={(url) =>
            updateField("imageUrl", url)
          }
        />
      </Section>

      {/* CONTENT */}
      <Section
        title="Hero Content"
        description="Manage the text displayed over the hero image."
      >
        <div className="grid gap-6">
          <Field
            label="Eyebrow"
            hint="Small uppercase text displayed above the main heading."
          >
            <input
              value={formData.eyebrow}
              onChange={(event) =>
                updateField(
                  "eyebrow",
                  event.target.value
                )
              }
              placeholder="DIGITAL TRANSFORMATION"
              className={inputClass}
            />
          </Field>

          <Field
            label="Title"
            required
            hint="First line of the hero heading."
          >
            <input
              value={formData.title}
              onChange={(event) =>
                updateField(
                  "title",
                  event.target.value
                )
              }
              placeholder="Building Technology that"
              className={inputClass}
            />
          </Field>

          <Field
            label="Highlight Text"
            hint="The green highlighted line."
          >
            <input
              value={formData.highlight}
              onChange={(event) =>
                updateField(
                  "highlight",
                  event.target.value
                )
              }
              placeholder="moves business"
              className={inputClass}
            />
          </Field>

          <Field
            label="Ending Text"
            hint="Final line of the hero heading."
          >
            <input
              value={formData.ending}
              onChange={(event) =>
                updateField(
                  "ending",
                  event.target.value
                )
              }
              placeholder="forward."
              className={inputClass}
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={5}
              value={formData.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              placeholder="Enter the supporting hero description..."
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {/* DISPLAY */}
      <Section
        title="Display Settings"
        description="Control where the slide appears and whether visitors can see it."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Display Order"
            hint="Lower numbers appear first."
          >
            <input
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(event) =>
                updateField(
                  "sortOrder",
                  Number(event.target.value)
                )
              }
              className={inputClass}
            />
          </Field>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Slide Status
            </p>

            <button
              type="button"
              onClick={() =>
                updateField(
                  "isActive",
                  !formData.isActive
                )
              }
              className="
                mt-3
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-4
                text-left
              "
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formData.isActive
                    ? "Active"
                    : "Inactive"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formData.isActive
                    ? "This slide can be displayed on the homepage."
                    : "This slide will be hidden from visitors."}
                </p>
              </div>

              <span
                className={`
                  relative
                  h-6
                  w-11
                  shrink-0
                  rounded-full
                  transition

                  ${
                    formData.isActive
                      ? "bg-green-600"
                      : "bg-gray-300"
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
                    transition

                    ${
                      formData.isActive
                        ? "left-6"
                        : "left-1"
                    }
                  `}
                />
              </span>
            </button>
          </div>
        </div>
      </Section>

      {/* FEEDBACK */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check className="h-4 w-4" />
          {success}
        </div>
      )}

      {/* SAVE BAR */}
      <div
        className="
          sticky
          bottom-4
          z-20
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-gray-200
          bg-white/95
          p-4
          shadow-lg
          backdrop-blur
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p className="text-sm text-gray-500">
          {mode === "create"
            ? "Create this slide and add it to the homepage hero."
            : "Save your changes to this hero slide."}
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#073f30]
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-[#0a503d]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Create Hero Slide"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-950">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-900">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {hint && (
        <span className="mt-1 block text-xs leading-5 text-gray-500">
          {hint}
        </span>
      )}

      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}

const inputClass = `
  w-full
  rounded-xl
  border
  border-gray-200
  bg-white
  px-4
  py-3
  text-sm
  text-gray-900
  outline-none
  transition
  placeholder:text-gray-400
  focus:border-green-500
  focus:ring-4
  focus:ring-green-500/10
`;