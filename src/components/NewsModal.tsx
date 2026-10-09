"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NewsModalProps {
  image?: string;
  category?: string;
  title?: string;
  description?: string;
  link?: string;
  linkText?: string;
}

export default function NewsModal({
  image,
  category = "Latest News",
  title,
  description,
  link,
  linkText = "Learn More",
}: NewsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small delay makes the experience feel less abrupt
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Prevent page scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/60
        px-4
        py-8
        backdrop-blur-[2px]
      "
      onClick={() => setIsOpen(false)}
    >
      {/* MODAL */}
      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-4xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-[0_30px_100px_rgba(0,0,0,0.30)]
          animate-[modalIn_0.35s_ease-out]
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close announcement"
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-gray-700
            shadow-md
            transition-all
            duration-300
            hover:rotate-90
            hover:bg-[#063d2b]
            hover:text-white
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* =========================================
            IMAGE
            Automatically hidden when none is supplied
        ========================================== */}
        {image && (
          <div className="relative h-[260px] overflow-hidden sm:h-[340px] lg:h-[390px]">
            <img
              src={image}
              alt={title || "GreenLunar latest news"}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        )}

        {/* =========================================
            CONTENT
        ========================================== */}
        {(title || description || category) && (
          <div className="px-7 py-8 sm:px-10 sm:py-10 lg:px-12">
            {/* CATEGORY */}
            {category && (
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-green-600" />

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-green-600">
                  {category}
                </p>
              </div>
            )}

            {/* TITLE */}
            {title && (
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                {title}
              </h2>
            )}

            {/* DESCRIPTION */}
            {description && (
              <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
                {description}
              </p>
            )}

            {/* ACTIONS */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {link && (
                <Link
                  href={link}
                  onClick={() => setIsOpen(false)}
                  className="
                    inline-flex
                    items-center
                    gap-3
                    rounded-md
                    bg-[#063d2b]
                    px-6
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    duration-300
                    hover:bg-green-700
                  "
                >
                  {linkText}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  rounded-md
                  border
                  border-gray-200
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-gray-600
                  transition-colors
                  hover:border-gray-300
                  hover:text-gray-900
                "
              >
                Continue to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}