"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  Archive,
  ArchiveRestore,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import {
  archiveService,
  deleteService,
  restoreService,
} from "@/app/admin/(dashboard)/services/actions";

import type {
  ServiceStatus,
} from "@/types/service";

type Props = {
  serviceId: string;
  serviceName: string;
  status: ServiceStatus;
};

type ActionType =
  | "archive"
  | "restore"
  | "delete"
  | null;

export default function ServiceActions({
  serviceId,
  serviceName,
  status,
}: Props) {
  const router = useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    actionType,
    setActionType,
  ] = useState<ActionType>(null);

  const [error, setError] =
    useState("");

  function closeModal() {
    if (isPending) {
      return;
    }

    setActionType(null);
    setError("");
  }

  function confirmAction() {
    if (!actionType) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        if (
          actionType === "archive"
        ) {
          await archiveService(
            serviceId
          );

          setActionType(null);

          router.refresh();

          return;
        }

        if (
          actionType === "restore"
        ) {
          await restoreService(
            serviceId
          );

          setActionType(null);

          router.refresh();

          return;
        }

        if (
          actionType === "delete"
        ) {
          await deleteService(
            serviceId
          );

          router.push(
            "/admin/services"
          );

          router.refresh();
        }
      } catch (
        actionError
      ) {
        console.error(
          "Service action error:",
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

  const title =
    actionType === "delete"
      ? "Delete Service"
      : actionType === "archive"
        ? "Archive Service"
        : actionType === "restore"
          ? "Restore Service"
          : "";

  const description =
    actionType === "delete"
      ? `Are you sure you want to permanently delete "${serviceName}"? This action cannot be undone.`
      : actionType === "archive"
        ? `Archive "${serviceName}"? It will no longer be visible on the public website.`
        : actionType === "restore"
          ? `Restore "${serviceName}" to draft status?`
          : "";

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Service Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Archive, restore or permanently delete this service.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {status !==
            "archived" && (
            <button
              type="button"
              disabled={
                isPending
              }
              onClick={() =>
                setActionType(
                  "archive"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
            >
              <Archive
                size={17}
              />

              Archive Service
            </button>
          )}

          {status ===
            "archived" && (
            <button
              type="button"
              disabled={
                isPending
              }
              onClick={() =>
                setActionType(
                  "restore"
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-50"
            >
              <ArchiveRestore
                size={17}
              />

              Restore Service
            </button>
          )}

          <button
            type="button"
            disabled={
              isPending
            }
            onClick={() =>
              setActionType(
                "delete"
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2
              size={17}
            />

            Delete Permanently
          </button>
        </div>
      </section>

      {actionType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {description}
                </p>
              </div>

              <button
                type="button"
                disabled={
                  isPending
                }
                onClick={
                  closeModal
                }
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={
                  isPending
                }
                onClick={
                  closeModal
                }
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isPending
                }
                onClick={
                  confirmAction
                }
                className={`inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${
                  actionType ===
                  "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#073f30] hover:bg-[#09543f]"
                }`}
              >
                {isPending && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {actionType ===
                "delete"
                  ? "Delete"
                  : actionType ===
                      "archive"
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