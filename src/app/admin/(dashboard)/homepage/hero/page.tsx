import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  Plus,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import type { HeroSlide } from "@/types/hero";

export default async function HeroManagementPage() {
  const supabase = await createClient();

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-900">
          Authentication required
        </h1>

        <p className="mt-2 text-sm text-red-700">
          Please sign in again to manage homepage hero slides.
        </p>
      </div>
    );
  }

  /* =========================================================
     LOAD HERO SLIDES
  ========================================================= */

  const {
    data,
    error,
  } = await supabase
    .from("homepage_hero_slides")
    .select("*")
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error("Unable to load hero slides:", error);

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-900">
          Unable to load Hero Slides
        </h1>

        <p className="mt-2 text-sm text-red-700">
          {error.message}
        </p>
      </div>
    );
  }

  const slides: HeroSlide[] = data ?? [];

  const activeSlides = slides.filter(
    (slide) => slide.is_active
  ).length;

  const inactiveSlides =
    slides.length - activeSlides;

  return (
    <div className="space-y-8">

      {/* =====================================================
          BACK
      ====================================================== */}

      <Link
        href="/admin/homepage"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-gray-500
          transition
          hover:text-gray-900
        "
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Home Page
      </Link>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >
        <div>
          <p className="text-sm font-medium text-green-700">
            Home Page
          </p>

          <h1
            className="
              mt-1
              text-3xl
              font-semibold
              tracking-tight
              text-gray-950
            "
          >
            Hero Section
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-gray-500
            "
          >
            Manage the images and text displayed in the
            homepage hero slideshow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/"
            target="_blank"
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
              shadow-sm
              transition
              hover:bg-gray-50
            "
          >
            View Homepage

            <ExternalLink className="h-4 w-4" />
          </Link>

          <Link
            href="/admin/homepage/hero/new"
            scroll={true}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#073f30]
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-[#0a503d]
            "
          >
            <Plus className="h-4 w-4" />

            Add Hero Slide
          </Link>

        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-3
        "
      >
        <StatCard
          label="Total Slides"
          value={slides.length}
        />

        <StatCard
          label="Active"
          value={activeSlides}
        />

        <StatCard
          label="Inactive"
          value={inactiveSlides}
        />
      </div>

      {/* =====================================================
          HERO SLIDES
      ====================================================== */}

      <section>

        <div className="mb-5">

          <h2
            className="
              text-lg
              font-semibold
              text-gray-950
            "
          >
            Hero Slides
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Slides are displayed according to their
            display order.
          </p>

        </div>

        {slides.length === 0 ? (

          <EmptyState />

        ) : (

          <div className="space-y-6">

            {slides.map((slide) => (

              <HeroSlideCard
                key={slide.id}
                slide={slide}
              />

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

/* =========================================================
   HERO SLIDE CARD
========================================================= */

function HeroSlideCard({
  slide,
}: {
  slide: HeroSlide;
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          grid
          lg:grid-cols-[380px_1fr]
        "
      >

        {/* =================================================
            IMAGE
        ================================================== */}

        <div
          className="
            relative
            min-h-[260px]
            overflow-hidden
            bg-gray-100
            lg:min-h-[310px]
          "
        >

          {slide.image_url ? (
            <>
              <img
                src={slide.image_url}
                alt={slide.title}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/50
                  via-transparent
                  to-transparent
                "
              />
            </>
          ) : (

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <ImageIcon
                className="
                  h-9
                  w-9
                  text-gray-300
                "
              />
            </div>

          )}

          {/* STATUS */}

          <div
            className="
              absolute
              bottom-4
              left-4
            "
          >
            <span
              className={`
                rounded-full
                px-3
                py-1.5
                text-xs
                font-medium

                ${
                  slide.is_active
                    ? "bg-green-500 text-white"
                    : "bg-gray-900/80 text-white"
                }
              `}
            >
              {slide.is_active
                ? "Active"
                : "Inactive"}
            </span>
          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div
          className="
            flex
            flex-col
            justify-between
            p-6
            lg:p-8
          "
        >

          <div>

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-3
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  tracking-[0.18em]
                  text-green-700
                "
              >
                {slide.eyebrow ||
                  "HERO SLIDE"}
              </p>

              <span
                className="
                  rounded-full
                  bg-gray-100
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-gray-500
                "
              >
                Display Order:{" "}
                {slide.sort_order}
              </span>

            </div>

            {/* HEADING PREVIEW */}

            <div className="mt-5">

              <h2
                className="
                  text-2xl
                  font-semibold
                  leading-tight
                  text-gray-950
                  lg:text-3xl
                "
              >
                {slide.title}
              </h2>

              {slide.highlight && (
                <p
                  className="
                    mt-1
                    text-2xl
                    font-semibold
                    leading-tight
                    text-green-600
                    lg:text-3xl
                  "
                >
                  {slide.highlight}
                </p>
              )}

              {slide.ending && (
                <p
                  className="
                    mt-1
                    text-2xl
                    font-semibold
                    leading-tight
                    text-gray-950
                    lg:text-3xl
                  "
                >
                  {slide.ending}
                </p>
              )}

            </div>

            {/* DESCRIPTION */}

            {slide.description && (

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                {slide.description}
              </p>

            )}

          </div>

          {/* =================================================
              ACTION
          ================================================== */}

          <div
            className="
              mt-8
              flex
              flex-wrap
              items-center
              justify-between
              gap-4
              border-t
              border-gray-100
              pt-5
            "
          >

            <div className="text-xs text-gray-400">
              Slide #{slide.sort_order}
            </div>

            <Link
              href={`/admin/homepage/hero/${slide.id}`}
              scroll={true}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#073f30]
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#0a503d]
              "
            >
              Edit Slide
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div
      className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-gray-300
        bg-white
        p-8
        text-center
      "
    >

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-green-50
        "
      >
        <ImageIcon
          className="
            h-5
            w-5
            text-green-700
          "
        />
      </div>

      <h3
        className="
          mt-4
          font-semibold
          text-gray-950
        "
      >
        No hero slides
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          leading-6
          text-gray-500
        "
      >
        Add your first hero slide to start managing
        the homepage slideshow.
      </p>

    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p
        className="
          mt-2
          text-2xl
          font-semibold
          tracking-tight
          text-gray-950
        "
      >
        {value}
      </p>
    </div>
  );
}