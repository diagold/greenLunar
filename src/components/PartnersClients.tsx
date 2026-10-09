"use client";

import { useEffect, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

export interface PartnersClientsSettings {
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
}

export interface PartnerClientItem {
  id: string;
  section_id: string;

  item_type: "partner" | "client";

  name: string;
  logo_url: string;
  website_url: string | null;

  sort_order: number;
  is_active: boolean;
}

interface LogoSliderProps {
  items: PartnerClientItem[];
}

/* =========================================================
   LOGO CARD
========================================================= */

function LogoCard({
  item,
}: {
  item: PartnerClientItem;
}) {
  const content = (
    <div
      className="
        group
        flex
        h-[130px]
        items-center
        justify-center
        overflow-hidden
        rounded-lg
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-md
      "
    >
      <img
        src={item.logo_url}
        alt={item.name}
        loading="lazy"
        className="
          max-h-[75px]
          max-w-full
          object-contain
          grayscale
          transition-all
          duration-500
          ease-out
          group-hover:scale-105
          group-hover:grayscale-0
        "
      />
    </div>
  );

  if (!item.website_url) {
    return content;
  }

  return (
    <a
      href={item.website_url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${item.name}`}
      className="block"
    >
      {content}
    </a>
  );
}

/* =========================================================
   REUSABLE LOGO SLIDER
========================================================= */

function LogoSlider({
  items,
}: LogoSliderProps) {
  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  /* =========================================================
     DIVIDE LOGOS INTO GROUPS OF SIX
  ========================================================= */

  const pages: PartnerClientItem[][] = [];

  for (
    let i = 0;
    i < items.length;
    i += ITEMS_PER_PAGE
  ) {
    pages.push(
      items.slice(
        i,
        i + ITEMS_PER_PAGE
      )
    );
  }

  const totalPages = pages.length;

  const canSlide =
    items.length > ITEMS_PER_PAGE;

  /* =========================================================
     NEXT SLIDE
  ========================================================= */

  const nextSlide = () => {
    if (!canSlide) return;

    setCurrentPage((previous) =>
      previous >= totalPages - 1
        ? 0
        : previous + 1
    );
  };

  /* =========================================================
     PREVIOUS SLIDE
  ========================================================= */

  const previousSlide = () => {
    if (!canSlide) return;

    setCurrentPage((previous) =>
      previous <= 0
        ? totalPages - 1
        : previous - 1
    );
  };

  /* =========================================================
     AUTOMATIC SLIDER
  ========================================================= */

  useEffect(() => {
    if (
      !canSlide ||
      isPaused ||
      totalPages <= 1
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setCurrentPage(
          (previous) =>
            previous >=
            totalPages - 1
              ? 0
              : previous + 1
        );
      }, 5000);

    return () =>
      window.clearInterval(interval);
  }, [
    canSlide,
    isPaused,
    totalPages,
  ]);

  /* =========================================================
     KEEP CURRENT PAGE VALID
  ========================================================= */

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 0) {
        setCurrentPage(0);
      }

      return;
    }

    if (
      currentPage >= totalPages
    ) {
      setCurrentPage(0);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /* =========================================================
     NOTHING TO DISPLAY
  ========================================================= */

  if (items.length === 0) {
    return (
      <div className="flex min-h-[276px] items-center justify-center">
        <p className="text-sm text-gray-500">
          No logos available.
        </p>
      </div>
    );
  }

  /* =========================================================
     SLIDER
  ========================================================= */

  return (
    <div
      className="relative"
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
    >
      {/* =====================================================
          SLIDER VIEWPORT
      ====================================================== */}

      <div className="overflow-hidden">
        <div
          className="
            flex
            transition-transform
            duration-700
            ease-in-out
          "
          style={{
            transform: `translateX(-${
              currentPage * 100
            }%)`,
          }}
        >
          {pages.map(
            (page, pageIndex) => (
              <div
                key={pageIndex}
                className="w-full shrink-0"
              >
                {/*
                  Original grid retained:

                  Desktop / Tablet:
                  3 columns x 2 rows = 6

                  Mobile:
                  2 columns x 3 rows = 6
                */}

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {page.map(
                    (item) => (
                      <LogoCard
                        key={item.id}
                        item={item}
                      />
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* =====================================================
          CONTROLS
      ====================================================== */}

      {canSlide && (
        <div className="mt-6 flex items-center justify-center gap-5">
          {/* PREVIOUS */}

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous logos"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              bg-white
              text-gray-600
              shadow-sm
              transition-all
              duration-300
              hover:border-[#063d2b]
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
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18l-6-6 6-6"
              />
            </svg>
          </button>

          {/* PAGE INDICATORS */}

          <div className="flex items-center justify-center gap-2">
            {pages.map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      index
                    )
                  }
                  aria-label={`Go to logo page ${
                    index + 1
                  }`}
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      currentPage ===
                      index
                        ? "w-6 bg-green-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }
                  `}
                />
              )
            )}
          </div>

          {/* NEXT */}

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next logos"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              bg-white
              text-gray-600
              shadow-sm
              transition-all
              duration-300
              hover:border-[#063d2b]
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
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 18l6-6-6-6"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PARTNERS & CLIENTS SECTION
========================================================= */

interface PartnersClientsProps {
  settings: PartnersClientsSettings;

  partners: PartnerClientItem[];

  clients: PartnerClientItem[];
}

export default function PartnersClients({
  settings,
  partners,
  clients,
}: PartnersClientsProps) {
  return (
    <section className="w-full bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mx-auto max-w-3xl text-center">
          {settings.eyebrow && (
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
              {settings.eyebrow}
            </p>
          )}

          <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
            {settings.heading}
          </h2>

          {settings.description && (
            <p className="mt-5 text-base leading-8 text-gray-600">
              {
                settings.description
              }
            </p>
          )}
        </div>

        {/* =====================================================
            PARTNERS + CLIENTS
        ====================================================== */}

        <div
          className="
            mt-16
            grid
            grid-cols-1
            items-start
            gap-8
            lg:grid-cols-2
          "
        >

          {/* =================================================
              CLIENTS
          ================================================== */}

          <div
            className="
              rounded-xl
              bg-[#f7faf8]
              p-6
              sm:p-8
            "
          >
            <div className="mb-8">
              {settings.clients_eyebrow && (
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-600">
                  {
                    settings.clients_eyebrow
                  }
                </p>
              )}

              {settings.clients_heading && (
                <h3 className="mt-3 text-2xl font-medium text-gray-900">
                  {
                    settings.clients_heading
                  }
                </h3>
              )}

              {settings.clients_description && (
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {
                    settings.clients_description
                  }
                </p>
              )}
            </div>

            <LogoSlider
              items={clients}
            />
          </div>
          
          {/* =================================================
              PARTNERS
          ================================================== */}

          <div
            className="
              rounded-xl
              bg-[#ecfdf5]
              p-6
              sm:p-8
            "
          >
            <div className="mb-8">
              {settings.partners_eyebrow && (
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-600">
                  {
                    settings.partners_eyebrow
                  }
                </p>
              )}

              {settings.partners_heading && (
                <h3 className="mt-3 text-2xl font-medium text-gray-900">
                  {
                    settings.partners_heading
                  }
                </h3>
              )}

              {settings.partners_description && (
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {
                    settings.partners_description
                  }
                </p>
              )}
            </div>

            <LogoSlider
              items={partners}
            />
          </div>


        </div>
      </div>
    </section>
  );
}