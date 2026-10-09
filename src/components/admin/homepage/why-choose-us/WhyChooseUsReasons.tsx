"use client";

import { useState, useTransition } from "react";
import {
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
  createWhyChooseUsReason,
  deleteWhyChooseUsReason,
  reorderWhyChooseUsReasons,
  toggleWhyChooseUsReason,
  updateWhyChooseUsReason,
} from "@/app/admin/(dashboard)/homepage/why-choose-us/actions";

type Reason = {
  id: string;
  section_id: string;
  number: string | null;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

type Props = {
  sectionId: string;
  reasons: Reason[];
};

export default function WhyChooseUsReasons({
  sectionId,
  reasons,
}: Props) {
  const [items, setItems] = useState(reasons);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  function beginEdit(reason: Reason) {
    setEditingId(reason.id);
    setEditTitle(reason.title);
    setEditDescription(reason.description ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  }

  function handleCreate() {
    if (!newTitle.trim()) return;

    setMessage("");
    setErrorMessage("");

    startTransition(async () => {
      try {
        await createWhyChooseUsReason({
          sectionId,
          title: newTitle,
          description: newDescription,
        });

        setNewTitle("");
        setNewDescription("");
        setShowAddForm(false);

        setMessage("Reason added successfully.");

        window.location.reload();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to create reason."
        );
      }
    });
  }

  function handleUpdate(id: string) {
    setMessage("");
    setErrorMessage("");

    startTransition(async () => {
      try {
        await updateWhyChooseUsReason(id, {
          title: editTitle,
          description: editDescription,
        });

        setItems((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title: editTitle,
                  description: editDescription,
                }
              : item
          )
        );

        cancelEdit();

        setMessage("Reason updated successfully.");
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update reason."
        );
      }
    });
  }

  function handleToggle(reason: Reason) {
    const nextValue = !reason.is_active;

    setMessage("");
    setErrorMessage("");

    startTransition(async () => {
      try {
        await toggleWhyChooseUsReason(reason.id, nextValue);

        setItems((current) =>
          current.map((item) =>
            item.id === reason.id
              ? {
                  ...item,
                  is_active: nextValue,
                }
              : item
          )
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

  function handleDelete(reason: Reason) {
    const confirmed = window.confirm(
      `Delete "${reason.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setMessage("");
    setErrorMessage("");

    startTransition(async () => {
      try {
        await deleteWhyChooseUsReason(reason.id);

        const remaining = items.filter(
          (item) => item.id !== reason.id
        );

        setItems(remaining);

        await reorderWhyChooseUsReasons(
          remaining.map((item, index) => ({
            id: item.id,
            sortOrder: index + 1,
          }))
        );

        setItems(
          remaining.map((item, index) => ({
            ...item,
            number: String(index + 1).padStart(2, "0"),
            sort_order: index + 1,
          }))
        );

        setMessage("Reason deleted successfully.");
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete reason."
        );
      }
    });
  }

  function moveReason(index: number, direction: "up" | "down") {
    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    const reordered = [...items];

    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    const normalized = reordered.map((item, itemIndex) => ({
      ...item,
      sort_order: itemIndex + 1,
      number: String(itemIndex + 1).padStart(2, "0"),
    }));

    setItems(normalized);

    startTransition(async () => {
      try {
        await reorderWhyChooseUsReasons(
          normalized.map((item) => ({
            id: item.id,
            sortOrder: item.sort_order,
          }))
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to reorder reasons."
        );
      }
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Reasons
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add, edit, reorder or hide reasons displayed in the
            Why Choose Us section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a503d]"
        >
          <Plus size={17} />
          Add Reason
        </button>
      </div>

      {(message || errorMessage) && (
        <div className="px-6 pt-5 lg:px-8">
          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {showAddForm && (
        <div className="border-b border-gray-100 bg-gray-50 p-6 lg:px-8">
          <div className="grid gap-4">
            <input
              value={newTitle}
              onChange={(event) =>
                setNewTitle(event.target.value)
              }
              placeholder="Reason title"
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            <textarea
              value={newDescription}
              onChange={(event) =>
                setNewDescription(event.target.value)
              }
              rows={3}
              placeholder="Description"
              className="resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending || !newTitle.trim()}
                onClick={handleCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-[#073f30] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}

                Add Reason
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {items.map((reason, index) => (
          <div key={reason.id} className="p-6 lg:px-8">
            {editingId === reason.id ? (
              <div className="grid gap-4">
                <input
                  value={editTitle}
                  onChange={(event) =>
                    setEditTitle(event.target.value)
                  }
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <textarea
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                  rows={3}
                  className="resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUpdate(reason.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#073f30] px-4 py-2 text-sm font-medium text-white"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-sm font-bold text-green-700">
                  {reason.number}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {reason.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        reason.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {reason.is_active ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  {reason.description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                      {reason.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0 || isPending}
                    onClick={() => moveReason(index, "up")}
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 disabled:opacity-30"
                  >
                    <ChevronUp size={17} />
                  </button>

                  <button
                    type="button"
                    disabled={
                      index === items.length - 1 || isPending
                    }
                    onClick={() => moveReason(index, "down")}
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 disabled:opacity-30"
                  >
                    <ChevronDown size={17} />
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggle(reason)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-500"
                  >
                    {reason.is_active ? (
                      <Eye size={17} />
                    ) : (
                      <EyeOff size={17} />
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => beginEdit(reason)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-500"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(reason)}
                    className="rounded-lg border border-red-100 p-2 text-red-500"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}