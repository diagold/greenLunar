
"use client";

import { useEffect, useRef } from "react";
import { X, UserRound } from "lucide-react";

export interface LeadershipProfile {
  id: string;
  name: string;
  position: string;
  image_url?: string | null;
  biography?: string | null;
}

interface LeadershipProfileModalProps {
  leader: LeadershipProfile | null;
  onClose: () => void;
}

export default function LeadershipProfileModal({
  leader,
  onClose,
}: LeadershipProfileModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leader) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusableElements =
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );

        const first = focusableElements[0];
        const last =
          focusableElements[focusableElements.length - 1];

        if (!first || !last) {
          event.preventDefault();
          return;
        }

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [leader, onClose]);

  if (!leader) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leadership-profile-title"
        className="relative flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* CLOSE BUTTON */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close leadership profile"
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg transition hover:bg-[#063d2b] hover:text-white"
        >
          <X size={22} />
        </button>

        {/* SCROLLABLE PROFILE CONTENT */}
        <div className="min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)]">


                {/* =========================================
                    EXECUTIVE PHOTO
                ========================================= */}

                <div className="flex items-start justify-center bg-[#f8faf9] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">

                {/* IMAGE CONTAINER */}
                <div
                    className="
                    relative
                    h-[340px]
                    w-full
                    max-w-[280px]
                    overflow-hidden
                    rounded-2xl
                    border border-gray-200
                    bg-[#ecfdf5]
                    shadow-[0_15px_40px_rgba(0,0,0,0.08)]
                    sm:h-[420px]
                    sm:max-w-[320px]
                    lg:h-[480px]
                    "
                >
                    {leader.image_url ? (
                    <img
                        src={leader.image_url}
                        alt={leader.name}
                        loading="eager"
                        className="
                        h-full
                        w-full
                        object-cover
                        object-top
                        "
                    />
                    ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#063d2b]/40">
                        <UserRound
                        size={100}
                        strokeWidth={1}
                        />
                    </div>
                    )}
                </div>

                </div>

                {/* EXECUTIVE PROFILE */}
                <div className="px-6 pb-10 pt-12 sm:px-10 sm:pb-14 sm:pt-14 lg:px-14 lg:py-16">

                    {/* EYEBROW */}
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
                    Green Lunar Leadership
                    </p>

                    {/* NAME */}
                    <h2
                    id="leadership-profile-title"
                    className="mt-4 pr-8 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl"
                    >
                    {leader.name}
                    </h2>

                    {/* POSITION */}
                    <p className="mt-3 text-base font-semibold text-[#063d2b] sm:text-lg">
                    {leader.position}
                    </p>

                    {/* DIVIDER */}
                    <div className="my-8 h-px w-full bg-gray-200" />

                    {/* BIOGRAPHY */}
                    <div>
                    <h3 className="mb-5 text-xl font-semibold text-gray-900">
                        Professional Profile
                    </h3>

                    <div className="space-y-5 text-[15px] leading-8 text-gray-600 sm:text-base">
                        {leader.biography ? (
                        leader.biography
                            .split(/\n\s*\n/)
                            .filter(Boolean)
                            .map((paragraph, index) => (
                            <p
                                key={index}
                                className="whitespace-pre-line"
                            >
                                {paragraph}
                            </p>
                            ))
                        ) : (
                        <p>
                            This executive's full professional
                            profile will be available soon.
                        </p>
                        )}
                    </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-12 border-t border-gray-200 pt-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                        Green Lunar Group
                    </p>
                    </div>

                </div>
          </div>
        </div>
      </div>
    </div>
  );
}
