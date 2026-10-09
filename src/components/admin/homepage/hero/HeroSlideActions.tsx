"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteHeroSlide,
  setHeroSlideActive,
} from "@/app/admin/(dashboard)/homepage/hero/actions";

type HeroSlideActionsProps = {
  slideId: string;
  slideTitle: string;
  isActive: boolean;
};

export default function HeroSlideActions({
  slideId,
  slideTitle,
  isActive,
}: HeroSlideActionsProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const [error, setError] = useState("");

  function toggleStatus() {
    setError("");

    startTransition(async () => {
      try {
        await setHeroSlideActive(
          slideId,
          !isActive
        );

        router.push(
          `/admin/homepage/hero?${isActive ? "disabled" : "enabled"}=1`
        );

        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update slide status."
        );
      }
    });
  }

  function removeSlide() {
    setError("");

    startTransition(async () => {
      try {
        await deleteHeroSlide(slideId);

        router.push(
          "/admin/homepage/hero?deleted=1"
        );

        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete hero slide."
        );
      }
    });
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">
            Slide Actions
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Control the visibility of this slide or permanently remove it.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={toggleStatus}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}

            {isActive
              ? "Disable Slide"
              : "Enable Slide"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              setConfirmDelete(true)
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
              disabled:opacity-50
            "
          >
            <Trash2 className="h-4 w-4" />
            Delete Slide
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-950">
                  Delete Hero Slide?
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  You are about to permanently delete{" "}
                  <strong className="text-gray-900">
                    {slideTitle}
                  </strong>
                  . This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setConfirmDelete(false)
                }
                className="text-gray-400 transition hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  setConfirmDelete(false)
                }
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={removeSlide}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:opacity-50
                "
              >
                {isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}