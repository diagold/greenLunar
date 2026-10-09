"use client";

import { useState, useTransition } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Save,
} from "lucide-react";

import { updateWhyChooseUs } from "@/app/admin/(dashboard)/homepage/why-choose-us/actions";
import WhyChooseUsImageUpload from "./WhyChooseUsImageUpload";

type Settings = {
  id: string;
  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;
  image_url: string | null;
  stat_value: string | null;
  stat_label: string | null;
  is_active: boolean;
};

type Props = {
  settings: Settings;
};

export default function WhyChooseUsForm({
  settings,
}: Props) {
  const [eyebrow, setEyebrow] = useState(
    settings.eyebrow ?? ""
  );

  const [heading, setHeading] = useState(
    settings.heading ?? ""
  );

  const [highlight, setHighlight] = useState(
    settings.highlight ?? ""
  );

  const [description, setDescription] = useState(
    settings.description ?? ""
  );

  const [imageUrl, setImageUrl] = useState(
    settings.image_url ?? ""
  );

  const [statValue, setStatValue] = useState(
    settings.stat_value ?? ""
  );

  const [statLabel, setStatLabel] = useState(
    settings.stat_label ?? ""
  );

  const [isActive, setIsActive] = useState(
    settings.is_active
  );

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setMessage("");
    setErrorMessage("");

    startTransition(async () => {
      try {
        await updateWhyChooseUs(settings.id, {
          eyebrow,
          heading,
          highlight,
          description,
          imageUrl,
          statValue,
          statLabel,
          isActive,
        });

        setMessage(
          "Why Choose Us section updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update section."
        );
      }
    });
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Section Content
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the content, image and experience statistic.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsActive((current) => !current)}
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

          {isActive ? "Section Visible" : "Section Hidden"}
        </button>
      </div>

      {message && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={17} />
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-8">
        <WhyChooseUsImageUpload
          value={imageUrl}
          onChange={setImageUrl}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Eyebrow
          </label>

          <input
            value={eyebrow}
            onChange={(event) =>
              setEyebrow(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Heading
            </label>

            <input
              value={heading}
              onChange={(event) =>
                setHeading(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Highlighted Text
            </label>

            <input
              value={highlight}
              onChange={(event) =>
                setHighlight(event.target.value)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Statistic Value
            </label>

            <input
              value={statValue}
              onChange={(event) =>
                setStatValue(event.target.value)
              }
              placeholder="10+"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Statistic Label
            </label>

            <input
              value={statLabel}
              onChange={(event) =>
                setStatLabel(event.target.value)
              }
              placeholder="YEARS OF PURE CONSISTENCY"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a503d] disabled:opacity-60"
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}