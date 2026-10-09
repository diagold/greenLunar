"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Archive,
  ArchiveRestore,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import {
  archiveProduct,
  deleteProduct,
  restoreProduct,
} from "@/app/admin/(dashboard)/products/actions";

import type { ProductStatus } from "@/types/product";

type ProductActionsProps = {
  productId: string;
  productName: string;
  status: ProductStatus;
};

type ActionType = "archive" | "restore" | "delete" | null;

export default function ProductActions({
  productId,
  productName,
  status,
}: ProductActionsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [actionType, setActionType] =
    useState<ActionType>(null);
  const [error, setError] = useState("");

  function openModal(action: ActionType) {
    setError("");
    setActionType(action);
  }

  function closeModal() {
    if (isPending) return;

    setActionType(null);
    setError("");
  }

  function handleConfirm() {
    if (!actionType) return;

    setError("");

    startTransition(async () => {
      try {
        if (actionType === "archive") {
          await archiveProduct(productId);

          setActionType(null);

          router.refresh();

          return;
        }

        if (actionType === "restore") {
          await restoreProduct(productId);

          setActionType(null);

          router.refresh();

          return;
        }

        if (actionType === "delete") {
          await deleteProduct(productId);

          setActionType(null);

          router.push("/admin/products");
          router.refresh();
        }
      } catch (actionError) {
        console.error(
          "Product action error:",
          actionError
        );

        setError(
          actionError instanceof Error
            ? actionError.message
            : "Unable to complete this action."
        );
      }
    });
  }

  const modalTitle =
    actionType === "delete"
      ? "Delete Product"
      : actionType === "archive"
        ? "Archive Product"
        : actionType === "restore"
          ? "Restore Product"
          : "";

  const modalDescription =
    actionType === "delete"
      ? `Are you sure you want to permanently delete "${productName}"? This action cannot be undone.`
      : actionType === "archive"
        ? `Archive "${productName}"? It will be hidden from the public website.`
        : actionType === "restore"
          ? `Restore "${productName}" to draft status?`
          : "";

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Product Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Archive, restore or permanently delete this
            product.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {status !== "archived" ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => openModal("archive")}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border border-amber-200
                bg-amber-50
                px-4 py-2.5
                text-sm
                font-semibold
                text-amber-700
                transition
                hover:bg-amber-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Archive size={17} />

              Archive Product
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => openModal("restore")}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border border-green-200
                bg-green-50
                px-4 py-2.5
                text-sm
                font-semibold
                text-green-700
                transition
                hover:bg-green-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ArchiveRestore size={17} />

              Restore Product
            </button>
          )}

          <button
            type="button"
            disabled={isPending}
            onClick={() => openModal("delete")}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border border-red-200
              bg-red-50
              px-4 py-2.5
              text-sm
              font-semibold
              text-red-700
              transition
              hover:bg-red-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Trash2 size={17} />

            Delete Permanently
          </button>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CONFIRMATION MODAL                                               */}
      {/* ================================================================ */}

      {actionType && (
        <div
          className="
            fixed inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-action-title"
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="product-action-title"
                  className="text-lg font-bold text-gray-900"
                >
                  {modalTitle}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {modalDescription}
                </p>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={closeModal}
                aria-label="Close confirmation"
                className="
                  rounded-lg
                  p-1.5
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  px-4 py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={closeModal}
                className="
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-4 py-2.5
                  text-sm
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirm}
                className={`
                  inline-flex
                  min-w-[120px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-4 py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  ${
                    actionType === "delete"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#073f30] hover:bg-[#09543f]"
                  }
                `}
              >
                {isPending && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {isPending
                  ? actionType === "delete"
                    ? "Deleting..."
                    : actionType === "archive"
                      ? "Archiving..."
                      : "Restoring..."
                  : actionType === "delete"
                    ? "Delete"
                    : actionType === "archive"
                      ? "Archive"
                      : "Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}