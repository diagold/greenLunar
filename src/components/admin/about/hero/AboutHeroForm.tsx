"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Save,
} from "lucide-react";

import AboutHeroImageUpload from "@/app/admin/(dashboard)/about/hero/AboutHeroImageUpload";

import {
  updateAboutHero,
} from "@/app/admin/(dashboard)/about/hero/actions";

type Hero = {
  id: string;
  heading: string;
  highlight: string | null;
  ending: string | null;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_active: boolean;
};

export default function AboutHeroForm({
  hero,
}: {
  hero: Hero;
}) {
  const [heading, setHeading] =
    useState(hero.heading ?? "");

  const [highlight, setHighlight] =
    useState(hero.highlight ?? "");

  const [ending, setEnding] =
    useState(hero.ending ?? "");

  const [description, setDescription] =
    useState(hero.description ?? "");

  const [imageUrl, setImageUrl] =
    useState(hero.image_url ?? "");

  const [imageAlt, setImageAlt] =
    useState(hero.image_alt ?? "");

  const [isActive, setIsActive] =
    useState(hero.is_active);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  function save() {
    setSuccess("");
    setError("");

    if (!heading.trim()) {
      setError(
        "Hero heading is required."
      );

      return;
    }

    if (!imageUrl.trim()) {
      setError(
        "Hero image is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateAboutHero(
          hero.id,
          {
            heading,
            highlight,
            ending,
            description,
            imageUrl,
            imageAlt,
            isActive,
          }
        );

        setSuccess(
          "About hero updated successfully."
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to update hero."
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={17} />
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              About Hero
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the heading,
              description and background
              image displayed at the top
              of the About Us page.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsActive(
                (current) => !current
              )
            }
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isActive ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}

            {isActive
              ? "Visible"
              : "Hidden"}
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <Field
              label="Heading"
              value={heading}
              onChange={setHeading}
              placeholder="Technology that"
            />

            <Field
              label="Green Highlight"
              value={highlight}
              onChange={setHighlight}
              placeholder="moves business"
            />

            <Field
              label="Heading Ending"
              value={ending}
              onChange={setEnding}
              placeholder="forward."
            />

            <TextArea
              label="Description"
              value={description}
              onChange={setDescription}
            />

            <Field
              label="Image Alt Text"
              value={imageAlt}
              onChange={setImageAlt}
              placeholder="GreenLunar Technologies"
            />

            <Field
              label="Image URL"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://..."
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Hero Background
            </p>

            <AboutHeroImageUpload
              value={imageUrl}
              onChange={setImageUrl}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            type="button"
            disabled={isPending}
            onClick={save}
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a503d] disabled:opacity-60"
          >
            {isPending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            Save Hero
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        rows={5}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}