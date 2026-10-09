"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { routes } from "@/config/routes";

/* =========================================================
   TYPES
========================================================= */

export type HomepageHeroSlide = {
  id: string;
  eyebrow: string | null;
  title: string;
  highlight: string | null;
  ending: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type HeroProps = {
  slides: HomepageHeroSlide[];
};

/* =========================================================
   FALLBACK

   Used only if no active CMS slides can be loaded.
========================================================= */

const fallbackSlides: HomepageHeroSlide[] = [
  {
    id: "fallback-hero",
    image_url:
      "https://res.cloudinary.com/diobpauw/image/upload/v1788927761/pexels-anthonyshkraba-production-8837544.jpg",
    eyebrow: "DIGITAL TRANSFORMATION",
    title: "Building Technology that",
    highlight: "moves business",
    ending: "forward.",
    description:
      "Digital solutions designed to simplify operations, improve efficiency, and accelerate growth.",
    sort_order: 1,
    is_active: true,
  },
];

/* =========================================================
   HERO
========================================================= */

export default function Hero({ slides }: HeroProps) {
  const heroSlides =
    slides && slides.length > 0 ? slides : fallbackSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  /*
   * Protect against the current index becoming invalid
   * if slides are changed through the CMS.
   */
  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, heroSlides.length]);

  /*
   * Rotate only when there is more than one slide.
   */
  useEffect(() => {
    if (heroSlides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentSlide((previous) => {
        return (previous + 1) % heroSlides.length;
      });
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [heroSlides.length]);

  const slide = heroSlides[currentSlide] ?? heroSlides[0];

  return (
    <section
      className="
        relative
        min-h-[650px]
        overflow-hidden
        sm:min-h-[700px]
        lg:min-h-[800px]
        xl:min-h-[100vh]
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {slide.image_url ? (
            <img
              src={slide.image_url}
              alt={slide.title || "Green Lunar"}
              className="
                h-full
                w-full
                object-cover
                object-center
              "
            />
          ) : (
            <div className="h-full w-full bg-[#073f30]" />
          )}

          {/* Dark overlay */}

          <div className="absolute inset-0 bg-black/55" />

          {/* Gradient overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100svh-80px)]
          w-full
          max-w-7xl
          items-center
          px-5
          py-20
          pt-48
          sm:px-8
          sm:py-24
          sm:pt-56
          lg:px-8
          lg:py-28
          lg:pt-64
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl"
          >
            {/* =================================================
                EYEBROW
            ================================================== */}

            {slide.eyebrow && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                }}
                className="
                  mb-5
                  text-xs
                  font-medium
                  tracking-[0.2em]
                  text-green-400
                  sm:mb-6
                  sm:text-sm
                  sm:tracking-[0.25em]
                "
              >
                {slide.eyebrow}
              </motion.p>
            )}

            {/* =================================================
                ANIMATED HEADING
            ================================================== */}

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="
                text-4xl
                font-bold
                leading-[1.05]
                tracking-tight
                text-white
                sm:text-5xl
                sm:leading-[1.03]
                md:text-6xl
                lg:text-7xl
                lg:leading-[1.02]
              "
            >
              {/* TITLE */}

              <motion.span
                className="block"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,

                    transition: {
                      duration: 0.8,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                {slide.title}
              </motion.span>

              {/* HIGHLIGHT */}

              {slide.highlight && (
                <motion.span
                  className="block text-green-400"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                    },

                    visible: {
                      opacity: 1,
                      y: 0,

                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  {slide.highlight}
                </motion.span>
              )}

              {/* ENDING */}

              {slide.ending && (
                <motion.span
                  className="block"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                    },

                    visible: {
                      opacity: 1,
                      y: 0,

                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  {slide.ending}
                </motion.span>
              )}
            </motion.h1>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            {slide.description && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.65,
                }}
                className="
                  mt-6
                  max-w-xl
                  text-base
                  leading-7
                  text-white/80
                  sm:mt-8
                  sm:text-lg
                  sm:leading-8
                "
              >
                {slide.description}
              </motion.p>
            )}

            {/* =================================================
                BUTTONS
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.8,
              }}
              className="
                mt-8
                flex
                flex-col
                gap-3
                sm:mt-10
                sm:flex-row
                sm:flex-wrap
                sm:gap-4
              "
            >
              <Link
                href={routes.services.technology}
                className="
                  w-full
                  rounded-md
                  bg-green-500
                  px-9
                  py-4
                  text-sm
                  font-medium
                  text-white
                  transition
                  duration-300
                  hover:bg-green-600
                  sm:w-auto
                "
              >
                Explore Solutions
              </Link>

              <Link
                href={routes.contact}
                className="
                  w-full
                  rounded-md
                  border
                  border-white/40
                  bg-white/10
                  px-9
                  py-4
                  text-sm
                  font-medium
                  text-white
                  backdrop-blur-sm
                  transition
                  duration-300
                  hover:bg-white/20
                  sm:w-auto
                "
              >
                Request a Demo
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =====================================================
          SLIDE INDICATORS

          Only display indicators when there is more than
          one active slide.
      ====================================================== */}

      {heroSlides.length > 1 && (
        <div
          className="
            absolute
            bottom-6
            left-1/2
            z-20
            flex
            -translate-x-1/2
            gap-2
            sm:bottom-8
          "
        >
          {heroSlides.map((heroSlide, index) => (
            <button
              key={heroSlide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300

                ${
                  index === currentSlide
                    ? "w-8 bg-green-400 sm:w-10"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}