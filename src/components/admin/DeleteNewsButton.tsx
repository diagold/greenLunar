
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DeleteNewsButtonProps {
  articleId: string;
  articleTitle: string;
}

export default function DeleteNewsButton({
  articleId,
  articleTitle,
}: DeleteNewsButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Prevent background scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !deleting) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, deleting]);

  function openModal() {
    setErrorMessage("");
    setIsOpen(true);
  }

  function closeModal() {
    if (deleting) return;

    setIsOpen(false);
    setErrorMessage("");
  }

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("news")
        .delete()
        .eq("id", articleId)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          "The article could not be deleted. Please check your permissions."
        );
      }

      setIsOpen(false);
      router.refresh();
    } catch (error: unknown) {
      console.error("News delete error:", error);

      const message =
        error &&
        typeof error === "object" &&
        "message" in error
          ? String(error.message)
          : "Unable to delete this article. Please try again.";

      setErrorMessage(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Delete button in the News table */}
      <button
        type="button"
        onClick={openModal}
        className="
          inline-flex items-center gap-2
          rounded-lg border border-red-200
          px-3 py-2 text-sm font-medium
          text-red-600 transition-all duration-200
          hover:border-red-300 hover:bg-red-50
        "
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-black/60 px-4 py-6
            backdrop-blur-[3px]
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-news-title"
            aria-describedby="delete-news-description"
            className="
              w-full max-w-[480px]
              overflow-hidden rounded-2xl
              border border-gray-100 bg-white
              shadow-[0_25px_80px_rgba(0,0,0,0.25)]
              animate-in fade-in zoom-in-95 duration-200
            "
          >
            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              {/* Icon and Close Button */}
              <div className="mb-6 flex items-start justify-between">
                <div
                  className="
                    flex h-14 w-14
                    items-center justify-center
                    rounded-xl bg-red-50
                    ring-1 ring-red-100
                  "
                >
                  <Trash2 className="h-7 w-7 text-red-600" />
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={deleting}
                  aria-label="Close confirmation"
                  className="
                    rounded-lg p-2 text-gray-400
                    transition hover:bg-gray-100
                    hover:text-gray-700
                    disabled:opacity-50
                  "
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Title */}
              <h2
                id="delete-news-title"
                className="text-2xl font-semibold tracking-tight text-gray-900"
              >
                Delete News Article?
              </h2>

              {/* Description */}
              <p
                id="delete-news-description"
                className="mt-3 text-sm leading-7 text-gray-600"
              >
                Are you sure you want to permanently delete
                the following news article?
              </p>

              {/* Article Title */}
              <div
                className="
                  mt-4 rounded-lg
                  border border-gray-200
                  bg-gray-50 px-4 py-3
                "
              >
                <p className="break-words text-sm font-semibold text-gray-900">
                  {articleTitle}
                </p>
              </div>

              {/* Warning */}
              <div
                className="
                  mt-5 flex items-start gap-3
                  rounded-lg border border-red-100
                  bg-red-50 p-4
                "
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    This action cannot be undone.
                  </p>

                  <p className="mt-1 text-xs leading-6 text-red-700">
                    The article will be permanently removed
                    from the News Management database and
                    will no longer appear on the website.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="
                    mt-4 rounded-lg border border-red-200
                    bg-red-50 px-4 py-3
                    text-sm text-red-700
                  "
                >
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="
                flex flex-col-reverse gap-3
                border-t border-gray-100
                bg-gray-50 px-6 py-5
                sm:flex-row sm:justify-end
                sm:px-8
              "
            >
              <button
                type="button"
                onClick={closeModal}
                disabled={deleting}
                className="
                  inline-flex items-center justify-center
                  rounded-lg border border-gray-200
                  bg-white px-5 py-3
                  text-sm font-semibold text-gray-700
                  transition hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="
                  inline-flex items-center justify-center
                  gap-2 rounded-lg bg-red-600
                  px-5 py-3 text-sm font-semibold
                  text-white transition-all
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Article
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
