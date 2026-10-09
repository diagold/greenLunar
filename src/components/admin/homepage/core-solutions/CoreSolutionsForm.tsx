"use client";

import { useState, useTransition } from "react";

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
  createCoreSolutionItem,
  deleteCoreSolutionItem,
  reorderCoreSolutionItems,
  toggleCoreSolutionItem,
  updateCoreSolutionItem,
  updateCoreSolutionsSettings,
} from "@/app/admin/(dashboard)/homepage/core-solutions/actions";

import CoreSolutionImageUpload from "./CoreSolutionImageUpload";

/* =========================================================
   TYPES
========================================================= */

type Settings = {
  id: string;
  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;
  is_active: boolean;
};

type CoreSolutionItem = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  settings: Settings;
  items: CoreSolutionItem[];
};

type ItemFormData = {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkLabel: string;
  isActive: boolean;
};

const emptyItemForm: ItemFormData = {
  title: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  linkLabel: "Learn More",
  isActive: true,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CoreSolutionsForm({
  settings,
  items,
}: Props) {
  /* =======================================================
     SECTION SETTINGS
  ======================================================= */

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

  const [sectionActive, setSectionActive] = useState(
    settings.is_active
  );

  /* =======================================================
     CORE SOLUTION ITEMS
  ======================================================= */

  const [displayItems, setDisplayItems] = useState<
    CoreSolutionItem[]
  >(
    [...items].sort(
      (a, b) => a.sort_order - b.sort_order
    )
  );

  const [editingItemId, setEditingItemId] = useState<
    string | null
  >(null);

  const [showNewItemForm, setShowNewItemForm] =
    useState(false);

  const [itemForm, setItemForm] =
    useState<ItemFormData>(emptyItemForm);

  /* =======================================================
     MESSAGES / TRANSITION
  ======================================================= */

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isPending, startTransition] =
    useTransition();

  /* =======================================================
     HELPERS
  ======================================================= */

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  function resetItemEditor() {
    setEditingItemId(null);
    setShowNewItemForm(false);

    setItemForm({
      ...emptyItemForm,
    });
  }

  /* =======================================================
     OPEN CREATE EDITOR
  ======================================================= */

  function handleOpenNewItem() {
    clearMessages();

    setEditingItemId(null);

    setItemForm({
      ...emptyItemForm,
    });

    setShowNewItemForm(true);
  }

  /* =======================================================
     OPEN EDITOR
  ======================================================= */

  function handleEditItem(item: CoreSolutionItem) {
    clearMessages();

    setShowNewItemForm(false);
    setEditingItemId(item.id);

    setItemForm({
      title: item.title,
      description: item.description ?? "",
      imageUrl: item.image_url ?? "",
      linkUrl: item.link_url ?? "",
      linkLabel: item.link_label ?? "Learn More",
      isActive: item.is_active,
    });
  }

  /* =======================================================
     SAVE SECTION SETTINGS
  ======================================================= */

  function handleSaveSection() {
    clearMessages();

    startTransition(async () => {
      try {
        await updateCoreSolutionsSettings(
          settings.id,
          {
            eyebrow,
            heading,
            highlight,
            description,
            isActive: sectionActive,
          }
        );

        setSuccessMessage(
          "Core Solutions section settings updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update Core Solutions."
        );
      }
    });
  }

  /* =======================================================
     CREATE ITEM
  ======================================================= */

  function handleCreateItem() {
    clearMessages();

    if (!itemForm.title.trim()) {
      setErrorMessage(
        "Core Solution title is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        const result =
          await createCoreSolutionItem({
            sectionId: settings.id,
            title: itemForm.title.trim(),
            description:
              itemForm.description.trim(),
            imageUrl: itemForm.imageUrl.trim(),
            linkUrl: itemForm.linkUrl.trim(),
            linkLabel:
              itemForm.linkLabel.trim() ||
              "Learn More",
            sortOrder: displayItems.length + 1,
            isActive: itemForm.isActive,
          });

        if (result.item) {
          setDisplayItems((current) => [
            ...current,
            result.item as CoreSolutionItem,
          ]);
        }

        resetItemEditor();

        setSuccessMessage(
          "Core Solution added successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to create Core Solution."
        );
      }
    });
  }

  /* =======================================================
     UPDATE ITEM
  ======================================================= */

  function handleUpdateItem(item: CoreSolutionItem) {
    clearMessages();

    if (!itemForm.title.trim()) {
      setErrorMessage(
        "Core Solution title is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateCoreSolutionItem(item.id, {
          sectionId: settings.id,
          title: itemForm.title.trim(),
          description:
            itemForm.description.trim(),
          imageUrl: itemForm.imageUrl.trim(),
          linkUrl: itemForm.linkUrl.trim(),
          linkLabel:
            itemForm.linkLabel.trim() ||
            "Learn More",
          sortOrder: item.sort_order,
          isActive: itemForm.isActive,
        });

        setDisplayItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id
              ? {
                  ...currentItem,
                  title: itemForm.title.trim(),
                  description:
                    itemForm.description.trim() ||
                    null,
                  image_url:
                    itemForm.imageUrl.trim() ||
                    null,
                  link_url:
                    itemForm.linkUrl.trim() ||
                    null,
                  link_label:
                    itemForm.linkLabel.trim() ||
                    "Learn More",
                  is_active: itemForm.isActive,
                }
              : currentItem
          )
        );

        resetItemEditor();

        setSuccessMessage(
          "Core Solution updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update Core Solution."
        );
      }
    });
  }

  /* =======================================================
     TOGGLE ITEM
  ======================================================= */

  function handleToggleItem(item: CoreSolutionItem) {
    clearMessages();

    const nextValue = !item.is_active;

    startTransition(async () => {
      try {
        await toggleCoreSolutionItem(
          item.id,
          nextValue
        );

        setDisplayItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id
              ? {
                  ...currentItem,
                  is_active: nextValue,
                }
              : currentItem
          )
        );

        setSuccessMessage(
          nextValue
            ? `${item.title} is now visible.`
            : `${item.title} is now hidden.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update visibility."
        );
      }
    });
  }

  /* =======================================================
     DELETE ITEM
  ======================================================= */

  function handleDeleteItem(item: CoreSolutionItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}" from the homepage Core Solutions section? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    startTransition(async () => {
      try {
        await deleteCoreSolutionItem(item.id);

        const remainingItems =
          displayItems.filter(
            (currentItem) =>
              currentItem.id !== item.id
          );

        const reordered =
          remainingItems.map(
            (currentItem, index) => ({
              ...currentItem,
              sort_order: index + 1,
            })
          );

        setDisplayItems(reordered);

        if (reordered.length > 0) {
          await reorderCoreSolutionItems(
            reordered.map(
              (currentItem) =>
                currentItem.id
            )
          );
        }

        if (editingItemId === item.id) {
          resetItemEditor();
        }

        setSuccessMessage(
          "Core Solution deleted successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete Core Solution."
        );
      }
    });
  }

  /* =======================================================
     REORDER ITEM
  ======================================================= */

  function handleMoveItem(
    index: number,
    direction: "up" | "down"
  ) {
    clearMessages();

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= displayItems.length
    ) {
      return;
    }

    const previousItems = [...displayItems];

    const reordered = [...displayItems];

    [
      reordered[index],
      reordered[targetIndex],
    ] = [
      reordered[targetIndex],
      reordered[index],
    ];

    const normalized = reordered.map(
      (item, itemIndex) => ({
        ...item,
        sort_order: itemIndex + 1,
      })
    );

    setDisplayItems(normalized);

    startTransition(async () => {
      try {
        await reorderCoreSolutionItems(
          normalized.map((item) => item.id)
        );

        setSuccessMessage(
          "Core Solution order updated."
        );
      } catch (error) {
        setDisplayItems(previousItems);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to reorder Core Solutions."
        );
      }
    });
  }

  /* =======================================================
     ITEM EDITOR
  ======================================================= */

  function renderItemEditor(
    mode: "create" | "edit",
    item?: CoreSolutionItem
  ) {
    return (
      <div className="border-t border-gray-100 bg-gray-50/70 p-5 sm:p-6 lg:px-8">
        {/* EDITOR HEADER */}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {mode === "create"
                ? "Add Core Solution"
                : `Edit ${item?.title}`}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage the content and image displayed on
              this homepage card.
            </p>
          </div>

          <button
            type="button"
            onClick={resetItemEditor}
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              p-2
              text-gray-500
              transition
              hover:bg-gray-50
              hover:text-gray-900
            "
            aria-label="Close editor"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6">

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              value={itemForm.title}
              onChange={(event) =>
                setItemForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Technology"
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={itemForm.description}
              onChange={(event) =>
                setItemForm((current) => ({
                  ...current,
                  description:
                    event.target.value,
                }))
              }
              rows={4}
              placeholder="Describe this Core Solution..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                transition
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          {/* =================================================
              IMAGE
          ================================================== */}

          <div>
            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-700">
                Card Image
              </h4>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Upload an image directly from your
                computer or paste a Cloudinary /
                external image URL.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

              {/* =============================================
                  UPLOAD IMAGE
              ============================================== */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload Image
                </label>

                <CoreSolutionImageUpload
                  value={itemForm.imageUrl}
                  onChange={(url) =>
                    setItemForm(
                      (current) => ({
                        ...current,
                        imageUrl: url,
                      })
                    )
                  }
                />
              </div>

              {/* =============================================
                  CLOUDINARY / EXTERNAL URL
              ============================================== */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cloudinary / External Image URL
                </label>

                <input
                  type="url"
                  value={itemForm.imageUrl}
                  onChange={(event) =>
                    setItemForm(
                      (current) => ({
                        ...current,
                        imageUrl:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="https://res.cloudinary.com/..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Paste a Cloudinary URL or another
                  publicly accessible image URL. This
                  will be used instead of an uploaded
                  image.
                </p>

                {/* CURRENT URL */}

                {itemForm.imageUrl && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Current Image URL
                    </p>

                    <div className="break-all rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500">
                      {itemForm.imageUrl}
                    </div>
                  </div>
                )}

                {/* URL PREVIEW */}

                {/* {itemForm.imageUrl && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Image Preview
                    </p>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      <img
                        src={itemForm.imageUrl}
                        alt={
                          itemForm.title ||
                          "Core Solution preview"
                        }
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          {/* =================================================
              LINK SETTINGS
          ================================================== */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* DESTINATION */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Destination Link
              </label>

              <input
                value={itemForm.linkUrl}
                onChange={(event) =>
                  setItemForm(
                    (current) => ({
                      ...current,
                      linkUrl:
                        event.target.value,
                    })
                  )
                }
                placeholder="/services/technology"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />

              <p className="mt-2 text-xs text-gray-400">
                Example: /services/technology
              </p>
            </div>

            {/* LABEL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Link Label
              </label>

              <input
                value={itemForm.linkLabel}
                onChange={(event) =>
                  setItemForm(
                    (current) => ({
                      ...current,
                      linkLabel:
                        event.target.value,
                    })
                  )
                }
                placeholder="Learn More"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />
            </div>
          </div>

          {/* =================================================
              VISIBILITY
          ================================================== */}

          <div>
            <p className="mb-2 block text-sm font-medium text-gray-700">
              Visibility
            </p>

            <button
              type="button"
              onClick={() =>
                setItemForm(
                  (current) => ({
                    ...current,
                    isActive:
                      !current.isActive,
                  })
                )
              }
              className={`
                inline-flex
                items-center
                gap-2
                rounded-lg
                px-4
                py-2.5
                text-sm
                font-medium
                transition

                ${
                  itemForm.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }
              `}
            >
              {itemForm.isActive ? (
                <Eye size={17} />
              ) : (
                <EyeOff size={17} />
              )}

              {itemForm.isActive
                ? "Visible"
                : "Hidden"}
            </button>
          </div>

          {/* =================================================
              EDITOR ACTIONS
          ================================================== */}

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={resetItemEditor}
              disabled={isPending}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (mode === "create") {
                  handleCreateItem();
                } else if (item) {
                  handleUpdateItem(item);
                }
              }}
              className="
                inline-flex
                min-w-[150px]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#073f30]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0a503d]
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

                  {mode === "create"
                    ? "Add Solution"
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

      {/* =====================================================
          STATUS MESSAGES
      ====================================================== */}

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
              Manage the introductory content displayed
              above the Core Solutions cards.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSectionActive(
                (value) => !value
              )
            }
            className={`
              inline-flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition

              ${
                sectionActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }
            `}
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

          {/* EYEBROW */}

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
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
              placeholder="OUR CORE SOLUTIONS"
            />
          </div>

          {/* HEADING */}

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
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
                placeholder="Technology designed to"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Highlighted Text
              </label>

              <input
                value={highlight}
                onChange={(event) =>
                  setHighlight(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
                placeholder="move businesses forward."
              />
            </div>
          </div>

          {/* DESCRIPTION */}

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
              rows={5}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                transition
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          {/* SAVE SECTION */}

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleSaveSection}
              disabled={isPending}
              className="
                inline-flex
                min-w-[170px]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#073f30]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0a503d]
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

                  Save Section
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE SOLUTION CARDS
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Core Solution Cards
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Manage the cards displayed in the homepage
              Core Solutions section. These cards are
              independent from the Services CMS.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNewItem}
            disabled={
              isPending ||
              showNewItemForm
            }
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#073f30]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#0a503d]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Plus size={17} />

            Add Core Solution check
          </button>
        </div>

        {/* NEW ITEM EDITOR */}

        {showNewItemForm &&
          renderItemEditor("create")}

        {/* ITEMS */}

        <div className="divide-y divide-gray-100">
          {displayItems.map(
            (item, index) => (
              <div key={item.id}>

                {/* CARD ROW */}

                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center lg:px-8">

                  {/* IMAGE */}

                  <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-28">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* INFORMATION */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-medium

                          ${
                            item.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        {item.is_active
                          ? "Visible"
                          : "Hidden"}
                      </span>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                        Position {index + 1}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                        {item.description}
                      </p>
                    )}

                    {item.link_url && (
                      <p className="mt-2 truncate text-xs text-gray-400">
                        Link: {item.link_url}
                      </p>
                    )}
                  </div>

                  {/* CONTROLS */}

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleMoveItem(
                          index,
                          "up"
                        )
                      }
                      disabled={
                        index === 0 ||
                        isPending
                      }
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Move ${item.title} up`}
                    >
                      <ChevronUp size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleMoveItem(
                          index,
                          "down"
                        )
                      }
                      disabled={
                        index ===
                          displayItems.length -
                            1 ||
                        isPending
                      }
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Move ${item.title} down`}
                    >
                      <ChevronDown size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleItem(item)
                      }
                      disabled={isPending}
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-medium
                        transition
                        disabled:opacity-50

                        ${
                          item.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      {item.is_active ? (
                        <Eye size={15} />
                      ) : (
                        <EyeOff size={15} />
                      )}

                      {item.is_active
                        ? "Visible"
                        : "Hidden"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEditItem(item)
                      }
                      disabled={isPending}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-gray-600
                        transition
                        hover:bg-gray-50
                        hover:text-gray-900
                        disabled:opacity-50
                      "
                    >
                      <Pencil size={15} />

                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteItem(item)
                      }
                      disabled={isPending}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-red-200
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:opacity-50
                      "
                    >
                      <Trash2 size={15} />

                      Delete
                    </button>
                  </div>
                </div>

                {/* EDIT ITEM */}

                {editingItemId ===
                  item.id &&
                  renderItemEditor(
                    "edit",
                    item
                  )}
              </div>
            )
          )}

          {/* EMPTY STATE */}

          {displayItems.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-medium text-gray-700">
                No Core Solutions have
                been added.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first card to
                display it on the
                homepage.
              </p>

              <button
                type="button"
                onClick={handleOpenNewItem}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#073f30]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#0a503d]
                "
              >
                <Plus size={17} />

                Add Core Solution
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}