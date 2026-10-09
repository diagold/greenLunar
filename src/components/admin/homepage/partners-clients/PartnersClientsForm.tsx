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

import PartnerClientLogoUpload from "./PartnerClientLogoUpload";

import {
  createPartnerClientItem,
  deletePartnerClientItem,
  reorderPartnerClientItems,
  togglePartnerClientItem,
  updatePartnerClientItem,
  updatePartnersClientsSettings,
} from "@/app/admin/(dashboard)/homepage/partners-clients/actions";

type Settings = {
  id: string;

  eyebrow: string | null;
  heading: string;
  description: string | null;

  partners_eyebrow: string | null;
  partners_heading: string | null;
  partners_description: string | null;

  clients_eyebrow: string | null;
  clients_heading: string | null;
  clients_description: string | null;

  is_active: boolean;
};

type Item = {
  id: string;
  section_id: string;
  item_type: "partner" | "client";
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type Props = {
  settings: Settings;
  partners: Item[];
  clients: Item[];
};

type ItemForm = {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
};

const emptyItem: ItemForm = {
  name: "",
  logoUrl: "",
  websiteUrl: "",
  isActive: true,
};

export default function PartnersClientsForm({
  settings,
  partners,
  clients,
}: Props) {
  const [eyebrow, setEyebrow] =
    useState(settings.eyebrow ?? "");

  const [heading, setHeading] =
    useState(settings.heading ?? "");

  const [description, setDescription] =
    useState(settings.description ?? "");

  const [
    partnersEyebrow,
    setPartnersEyebrow,
  ] = useState(
    settings.partners_eyebrow ?? ""
  );

  const [
    partnersHeading,
    setPartnersHeading,
  ] = useState(
    settings.partners_heading ?? ""
  );

  const [
    partnersDescription,
    setPartnersDescription,
  ] = useState(
    settings.partners_description ?? ""
  );

  const [
    clientsEyebrow,
    setClientsEyebrow,
  ] = useState(
    settings.clients_eyebrow ?? ""
  );

  const [
    clientsHeading,
    setClientsHeading,
  ] = useState(
    settings.clients_heading ?? ""
  );

  const [
    clientsDescription,
    setClientsDescription,
  ] = useState(
    settings.clients_description ?? ""
  );

  const [
    sectionActive,
    setSectionActive,
  ] = useState(settings.is_active);

  const [
    partnerItems,
    setPartnerItems,
  ] = useState<Item[]>(
    [...partners].sort(
      (a, b) =>
        a.sort_order - b.sort_order
    )
  );

  const [
    clientItems,
    setClientItems,
  ] = useState<Item[]>(
    [...clients].sort(
      (a, b) =>
        a.sort_order - b.sort_order
    )
  );

  const [
    editorType,
    setEditorType,
  ] = useState<
    "partner" | "client" | null
  >(null);

  const [
    editingItem,
    setEditingItem,
  ] = useState<Item | null>(null);

  const [
    deletingItem,
    setDeletingItem,
  ] = useState<Item | null>(null);

  const [itemForm, setItemForm] =
    useState<ItemForm>({
      ...emptyItem,
    });

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  function closeEditor() {
    setEditorType(null);
    setEditingItem(null);

    setItemForm({
      ...emptyItem,
    });
  }

  function openNew(
    type: "partner" | "client"
  ) {
    clearMessages();

    setDeletingItem(null);
    setEditingItem(null);
    setEditorType(type);

    setItemForm({
      ...emptyItem,
    });
  }

  function openEdit(item: Item) {
    clearMessages();

    setDeletingItem(null);
    setEditorType(item.item_type);
    setEditingItem(item);

    setItemForm({
      name: item.name,
      logoUrl: item.logo_url,
      websiteUrl:
        item.website_url ?? "",
      isActive: item.is_active,
    });
  }

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
        await updatePartnersClientsSettings(
          settings.id,
          {
            eyebrow,
            heading,
            description,

            partnersEyebrow,
            partnersHeading,
            partnersDescription,

            clientsEyebrow,
            clientsHeading,
            clientsDescription,

            isActive:
              sectionActive,
          }
        );

        setSuccessMessage(
          "Partners & Clients section updated successfully."
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

  function createItem() {
    if (!editorType) return;

    clearMessages();

    if (!itemForm.name.trim()) {
      setErrorMessage(
        "Name is required."
      );
      return;
    }

    if (!itemForm.logoUrl.trim()) {
      setErrorMessage(
        "Please upload a logo or enter a logo URL."
      );
      return;
    }

    const list =
      editorType === "partner"
        ? partnerItems
        : clientItems;

    startTransition(async () => {
      try {
        const result =
          await createPartnerClientItem({
            sectionId:
              settings.id,

            itemType:
              editorType,

            name:
              itemForm.name,

            logoUrl:
              itemForm.logoUrl,

            websiteUrl:
              itemForm.websiteUrl,

            sortOrder:
              list.length + 1,

            isActive:
              itemForm.isActive,
          });

        const item =
          result.item as Item;

        if (
          editorType === "partner"
        ) {
          setPartnerItems(
            (current) => [
              ...current,
              item,
            ]
          );
        } else {
          setClientItems(
            (current) => [
              ...current,
              item,
            ]
          );
        }

        const name =
          itemForm.name.trim();

        closeEditor();

        setSuccessMessage(
          `"${name}" was added successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to add item."
        );
      }
    });
  }

  function updateItem() {
    if (!editingItem) return;

    clearMessages();

    if (!itemForm.name.trim()) {
      setErrorMessage(
        "Name is required."
      );
      return;
    }

    if (!itemForm.logoUrl.trim()) {
      setErrorMessage(
        "Logo is required."
      );
      return;
    }

    startTransition(async () => {
      try {
        await updatePartnerClientItem(
          editingItem.id,
          {
            sectionId:
              settings.id,

            itemType:
              editingItem.item_type,

            name:
              itemForm.name,

            logoUrl:
              itemForm.logoUrl,

            websiteUrl:
              itemForm.websiteUrl,

            sortOrder:
              editingItem.sort_order,

            isActive:
              itemForm.isActive,
          }
        );

        const updated: Item = {
          ...editingItem,

          name:
            itemForm.name.trim(),

          logo_url:
            itemForm.logoUrl.trim(),

          website_url:
            itemForm.websiteUrl.trim() ||
            null,

          is_active:
            itemForm.isActive,
        };

        if (
          editingItem.item_type ===
          "partner"
        ) {
          setPartnerItems(
            (current) =>
              current.map((item) =>
                item.id ===
                editingItem.id
                  ? updated
                  : item
              )
          );
        } else {
          setClientItems(
            (current) =>
              current.map((item) =>
                item.id ===
                editingItem.id
                  ? updated
                  : item
              )
          );
        }

        const name =
          updated.name;

        closeEditor();

        setSuccessMessage(
          `"${name}" was updated successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update item."
        );
      }
    });
  }

  function toggleItem(item: Item) {
    clearMessages();

    const nextValue =
      !item.is_active;

    startTransition(async () => {
      try {
        await togglePartnerClientItem(
          item.id,
          nextValue
        );

        const updateList = (
          current: Item[]
        ) =>
          current.map((record) =>
            record.id === item.id
              ? {
                  ...record,
                  is_active:
                    nextValue,
                }
              : record
          );

        if (
          item.item_type ===
          "partner"
        ) {
          setPartnerItems(updateList);
        } else {
          setClientItems(updateList);
        }

        setSuccessMessage(
          nextValue
            ? `"${item.name}" is now visible.`
            : `"${item.name}" is now hidden.`
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

  function confirmDelete(item: Item) {
    clearMessages();
    setDeletingItem(item);
  }

  function removeItem(item: Item) {
    clearMessages();

    startTransition(async () => {
      try {
        await deletePartnerClientItem(
          item.id
        );

        const currentList =
          item.item_type === "partner"
            ? partnerItems
            : clientItems;

        const remaining =
          currentList.filter(
            (record) =>
              record.id !== item.id
          );

        const normalized =
          remaining.map(
            (record, index) => ({
              ...record,
              sort_order:
                index + 1,
            })
          );

        if (
          normalized.length > 0
        ) {
          await reorderPartnerClientItems(
            normalized.map(
              (record) =>
                record.id
            )
          );
        }

        if (
          item.item_type ===
          "partner"
        ) {
          setPartnerItems(normalized);
        } else {
          setClientItems(normalized);
        }

        if (
          editingItem?.id === item.id
        ) {
          closeEditor();
        }

        setDeletingItem(null);

        setSuccessMessage(
          `"${item.name}" was deleted successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete item."
        );
      }
    });
  }

  function moveItem(
    type: "partner" | "client",
    index: number,
    direction: "up" | "down"
  ) {
    const list =
      type === "partner"
        ? partnerItems
        : clientItems;

    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >= list.length
    ) {
      return;
    }

    clearMessages();

    const previous = [...list];
    const reordered = [...list];

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

    if (type === "partner") {
      setPartnerItems(normalized);
    } else {
      setClientItems(normalized);
    }

    startTransition(async () => {
      try {
        await reorderPartnerClientItems(
          normalized.map(
            (item) => item.id
          )
        );

        setSuccessMessage(
          `${type === "partner" ? "Partner" : "Client"} order updated successfully.`
        );
      } catch (error) {
        if (type === "partner") {
          setPartnerItems(previous);
        } else {
          setClientItems(previous);
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to reorder items."
        );
      }
    });
  }

  function renderEditor() {
    if (!editorType) return null;

    const title =
      editingItem
        ? `Edit ${editingItem.name}`
        : `Add ${
            editorType === "partner"
              ? "Partner"
              : "Client"
          }`;

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Configure the organisation
              and its logo.
            </p>
          </div>

          <button
            type="button"
            onClick={closeEditor}
            disabled={isPending}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                value={itemForm.name}
                onChange={(event) =>
                  setItemForm(
                    (current) => ({
                      ...current,
                      name:
                        event.target.value,
                    })
                  )
                }
                placeholder="Organisation name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Website URL
              </label>

              <input
                value={
                  itemForm.websiteUrl
                }
                onChange={(event) =>
                  setItemForm(
                    (current) => ({
                      ...current,
                      websiteUrl:
                        event.target.value,
                    })
                  )
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Optional. This will allow
                us to make the logo
                clickable on the public
                website.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Logo URL
              </label>

              <input
                value={itemForm.logoUrl}
                onChange={(event) =>
                  setItemForm(
                    (current) => ({
                      ...current,
                      logoUrl:
                        event.target.value,
                    })
                  )
                }
                placeholder="https://... or /images/..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

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
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                itemForm.isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
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

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Logo
            </p>

            <PartnerClientLogoUpload
              value={itemForm.logoUrl}
              onChange={(url) =>
                setItemForm(
                  (current) => ({
                    ...current,
                    logoUrl: url,
                  })
                )
              }
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={closeEditor}
            disabled={isPending}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              editingItem
                ? updateItem
                : createItem
            }
            disabled={isPending}
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
                {editingItem
                  ? "Save Changes"
                  : "Add Item"}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  function renderItems(
    type: "partner" | "client",
    items: Item[]
  ) {
    return (
      <div className="divide-y divide-gray-100">
        {items.map(
          (item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-2">
                <img
                  src={item.logo_url}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.is_active
                      ? "Visible"
                      : "Hidden"}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                    Position {index + 1}
                  </span>
                </div>

                {item.website_url && (
                  <p className="mt-1 truncate text-xs text-gray-400">
                    {item.website_url}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={
                    index === 0 ||
                    isPending
                  }
                  onClick={() =>
                    moveItem(
                      type,
                      index,
                      "up"
                    )
                  }
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronUp
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  disabled={
                    index ===
                      items.length - 1 ||
                    isPending
                  }
                  onClick={() =>
                    moveItem(
                      type,
                      index,
                      "down"
                    )
                  }
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronDown
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleItem(item)
                  }
                  disabled={isPending}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    item.is_active
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.is_active
                    ? "Visible"
                    : "Hidden"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openEdit(item)
                  }
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    confirmDelete(item)
                  }
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          )
        )}

        {items.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">
            No {type}s have been added.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
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

      {deletingItem && (
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Delete {deletingItem.name}?
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  This will permanently
                  remove the{" "}
                  {deletingItem.item_type}{" "}
                  from this homepage
                  section.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingItem(null)
                }
                disabled={isPending}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  removeItem(
                    deletingItem
                  )
                }
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Section Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the main section,
              Partners content and
              Clients content.
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

        <div className="space-y-8">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
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
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          <div className="grid gap-6 border-t border-gray-100 pt-8 lg:grid-cols-2">
            <div className="rounded-xl bg-green-50/60 p-5">
              <h3 className="font-semibold text-gray-900">
                Partners Content
              </h3>

              <div className="mt-5 space-y-4">
                <input
                  value={partnersEyebrow}
                  onChange={(e) =>
                    setPartnersEyebrow(
                      e.target.value
                    )
                  }
                  placeholder="Strategic Network"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />

                <input
                  value={partnersHeading}
                  onChange={(e) =>
                    setPartnersHeading(
                      e.target.value
                    )
                  }
                  placeholder="Our Partners"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />

                <textarea
                  value={
                    partnersDescription
                  }
                  onChange={(e) =>
                    setPartnersDescription(
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900">
                Clients Content
              </h3>

              <div className="mt-5 space-y-4">
                <input
                  value={clientsEyebrow}
                  onChange={(e) =>
                    setClientsEyebrow(
                      e.target.value
                    )
                  }
                  placeholder="Trusted By"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />

                <input
                  value={clientsHeading}
                  onChange={(e) =>
                    setClientsHeading(
                      e.target.value
                    )
                  }
                  placeholder="Our Clients"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />

                <textarea
                  value={
                    clientsDescription
                  }
                  onChange={(e) =>
                    setClientsDescription(
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={saveSection}
              disabled={isPending}
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
        </div>
      </section>

      {renderEditor()}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Partners
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {partnerItems.length} partner
              record(s)
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              openNew("partner")
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add Partner
          </button>
        </div>

        {renderItems(
          "partner",
          partnerItems
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Clients
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {clientItems.length} client
              record(s)
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              openNew("client")
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add Client
          </button>
        </div>

        {renderItems(
          "client",
          clientItems
        )}
      </section>
    </div>
  );
}