"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Globe2,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  createTrustStat,
  deleteTrustStat,
  reorderTrustStats,
  toggleTrustStat,
  updateTrustSection,
  updateTrustStat,
} from "@/app/admin/(dashboard)/homepage/trust/actions";

/* =========================================================
   TYPES
========================================================= */

type Settings = {
  id: string;
  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;
  cta_label: string | null;
  cta_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type Stat = {
  id: string;
  section_id: string;
  value: string;
  unit: string | null;
  label: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  settings: Settings;
  stats: Stat[];
};

type StatForm = {
  value: string;
  unit: string;
  label: string;
  icon: string;
  isActive: boolean;
};

const emptyStat: StatForm = {
  value: "",
  unit: "",
  label: "",
  icon: "users",
  isActive: true,
};

/* =========================================================
   ICONS
========================================================= */

const iconOptions = [
  {
    value: "users",
    label: "Users",
    icon: Users,
  },
  {
    value: "building",
    label: "Building",
    icon: Building2,
  },
  {
    value: "globe",
    label: "Globe",
    icon: Globe2,
  },
];

function getStatIcon(
  iconName: string
) {
  const option =
    iconOptions.find(
      (item) =>
        item.value === iconName
    );

  return option?.icon ?? Users;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TrustSectionForm({
  settings,
  stats,
}: Props) {
  const [eyebrow, setEyebrow] =
    useState(settings.eyebrow ?? "");

  const [heading, setHeading] =
    useState(settings.heading ?? "");

  const [highlight, setHighlight] =
    useState(settings.highlight ?? "");

  const [description, setDescription] =
    useState(
      settings.description ?? ""
    );

  const [ctaLabel, setCtaLabel] =
    useState(
      settings.cta_label ?? ""
    );

  const [ctaUrl, setCtaUrl] =
    useState(
      settings.cta_url ?? ""
    );

  const [
    sectionActive,
    setSectionActive,
  ] = useState(settings.is_active);

  const [
    displayStats,
    setDisplayStats,
  ] = useState<Stat[]>(
    [...stats].sort(
      (a, b) =>
        a.sort_order - b.sort_order
    )
  );

  const [
    editingStatId,
    setEditingStatId,
  ] = useState<string | null>(null);

  const [
    showNewStat,
    setShowNewStat,
  ] = useState(false);

  const [
    deletingStat,
    setDeletingStat,
  ] = useState<Stat | null>(null);

  const [
    statForm,
    setStatForm,
  ] = useState<StatForm>({
    ...emptyStat,
  });

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [isPending, startTransition] =
    useTransition();

  /* =========================================================
     HELPERS
  ========================================================= */

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  function resetStatEditor() {
    setEditingStatId(null);
    setShowNewStat(false);

    setStatForm({
      ...emptyStat,
    });
  }

  function openNewStat() {
    clearMessages();

    setDeletingStat(null);
    setEditingStatId(null);

    setStatForm({
      ...emptyStat,
    });

    setShowNewStat(true);
  }

  function openEditStat(
    stat: Stat
  ) {
    clearMessages();

    setDeletingStat(null);
    setShowNewStat(false);

    setEditingStatId(stat.id);

    setStatForm({
      value: stat.value,
      unit: stat.unit ?? "",
      label: stat.label,
      icon: stat.icon,
      isActive:
        stat.is_active,
    });
  }

  /* =========================================================
     SAVE SECTION
  ========================================================= */

  function saveSection() {
    clearMessages();

    if (!heading.trim()) {
      setErrorMessage(
        "Section heading is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateTrustSection(
          settings.id,
          {
            eyebrow,
            heading,
            highlight,
            description,
            ctaLabel,
            ctaUrl,
            isActive:
              sectionActive,
          }
        );

        setSuccessMessage(
          "Trust Section updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update Trust Section."
        );
      }
    });
  }

  /* =========================================================
     CREATE STAT
  ========================================================= */

  function createStat() {
    clearMessages();

    if (!statForm.value.trim()) {
      setErrorMessage(
        "Statistic value is required."
      );

      return;
    }

    if (!statForm.label.trim()) {
      setErrorMessage(
        "Statistic label is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        const result =
          await createTrustStat({
            sectionId:
              settings.id,

            value:
              statForm.value,

            unit:
              statForm.unit,

            label:
              statForm.label,

            icon:
              statForm.icon,

            sortOrder:
              displayStats.length +
              1,

            isActive:
              statForm.isActive,
          });

        if (result.stat) {
          setDisplayStats(
            (current) => [
              ...current,
              result.stat as Stat,
            ]
          );
        }

        const label =
          statForm.label.trim();

        resetStatEditor();

        setSuccessMessage(
          `"${label}" was added successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to add statistic."
        );
      }
    });
  }

  /* =========================================================
     UPDATE STAT
  ========================================================= */

  function saveStat(
    stat: Stat
  ) {
    clearMessages();

    if (!statForm.value.trim()) {
      setErrorMessage(
        "Statistic value is required."
      );

      return;
    }

    if (!statForm.label.trim()) {
      setErrorMessage(
        "Statistic label is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateTrustStat(
          stat.id,
          {
            sectionId:
              settings.id,

            value:
              statForm.value,

            unit:
              statForm.unit,

            label:
              statForm.label,

            icon:
              statForm.icon,

            sortOrder:
              stat.sort_order,

            isActive:
              statForm.isActive,
          }
        );

        const updatedLabel =
          statForm.label.trim();

        setDisplayStats(
          (current) =>
            current.map((item) =>
              item.id === stat.id
                ? {
                    ...item,

                    value:
                      statForm.value.trim(),

                    unit:
                      statForm.unit.trim() ||
                      null,

                    label:
                      updatedLabel,

                    icon:
                      statForm.icon,

                    is_active:
                      statForm.isActive,
                  }
                : item
            )
        );

        resetStatEditor();

        setSuccessMessage(
          `"${updatedLabel}" was updated successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update statistic."
        );
      }
    });
  }

  /* =========================================================
     VISIBILITY
  ========================================================= */

  function toggleStat(
    stat: Stat
  ) {
    clearMessages();

    const nextValue =
      !stat.is_active;

    startTransition(async () => {
      try {
        await toggleTrustStat(
          stat.id,
          nextValue
        );

        setDisplayStats(
          (current) =>
            current.map((item) =>
              item.id === stat.id
                ? {
                    ...item,
                    is_active:
                      nextValue,
                  }
                : item
            )
        );

        setSuccessMessage(
          nextValue
            ? `"${stat.label}" is now visible.`
            : `"${stat.label}" is now hidden.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to change visibility."
        );
      }
    });
  }

  /* =========================================================
     DELETE
  ========================================================= */

  function deleteStat(
    stat: Stat
  ) {
    clearMessages();

    startTransition(async () => {
      try {
        await deleteTrustStat(
          stat.id
        );

        const remaining =
          displayStats.filter(
            (item) =>
              item.id !== stat.id
          );

        const normalized =
          remaining.map(
            (item, index) => ({
              ...item,
              sort_order:
                index + 1,
            })
          );

        setDisplayStats(
          normalized
        );

        if (
          normalized.length > 0
        ) {
          await reorderTrustStats(
            normalized.map(
              (item) => item.id
            )
          );
        }

        if (
          editingStatId ===
          stat.id
        ) {
          resetStatEditor();
        }

        setDeletingStat(null);

        setSuccessMessage(
          `"${stat.label}" was deleted successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete statistic."
        );
      }
    });
  }

  /* =========================================================
     REORDER
  ========================================================= */

  function moveStat(
    index: number,
    direction: "up" | "down"
  ) {
    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >= displayStats.length
    ) {
      return;
    }

    clearMessages();

    const previous = [
      ...displayStats,
    ];

    const reordered = [
      ...displayStats,
    ];

    [
      reordered[index],
      reordered[target],
    ] = [
      reordered[target],
      reordered[index],
    ];

    const normalized =
      reordered.map(
        (item, itemIndex) => ({
          ...item,
          sort_order:
            itemIndex + 1,
        })
      );

    setDisplayStats(normalized);

    startTransition(async () => {
      try {
        await reorderTrustStats(
          normalized.map(
            (item) => item.id
          )
        );

        setSuccessMessage(
          "Statistic order updated successfully."
        );
      } catch (error) {
        setDisplayStats(previous);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to reorder statistics."
        );
      }
    });
  }

  /* =========================================================
     STAT EDITOR
  ========================================================= */

  function renderStatEditor(
    mode: "create" | "edit",
    stat?: Stat
  ) {
    return (
      <div className="border-t border-gray-100 bg-gray-50/70 p-5 sm:p-6 lg:px-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {mode === "create"
                ? "Add Statistic"
                : `Edit ${stat?.label}`}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Configure the statistic
              displayed in the Trust
              Section.
            </p>
          </div>

          <button
            type="button"
            onClick={resetStatEditor}
            disabled={isPending}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Value
              </label>

              <input
                value={statForm.value}
                onChange={(event) =>
                  setStatForm(
                    (current) => ({
                      ...current,
                      value:
                        event.target.value,
                    })
                  )
                }
                placeholder="25,000+"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Unit
              </label>

              <input
                value={statForm.unit}
                onChange={(event) =>
                  setStatForm(
                    (current) => ({
                      ...current,
                      unit:
                        event.target.value,
                    })
                  )
                }
                placeholder="Optional"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Label
              </label>

              <input
                value={statForm.label}
                onChange={(event) =>
                  setStatForm(
                    (current) => ({
                      ...current,
                      label:
                        event.target.value,
                    })
                  )
                }
                placeholder="Customers"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* ICON SELECTOR */}

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              Icon
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {iconOptions.map(
                (option) => {
                  const Icon =
                    option.icon;

                  const selected =
                    statForm.icon ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        setStatForm(
                          (current) => ({
                            ...current,
                            icon:
                              option.value,
                          })
                        )
                      }
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                        <Icon
                          size={18}
                        />
                      </div>

                      <span className="text-sm font-medium">
                        {
                          option.label
                        }
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* VISIBILITY */}

          <button
            type="button"
            onClick={() =>
              setStatForm(
                (current) => ({
                  ...current,
                  isActive:
                    !current.isActive,
                })
              )
            }
            className={`inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
              statForm.isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {statForm.isActive ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}

            {statForm.isActive
              ? "Visible"
              : "Hidden"}
          </button>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={resetStatEditor}
              disabled={isPending}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (
                  mode === "create"
                ) {
                  createStat();
                } else if (stat) {
                  saveStat(stat);
                }
              }}
              className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#073f30] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-60"
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

                  {mode === "create"
                    ? "Add Statistic"
                    : "Save Changes"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-8">

      {/* MESSAGES */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={18} />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deletingStat && (
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Delete{" "}
                  {deletingStat.label}?
                </h3>

                <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                  Are you sure you want
                  to remove{" "}
                  <span className="font-medium text-gray-700">
                    {
                      deletingStat.label
                    }
                  </span>{" "}
                  from the Trust Section?
                  This action cannot be
                  undone.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingStat(null)
                }
                disabled={isPending}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteStat(
                    deletingStat
                  )
                }
                disabled={isPending}
                className="inline-flex min-w-[125px] items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                    />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          SECTION CONTENT
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Section Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the heading,
              description and
              partnership call-to-action.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSectionActive(
                (current) => !current
              )
            }
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              sectionActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {sectionActive ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}

            {sectionActive
              ? "Section Visible"
              : "Section Hidden"}
          </button>
        </div>

        <div className="grid gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Eyebrow
            </label>

            <input
              value={eyebrow}
              onChange={(event) =>
                setEyebrow(
                  event.target.value
                )
              }
              placeholder="TRUSTED BY BUSINESSES"
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
                  setHeading(
                    event.target.value
                  )
                }
                placeholder="Trusted by organizations"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Highlight
              </label>

              <input
                value={highlight}
                onChange={(event) =>
                  setHighlight(
                    event.target.value
                  )
                }
                placeholder="building the future."
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
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* CTA */}

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="font-medium text-gray-800">
              Call to Action
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Configure the partnership
              button displayed beneath
              the statistics.
            </p>

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Button Label
                </label>

                <input
                  value={ctaLabel}
                  onChange={(event) =>
                    setCtaLabel(
                      event.target.value
                    )
                  }
                  placeholder="Partner With Us Today"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Button URL
                </label>

                <input
                  value={ctaUrl}
                  onChange={(event) =>
                    setCtaUrl(
                      event.target.value
                    )
                  }
                  placeholder="/contact"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={saveSection}
              disabled={isPending}
              className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-60"
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
                  Save Section
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Statistics
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the statistics
              displayed beneath the Trust
              Section introduction.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewStat}
            disabled={
              showNewStat ||
              isPending
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-50"
          >
            <Plus size={17} />
            Add Statistic
          </button>
        </div>

        {showNewStat &&
          renderStatEditor("create")}

        <div className="divide-y divide-gray-100">
          {displayStats.map(
            (stat, index) => {
              const Icon =
                getStatIcon(
                  stat.icon
                );

              return (
                <div key={stat.id}>
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center lg:px-8">

                    {/* ICON */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                      <Icon size={21} />
                    </div>

                    {/* STAT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {stat.value}

                          {stat.unit && (
                            <span className="ml-1 text-green-600">
                              {
                                stat.unit
                              }
                            </span>
                          )}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            stat.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {stat.is_active
                            ? "Visible"
                            : "Hidden"}
                        </span>

                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                          Position{" "}
                          {index + 1}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {stat.label}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={
                          index === 0 ||
                          isPending
                        }
                        onClick={() =>
                          moveStat(
                            index,
                            "up"
                          )
                        }
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ChevronUp
                          size={18}
                        />
                      </button>

                      <button
                        type="button"
                        disabled={
                          index ===
                            displayStats.length -
                              1 ||
                          isPending
                        }
                        onClick={() =>
                          moveStat(
                            index,
                            "down"
                          )
                        }
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ChevronDown
                          size={18}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleStat(stat)
                        }
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                          stat.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {stat.is_active ? (
                          <Eye
                            size={15}
                          />
                        ) : (
                          <EyeOff
                            size={15}
                          />
                        )}

                        {stat.is_active
                          ? "Visible"
                          : "Hidden"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditStat(
                            stat
                          )
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Pencil
                          size={15}
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          clearMessages();
                          setDeletingStat(
                            stat
                          );
                        }}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2
                          size={15}
                        />
                        Delete
                      </button>
                    </div>
                  </div>

                  {editingStatId ===
                    stat.id &&
                    renderStatEditor(
                      "edit",
                      stat
                    )}
                </div>
              );
            }
          )}

          {displayStats.length === 0 && (
            <div className="p-10 text-center">
              <Users
                size={26}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 font-medium text-gray-700">
                No statistics added.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first statistic
                to display it in the
                Trust Section.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}