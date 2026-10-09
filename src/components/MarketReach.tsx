"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import Link from "next/link";

/* =========================================================
   TYPES
========================================================= */

type MarketReachSettings = {
  id: string;
  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;
  map_image_url: string | null;
  is_active: boolean;
};

type MarketReachLocation = {
  id: string;
  section_id: string;
  name: string;
  address: string | null;
  link_url: string | null;
  link_label: string | null;
  marker_left: number | null;
  marker_top: number | null;
  sort_order: number;
  is_active: boolean;
};

type MarketReachProps = {
  settings: MarketReachSettings;
  locations: MarketReachLocation[];
};

/* =========================================================
   COMPONENT
========================================================= */

export default function MarketReach({
  settings,
  locations,
}: MarketReachProps) {
  return (
    <section className="bg-gray-50 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

        {/* =================================================
            SECTION INTRODUCTION
        ================================================== */}

        <div className="mx-auto max-w-3xl text-center">

          {/* EYEBROW */}

          {settings.eyebrow && (
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.6,
              }}
              className="
                mb-5
                text-sm
                font-medium
                tracking-[0.2em]
                text-green-600
              "
            >
              {settings.eyebrow}
            </motion.p>
          )}

          {/* HEADING */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="
              text-4xl
              font-semibold
              leading-[1.08]
              tracking-tight
              text-gray-900
              sm:text-5xl
              lg:text-6xl
            "
          >
            {settings.heading}{" "}

            {settings.highlight && (
              <span className="text-green-600">
                {settings.highlight}
              </span>
            )}
          </motion.h2>

          {/* DESCRIPTION */}

          {settings.description && (
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-gray-600
                sm:text-lg
                sm:leading-8
              "
            >
              {settings.description}
            </motion.p>
          )}
        </div>

        {/* =================================================
            MAP + LOCATIONS
        ================================================== */}

        <div className="mx-auto mt-16 max-w-7xl">
          <div
            className="
              grid
              grid-cols-1
              overflow-hidden
              rounded-xl
              shadow-[0_12px_40px_rgba(0,0,0,0.10)]
              lg:grid-cols-2
            "
          >

            {/* =============================================
                LEFT — NIGERIA MAP
            ============================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
              }}
              className="
                bg-white
                p-6
                sm:p-8
                lg:p-10
              "
            >
              <div
                className="
                  relative
                  flex
                  h-full
                  min-h-[300px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-[#0B4A36]
                  p-8
                  sm:p-10
                  lg:min-h-[300px]
                "
              >

                {/* AMBIENT GLOW */}

                <div
                  className="
                    absolute
                    -left-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    bg-green-400/10
                    blur-3xl
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-20
                    -right-20
                    h-64
                    w-64
                    rounded-full
                    bg-green-400/10
                    blur-3xl
                  "
                />

                {/* =========================================
                    MAP
                ========================================== */}

                <div className="relative w-full max-w-[420px]">

                  {settings.map_image_url ? (
                    <img
                      src={
                        settings.map_image_url
                      }
                      alt="Nigeria Map"
                      className="
                        h-auto
                        w-full
                        opacity-95
                      "
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(82%) sepia(19%) saturate(563%) hue-rotate(92deg) brightness(101%) contrast(90%)",
                      }}
                    />
                  ) : (
                    <div className="flex min-h-[280px] items-center justify-center text-sm text-white/50">
                      Map image not available
                    </div>
                  )}

                  {/* =========================================
                      DYNAMIC LOCATION MARKERS
                  ========================================== */}

                  {settings.map_image_url &&
                    locations.map(
                      (location) => {
                        if (
                          location.marker_left ===
                            null ||
                          location.marker_top ===
                            null
                        ) {
                          return null;
                        }

                        return (
                          <div
                            key={
                              location.id
                            }
                            className="
                              group/marker
                              absolute
                              z-10
                              -translate-x-1/2
                              -translate-y-1/2
                            "
                            style={{
                              left: `${Number(
                                location.marker_left
                              )}%`,

                              top: `${Number(
                                location.marker_top
                              )}%`,
                            }}
                          >
                            {/* MARKER */}

                            <div
                              className="
                                h-3
                                w-3
                                cursor-pointer
                                rounded-full
                                bg-white
                                shadow-[0_0_0_6px_rgba(255,255,255,0.18)]
                                transition-transform
                                duration-300
                                group-hover/marker:scale-125
                              "
                            />

                            {/* TOOLTIP */}

                            <div
                              className="
                                pointer-events-none
                                absolute
                                bottom-full
                                left-1/2
                                mb-3
                                -translate-x-1/2
                                translate-y-1
                                whitespace-nowrap
                                rounded-lg
                                bg-white
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-gray-800
                                opacity-0
                                shadow-lg
                                transition-all
                                duration-200
                                group-hover/marker:translate-y-0
                                group-hover/marker:opacity-100
                              "
                            >
                              {location.name}

                              <span
                                className="
                                  absolute
                                  left-1/2
                                  top-full
                                  -translate-x-1/2
                                  border-4
                                  border-transparent
                                  border-t-white
                                "
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
            </motion.div>

            {/* =============================================
                RIGHT — LOCATIONS
            ============================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="
                bg-[#f7faf8]
                p-8
                sm:p-12
                lg:p-14
              "
            >
              {locations.length > 0 ? (
                <div className="min-h-[72px] space-y-4">
                  {locations.map(
                    (
                      location,
                      index
                    ) => (
                      <motion.div
                        key={
                          location.id
                        }
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.5,
                          delay:
                            index *
                            0.1,
                        }}
                        className="
                          group
                          rounded-xl
                          bg-white
                          p-5
                          shadow-[0_6px_25px_rgba(0,0,0,0.06)]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]
                        "
                      >
                        <div className="flex items-center gap-4">

                          {/* ICON */}

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-md
                              bg-green-50
                              text-green-600
                              transition-colors
                              duration-300
                              group-hover:bg-green-600
                              group-hover:text-white
                            "
                          >
                            <MapPin
                              size={20}
                              strokeWidth={
                                1.8
                              }
                            />
                          </div>

                          {/* DETAILS */}

                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                              {
                                location.name
                              }
                            </h4>

                            {location.address && (
                              <p className="mt-1 text-sm text-gray-500">
                                {
                                  location.address
                                }
                              </p>
                            )}
                          </div>

                          {/* DESKTOP LINK */}

                          {location.link_url && (
                            <Link
                              href={
                                location.link_url
                              }
                              className="
                                hidden
                                shrink-0
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                text-green-600
                                transition-all
                                duration-300
                                hover:text-green-700
                                sm:inline-flex
                              "
                            >
                              {location.link_label ||
                                "Learn More"}

                              <ArrowUpRight
                                size={
                                  15
                                }
                                className="
                                  transition-transform
                                  duration-300
                                  group-hover:translate-x-0.5
                                  group-hover:-translate-y-0.5
                                "
                              />
                            </Link>
                          )}
                        </div>

                        {/* MOBILE LINK */}

                        {location.link_url && (
                          <Link
                            href={
                              location.link_url
                            }
                            className="
                              mt-4
                              inline-flex
                              items-center
                              gap-2
                              text-sm
                              font-medium
                              text-green-600
                              transition-all
                              duration-300
                              hover:text-green-700
                              sm:hidden
                            "
                          >
                            {location.link_label ||
                              "Learn More"}

                            <ArrowUpRight
                              size={15}
                            />
                          </Link>
                        )}
                      </motion.div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center text-center">
                  <div>
                    <MapPin
                      size={28}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm text-gray-500">
                      No locations are
                      currently available.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}