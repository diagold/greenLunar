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
  createCoreValue,
  deleteCoreValue,
  reorderCoreValues,
  toggleCoreValue,
  updateCoreValue,
  updatePurposeSettings,
} from "@/app/admin/(dashboard)/about/purpose/actions";


/* =========================================================
   TYPES
========================================================= */

type Settings = {
  id: string;

  eyebrow: string | null;
  heading: string;
  highlight: string | null;

  mission_label: string | null;
  mission_heading: string | null;
  mission_description: string | null;

  vision_label: string | null;
  vision_heading: string | null;
  vision_description: string | null;

  values_label: string | null;
  values_heading: string | null;

  is_active: boolean;
};

type CoreValue = {
  id: string;
  section_id: string;

  number: string | null;
  title: string;

  sort_order: number;
  is_active: boolean;
};

type Props = {
  settings: Settings;
  coreValues: CoreValue[];
};

type ValueForm = {
  number: string;
  title: string;
  isActive: boolean;
};

const emptyValue: ValueForm = {
  number: "",
  title: "",
  isActive: true,
};


/* =========================================================
   COMPONENT
========================================================= */

export default function PurposeForm({
  settings,
  coreValues,
}: Props) {
  const [eyebrow, setEyebrow] =
    useState(settings.eyebrow ?? "");

  const [heading, setHeading] =
    useState(settings.heading ?? "");

  const [highlight, setHighlight] =
    useState(settings.highlight ?? "");

  const [
    missionLabel,
    setMissionLabel,
  ] = useState(
    settings.mission_label ?? ""
  );

  const [
    missionHeading,
    setMissionHeading,
  ] = useState(
    settings.mission_heading ?? ""
  );

  const [
    missionDescription,
    setMissionDescription,
  ] = useState(
    settings.mission_description ?? ""
  );

  const [
    visionLabel,
    setVisionLabel,
  ] = useState(
    settings.vision_label ?? ""
  );

  const [
    visionHeading,
    setVisionHeading,
  ] = useState(
    settings.vision_heading ?? ""
  );

  const [
    visionDescription,
    setVisionDescription,
  ] = useState(
    settings.vision_description ?? ""
  );

  const [
    valuesLabel,
    setValuesLabel,
  ] = useState(
    settings.values_label ?? ""
  );

  const [
    valuesHeading,
    setValuesHeading,
  ] = useState(
    settings.values_heading ?? ""
  );

  const [
    sectionActive,
    setSectionActive,
  ] = useState(
    settings.is_active
  );

  const [
    valueItems,
    setValueItems,
  ] = useState<CoreValue[]>(
    [...coreValues].sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    )
  );

  const [
    editorOpen,
    setEditorOpen,
  ] = useState(false);

  const [
    editingValue,
    setEditingValue,
  ] = useState<CoreValue | null>(
    null
  );

  const [
    deletingValue,
    setDeletingValue,
  ] = useState<CoreValue | null>(
    null
  );

  const [
    valueForm,
    setValueForm,
  ] = useState<ValueForm>({
    ...emptyValue,
  });

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();


  /* =========================================================
     HELPERS
  ========================================================= */

  function clearMessages() {
    setSuccess("");
    setError("");
  }

  function closeEditor() {
    setEditorOpen(false);

    setEditingValue(null);

    setValueForm({
      ...emptyValue,
    });
  }

  function getNextNumber() {
    return String(
      valueItems.length + 1
    ).padStart(2, "0");
  }

  function openNewValue() {
    clearMessages();

    setDeletingValue(null);
    setEditingValue(null);

    setValueForm({
      number: getNextNumber(),
      title: "",
      isActive: true,
    });

    setEditorOpen(true);
  }

  function openEditValue(
    value: CoreValue
  ) {
    clearMessages();

    setDeletingValue(null);
    setEditingValue(value);

    setValueForm({
      number:
        value.number ?? "",

      title:
        value.title,

      isActive:
        value.is_active,
    });

    setEditorOpen(true);
  }


  /* =========================================================
     SAVE PURPOSE
  ========================================================= */

  function savePurpose() {
    clearMessages();

    if (!heading.trim()) {
      setError(
        "Purpose heading is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updatePurposeSettings(
          settings.id,
          {
            eyebrow,
            heading,
            highlight,

            missionLabel,
            missionHeading,
            missionDescription,

            visionLabel,
            visionHeading,
            visionDescription,

            valuesLabel,
            valuesHeading,

            isActive:
              sectionActive,
          }
        );

        setSuccess(
          "Our Purpose updated successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update Our Purpose."
        );
      }
    });
  }


  /* =========================================================
     CREATE VALUE
  ========================================================= */

  function addValue() {
    clearMessages();

    if (!valueForm.title.trim()) {
      setError(
        "Core value title is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        const result =
          await createCoreValue({
            sectionId:
              settings.id,

            number:
              valueForm.number,

            title:
              valueForm.title,

            sortOrder:
              valueItems.length + 1,

            isActive:
              valueForm.isActive,
          });

        setValueItems(
          (current) => [
            ...current,
            result.coreValue as CoreValue,
          ]
        );

        closeEditor();

        setSuccess(
          "Core value added successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to add core value."
        );
      }
    });
  }


  /* =========================================================
     UPDATE VALUE
  ========================================================= */

  function saveValue() {
    if (!editingValue) return;

    clearMessages();

    if (!valueForm.title.trim()) {
      setError(
        "Core value title is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateCoreValue(
          editingValue.id,
          {
            sectionId:
              settings.id,

            number:
              valueForm.number,

            title:
              valueForm.title,

            sortOrder:
              editingValue.sort_order,

            isActive:
              valueForm.isActive,
          }
        );

        setValueItems(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                editingValue.id
                  ? {
                      ...item,

                      number:
                        valueForm.number.trim() ||
                        null,

                      title:
                        valueForm.title.trim(),

                      is_active:
                        valueForm.isActive,
                    }
                  : item
            )
        );

        closeEditor();

        setSuccess(
          "Core value updated successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update core value."
        );
      }
    });
  }


  /* =========================================================
     TOGGLE VALUE
  ========================================================= */

  function toggleValue(
    value: CoreValue
  ) {
    clearMessages();

    const nextValue =
      !value.is_active;

    startTransition(async () => {
      try {
        await toggleCoreValue(
          value.id,
          nextValue
        );

        setValueItems(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                value.id
                  ? {
                      ...item,

                      is_active:
                        nextValue,
                    }
                  : item
            )
        );

        setSuccess(
          nextValue
            ? "Core value is now visible."
            : "Core value is now hidden."
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


  /* =========================================================
     DELETE VALUE
  ========================================================= */

  function removeValue(
    value: CoreValue
  ) {
    clearMessages();

    startTransition(async () => {
      try {
        await deleteCoreValue(
          value.id
        );

        const remaining =
          valueItems.filter(
            (item) =>
              item.id !==
              value.id
          );

        const normalized =
          remaining.map(
            (item, index) => ({
              ...item,

              sort_order:
                index + 1,
            })
          );

        if (
          normalized.length > 0
        ) {
          await reorderCoreValues(
            normalized.map(
              (item) =>
                item.id
            )
          );
        }

        setValueItems(
          normalized
        );

        setDeletingValue(
          null
        );

        setSuccess(
          "Core value deleted successfully."
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete core value."
        );
      }
    });
  }


  /* =========================================================
     REORDER
  ========================================================= */

  function moveValue(
    index: number,
    direction: "up" | "down"
  ) {
    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >=
        valueItems.length
    ) {
      return;
    }

    clearMessages();

    const previous = [
      ...valueItems,
    ];

    const reordered = [
      ...valueItems,
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

    setValueItems(
      normalized
    );

    startTransition(async () => {
      try {
        await reorderCoreValues(
          normalized.map(
            (item) =>
              item.id
          )
        );

        setSuccess(
          "Core value order updated."
        );
      } catch (err) {
        setValueItems(previous);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to reorder core values."
        );
      }
    });
  }


  /* =========================================================
     RENDER
  ========================================================= */

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


      {/* =========================================
          GENERAL
      ========================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">

        <SectionHeader
          title="Purpose Section"
          description="Manage the main heading for the Our Purpose section."
          active={sectionActive}
          onToggle={() =>
            setSectionActive(
              (current) =>
                !current
            )
          }
        />

        <div className="grid gap-6">
          <Field
            label="Eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
          />

          <Field
            label="Heading"
            value={heading}
            onChange={setHeading}
          />

          <Field
            label="Green Highlight"
            value={highlight}
            onChange={setHighlight}
          />
        </div>
      </section>


      {/* =========================================
          MISSION
      ========================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Card 01
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Mission
          </h2>
        </div>

        <div className="space-y-6">
          <Field
            label="Label"
            value={missionLabel}
            onChange={
              setMissionLabel
            }
          />

          <Field
            label="Heading"
            value={missionHeading}
            onChange={
              setMissionHeading
            }
          />

          <TextArea
            label="Description"
            value={
              missionDescription
            }
            onChange={
              setMissionDescription
            }
          />
        </div>
      </section>


      {/* =========================================
          VISION
      ========================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Card 02
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Vision
          </h2>
        </div>

        <div className="space-y-6">
          <Field
            label="Label"
            value={visionLabel}
            onChange={
              setVisionLabel
            }
          />

          <Field
            label="Heading"
            value={visionHeading}
            onChange={
              setVisionHeading
            }
          />

          <TextArea
            label="Description"
            value={
              visionDescription
            }
            onChange={
              setVisionDescription
            }
          />
        </div>
      </section>


      {/* =========================================
          CORE VALUES HEADING
      ========================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Card 03
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            Core Values
          </h2>
        </div>

        <div className="space-y-6">
          <Field
            label="Label"
            value={valuesLabel}
            onChange={
              setValuesLabel
            }
          />

          <Field
            label="Heading"
            value={valuesHeading}
            onChange={
              setValuesHeading
            }
          />
        </div>
      </section>


      {/* =========================================
          SAVE ALL SECTION SETTINGS
      ========================================== */}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={isPending}
          onClick={savePurpose}
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

          Save Purpose Section
        </button>
      </div>


      {/* =========================================
          VALUE EDITOR
      ========================================== */}

      {editorOpen && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">

          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingValue
                  ? "Edit Core Value"
                  : "Add Core Value"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage an item displayed
                inside the Core Values
                card.
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

          <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
            <Field
              label="Number"
              value={
                valueForm.number
              }
              onChange={(number) =>
                setValueForm(
                  (current) => ({
                    ...current,
                    number,
                  })
                )
              }
            />

            <Field
              label="Value"
              value={
                valueForm.title
              }
              onChange={(title) =>
                setValueForm(
                  (current) => ({
                    ...current,
                    title,
                  })
                )
              }
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setValueForm(
                (current) => ({
                  ...current,

                  isActive:
                    !current.isActive,
                })
              )
            }
            className={`mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
              valueForm.isActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {valueForm.isActive ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}

            {valueForm.isActive
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
                editingValue
                  ? saveValue
                  : addValue
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

              {editingValue
                ? "Save Value"
                : "Add Value"}
            </button>
          </div>
        </section>
      )}


      {/* =========================================
          CORE VALUE COLLECTION
      ========================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-gray-100 p-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Core Values
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {valueItems.length} value(s)
            </p>
          </div>

          <button
            type="button"
            onClick={openNewValue}
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} />

            Add Value
          </button>
        </div>


        <div className="divide-y divide-gray-100">
          {valueItems.map(
            (value, index) => (
              <div
                key={value.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-sm font-semibold text-green-700">
                    {value.number ||
                      String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      {value.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Position{" "}
                      {index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`mr-2 rounded-full px-2.5 py-1 text-xs ${
                      value.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {value.is_active
                      ? "Visible"
                      : "Hidden"}
                  </span>

                  <IconButton
                    disabled={
                      index === 0 ||
                      isPending
                    }
                    onClick={() =>
                      moveValue(
                        index,
                        "up"
                      )
                    }
                  >
                    <ChevronUp
                      size={16}
                    />
                  </IconButton>

                  <IconButton
                    disabled={
                      index ===
                        valueItems.length -
                          1 ||
                      isPending
                    }
                    onClick={() =>
                      moveValue(
                        index,
                        "down"
                      )
                    }
                  >
                    <ChevronDown
                      size={16}
                    />
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      toggleValue(
                        value
                      )
                    }
                  >
                    {value.is_active ? (
                      <Eye
                        size={16}
                      />
                    ) : (
                      <EyeOff
                        size={16}
                      />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={() =>
                      openEditValue(
                        value
                      )
                    }
                  >
                    <Pencil
                      size={16}
                    />
                  </IconButton>

                  <button
                    type="button"
                    onClick={() =>
                      setDeletingValue(
                        value
                      )
                    }
                    className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2
                      size={16}
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>


      {/* =========================================
          DELETE CONFIRMATION
      ========================================== */}

      {deletingValue && (
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">
            Delete core value?
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            <strong>
              {deletingValue.title}
            </strong>{" "}
            will be permanently removed
            from the Our Purpose section.
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() =>
                setDeletingValue(
                  null
                )
              }
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                removeValue(
                  deletingValue
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Trash2
                size={16}
              />

              Delete Value
            </button>
          </div>
        </section>
      )}
    </div>
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
  active,
  onToggle,
}: {
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
          active
            ? "bg-green-50 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {active ? (
          <Eye size={17} />
        ) : (
          <EyeOff size={17} />
        )}

        {active
          ? "Section Visible"
          : "Section Hidden"}
      </button>
    </div>
  );
}


/* =========================================================
   ICON BUTTON
========================================================= */

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
      className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}


/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        rows={5}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}