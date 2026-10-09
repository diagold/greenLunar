"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* =========================================================
   TYPES
========================================================= */

type CoreSolutionsSettings = {
  id: string;
  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;
  is_active: boolean;
};

type CoreSolutionItem = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  sort_order: number;
  is_active: boolean;
};

type CoreSolutionsProps = {
  settings: CoreSolutionsSettings;
  items: CoreSolutionItem[];
};

/* =========================================================
   CORE SOLUTIONS
========================================================= */

export default function CoreSolutions({
  settings,
  items,
}: CoreSolutionsProps) {
  return (
    <section className="bg-gray-50 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

        {/* =========================================
            CORE SOLUTIONS INTRODUCTION
        ========================================== */}

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

        {/* =========================================
            CORE SOLUTION CARDS
        ========================================== */}

        {items.length > 0 && (
          <div
            className="
              mx-auto
              mt-16
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              lg:grid-cols-3
              lg:gap-8
            "
          >
            {items.map((item, index) => {
              return (
                <motion.article
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                  }}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    bg-black
                    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:shadow-[0_15px_40px_rgba(0,0,0,0.14)]
                  "
                >

                  {/* =====================================
                      IMAGE
                  ====================================== */}

                  <div className="relative h-64 overflow-hidden sm:h-72">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}

                        className="
                          h-[480px]
                          w-full
                          object-contain
                          object-[50%_8%]
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-110
                          sm:h-[520px]
                          lg:h-[560px]
                        "
                        
                      />
                    ) : (
                      <div
                        className="
                          h-full
                          w-full
                          bg-gradient-to-br
                          from-gray-800
                          to-gray-950
                        "
                      />
                    )}

                    {/* IMAGE OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/0
                        transition-all
                        duration-500
                        group-hover:bg-black/65
                      "
                    />
                  </div>

                  {/* =====================================
                      CARD CONTENT
                  ====================================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      flex-col
                      justify-end
                      p-7
                      sm:p-8
                      lg:p-9
                    "
                  >
                    <div
                      className="
                        translate-y-8
                        opacity-0
                        transition-all
                        duration-500
                        ease-out
                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    >

                      {/* TITLE */}

                      <h3
                        className="
                          text-2xl
                          font-medium
                          tracking-tight
                          text-white
                        "
                      >
                        {item.title}
                      </h3>

                      {/* DESCRIPTION */}

                      {item.description && (
                        <p
                          className="
                            mt-3
                            max-w-md
                            text-sm
                            leading-6
                            text-white/80
                          "
                        >
                          {item.description}
                        </p>
                      )}

                      {/* LINK */}

                      {item.link_url && (
                        <Link
                          href={item.link_url}
                          aria-label={
                            item.link_label
                              ? `${item.link_label}: ${item.title}`
                              : `Learn more about ${item.title}`
                          }
                          title={
                            item.link_label ??
                            "Learn More"
                          }
                          className="
                            mt-6
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-green-600
                            text-white
                            transition-all
                            duration-300
                            hover:scale-105
                            hover:bg-green-500
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
                              d="M5 12h14M13 6l6 6-6 6"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}