"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  createAtAGlanceStat,
  deleteAtAGlanceStat,
  reorderAtAGlanceStats,
  toggleAtAGlanceStat,
  updateAtAGlanceSettings,
  updateAtAGlanceStat,
} from "@/app/admin/(dashboard)/about/at-a-glance/actions";

type Settings = {
  id: string;
  eyebrow: string | null;
  description: string | null;
  is_active: boolean;
};

type Stat = {
  id: string;
  section_id: string;

  value: number;
  suffix: string | null;

  title: string;
  description: string | null;

  sort_order: number;
  is_active: boolean;
};

type Props = {
  settings: Settings;
  stats: Stat[];
};

type StatForm = {
  value: string;
  suffix: string;
  title: string;
  description: string;
  isActive: boolean;
};

const emptyStat: StatForm = {
  value: "",
  suffix: "+",
  title: "",
  description: "",
  isActive: true,
};

export default function AtAGlanceForm({
  settings,
  stats,
}: Props) {
  const [eyebrow, setEyebrow] =
    useState(settings.eyebrow ?? "");

  const [description, setDescription] =
    useState(settings.description ?? "");

  const [sectionActive, setSectionActive] =
    useState(settings.is_active);

  const [statItems, setStatItems] =
    useState<Stat[]>(
      [...stats].sort(
        (a, b) => a.sort_order - b.sort_order
      )
    );

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [editingStat, setEditingStat] =
    useState<Stat | null>(null);

  const [deletingStat, setDeletingStat] =
    useState<Stat | null>(null);

  const [statForm, setStatForm] =
    useState<StatForm>({
      ...emptyStat,
    });

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  function clearMessages() {
    setSuccess("");
    setError("");
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingStat(null);

    setStatForm({
      ...emptyStat,
    });
  }

  function openNewStat() {
    clearMessages();
    setDeletingStat(null);
    setEditingStat(null);

    setStatForm({
      ...emptyStat,
    });

    setEditorOpen(true);
  }

  function openEditStat(stat: Stat) {
    clearMessages();
    setDeletingStat(null);
    setEditingStat(stat);

    setStatForm({
      value: String(stat.value),
      suffix: stat.suffix ?? "",
      title: stat.title,
      description:
        stat.description ?? "",
      isActive: stat.is_active,
    });

    setEditorOpen(true);
  }

  function saveSection() {
    clearMessages();

    startTransition(async () => {
      try {
        await updateAtAGlanceSettings(
          settings.id,
          {
            eyebrow,
            description,
            isActive: sectionActive,
          }
        );

        setSuccess(
          "At a Glance section updated successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update section."
        );
      }
    });
  }

  function getValue() {
    const value = Number(statForm.value);

    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      throw new Error(
        "Enter a valid statistic value."
      );
    }

    return value;
  }

  function createStat() {
    clearMessages();

    if (!statForm.title.trim()) {
      setError(
        "Statistic title is required."
      );

      return;
    }

    let value: number;

    try {
      value = getValue();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid statistic value."
      );

      return;
    }

    startTransition(async () => {
      try {
        const result =
          await createAtAGlanceStat({
            sectionId: settings.id,
            value,
            suffix: statForm.suffix,
            title: statForm.title,
            description:
              statForm.description,
            sortOrder:
              statItems.length + 1,
            isActive:
              statForm.isActive,
          });

        setStatItems((current) => [
          ...current,
          result.stat as Stat,
        ]);

        closeEditor();

        setSuccess(
          "Statistic added successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to add statistic."
        );
      }
    });
  }

  function updateStat() {
    if (!editingStat) return;

    clearMessages();

    if (!statForm.title.trim()) {
      setError(
        "Statistic title is required."
      );

      return;
    }

    let value: number;

    try {
      value = getValue();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid statistic value."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateAtAGlanceStat(
          editingStat.id,
          {
            sectionId: settings.id,
            value,
            suffix: statForm.suffix,
            title: statForm.title,
            description:
              statForm.description,
            sortOrder:
              editingStat.sort_order,
            isActive:
              statForm.isActive,
          }
        );

        setStatItems((current) =>
          current.map((stat) =>
            stat.id === editingStat.id
              ? {
                  ...stat,
                  value,
                  suffix:
                    statForm.suffix.trim() ||
                    null,
                  title:
                    statForm.title.trim(),
                  description:
                    statForm.description.trim() ||
                    null,
                  is_active:
                    statForm.isActive,
                }
              : stat
          )
        );

        closeEditor();

        setSuccess(
          "Statistic updated successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update statistic."
        );
      }
    });
  }

  function toggleStat(stat: Stat) {
    clearMessages();

    const nextValue =
      !stat.is_active;

    startTransition(async () => {
      try {
        await toggleAtAGlanceStat(
          stat.id,
          nextValue
        );

        setStatItems((current) =>
          current.map((item) =>
            item.id === stat.id
              ? {
                  ...item,
                  is_active: nextValue,
                }
              : item
          )
        );

        setSuccess(
          nextValue
            ? "Statistic is now visible."
            : "Statistic is now hidden."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to change visibility."
        );
      }
    });
  }

  function removeStat(stat: Stat) {
    clearMessages();

    startTransition(async () => {
      try {
        await deleteAtAGlanceStat(
          stat.id
        );

        const remaining =
          statItems.filter(
            (item) =>
              item.id !== stat.id
          );

        const normalized =
          remaining.map(
            (item, index) => ({
              ...item,
              sort_order: index + 1,
            })
          );

        if (normalized.length) {
          await reorderAtAGlanceStats(
            normalized.map(
              (item) => item.id
            )
          );
        }

        setStatItems(normalized);
        setDeletingStat(null);

        setSuccess(
          "Statistic deleted successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete statistic."
        );
      }
    });
  }

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
      target >= statItems.length
    ) {
      return;
    }

    clearMessages();

    const previous = [
      ...statItems,
    ];

    const reordered = [
      ...statItems,
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
          sort_order: itemIndex + 1,
        })
      );

    setStatItems(normalized);

    startTransition(async () => {
      try {
        await reorderAtAGlanceStats(
          normalized.map(
            (item) => item.id
          )
        );

        setSuccess(
          "Statistic order updated."
        );
      } catch (err) {
        setStatItems(previous);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to reorder statistics."
        );
      }
    });
  }

  return (
    <div className="space-y-8">
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

      {/* SECTION SETTINGS */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Section Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the heading and introduction
              shown above the statistics.
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

        <div className="space-y-6">
          <Field
            label="Eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
          />

          <TextArea
            label="Description"
            value={description}
            onChange={setDescription}
          />
        </div>

        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            type="button"
            disabled={isPending}
            onClick={saveSection}
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-60"
          >
            {isPending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            Save Section
          </button>
        </div>
      </section>

      {/* STAT EDITOR */}

      {editorOpen && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingStat
                  ? "Edit Statistic"
                  : "Add Statistic"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure the number and supporting
                information displayed publicly.
              </p>
            </div>

            <button
              type="button"
              onClick={closeEditor}
              className="rounded-lg border border-gray-200 p-2 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Value"
              value={statForm.value}
              onChange={(value) =>
                setStatForm(
                  (current) => ({
                    ...current,
                    value,
                  })
                )
              }
              type="number"
            />

            <Field
              label="Suffix"
              value={statForm.suffix}
              onChange={(suffix) =>
                setStatForm(
                  (current) => ({
                    ...current,
                    suffix,
                  })
                )
              }
              placeholder="+"
            />

            <div className="sm:col-span-2">
              <Field
                label="Title"
                value={statForm.title}
                onChange={(title) =>
                  setStatForm(
                    (current) => ({
                      ...current,
                      title,
                    })
                  )
                }
              />
            </div>

            <div className="sm:col-span-2">
              <TextArea
                label="Description"
                value={
                  statForm.description
                }
                onChange={(description) =>
                  setStatForm(
                    (current) => ({
                      ...current,
                      description,
                    })
                  )
                }
              />
            </div>
          </div>

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
            className={`mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
              statForm.isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
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

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={
                editingStat
                  ? updateStat
                  : createStat
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isPending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {editingStat
                ? "Save Statistic"
                : "Add Statistic"}
            </button>
          </div>
        </section>
      )}

      {/* STATISTICS */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Statistics
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {statItems.length} statistic(s)
            </p>
          </div>

          <button
            type="button"
            onClick={openNewStat}
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add Statistic
          </button>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">
          {statItems.map(
            (stat, index) => (
              <article
                key={stat.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-3xl font-semibold text-[#073f30]">
                    {stat.value}
                    {stat.suffix}
                  </p>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      stat.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {stat.is_active
                      ? "Visible"
                      : "Hidden"}
                  </span>
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  {stat.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {stat.description}
                </p>

                <p className="mt-4 text-xs text-gray-400">
                  Position {index + 1}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <IconButton
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
                  >
                    <ChevronUp
                      size={15}
                    />
                  </IconButton>

                  <IconButton
                    disabled={
                      index ===
                        statItems.length -
                          1 ||
                      isPending
                    }
                    onClick={() =>
                      moveStat(
                        index,
                        "down"
                      )
                    }
                  >
                    <ChevronDown
                      size={15}
                    />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      toggleStat(stat)
                    }
                  >
                    {stat.is_active ? (
                      <Eye size={15} />
                    ) : (
                      <EyeOff
                        size={15}
                      />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      openEditStat(
                        stat
                      )
                    }
                  >
                    <Pencil size={15} />
                  </IconButton>

                  <button
                    type="button"
                    onClick={() =>
                      setDeletingStat(
                        stat
                      )
                    }
                    className="rounded-lg border border-red-200 p-2 text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      </section>

      {/* DELETE CONFIRMATION */}

      {deletingStat && (
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">
            Delete statistic?
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            <strong>
              {deletingStat.value}
              {deletingStat.suffix}{" "}
              {deletingStat.title}
            </strong>{" "}
            will be permanently removed.
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() =>
                setDeletingStat(null)
              }
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                removeStat(
                  deletingStat
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Trash2 size={16} />
              Delete Statistic
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        min={
          type === "number"
            ? 0
            : undefined
        }
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
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
        rows={4}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}