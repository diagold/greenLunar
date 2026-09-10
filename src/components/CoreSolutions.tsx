"use client";

import { motion } from "framer-motion";
import { routes } from "@/config/routes";
import Link from "next/link";
const services = [
  {
    name: "Technology",
    description:
      "Innovative technology solutions that help businesses operate smarter, faster, and more efficiently.",
    image: "https://res.cloudinary.com/diobpauw/image/upload/v1788869585/fabio-oyXis2kALVg-unsplash.jpg",
    path: routes.services.technology
  },
  {
    name: "Construction",
    description:
      "Reliable construction solutions combining quality, expertise, and modern project delivery.",
    image: "https://res.cloudinary.com/diobpauw/image/upload/v1788867381/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg",
    path: routes.services.construction
  },
  {
    name: "Fitness & Wellness",
    description:
      "Solutions designed to promote healthier lifestyles, wellbeing, and sustainable performance.",
    image: "https://res.cloudinary.com/diobpauw/image/upload/v1788870481/anastase-maragos-FP7cfYPPUKM-unsplash.jpg",
    path: routes.services.fitnessWellness
  },
  {
    name: "Media & Entertainment",
    description:
      "Creative and digital solutions that connect audiences with engaging experiences.",
    image: "https://res.cloudinary.com/diobpauw/image/upload/v1788872221/laura-lee-moreau-ZpE2gobovro-unsplash.jpg",
    path: routes.services.mediaEntertainment
  },
  {
    name: "Real Estate",
    description:
      "Modern real estate solutions connecting people, properties, and opportunities.",
    image: "https://res.cloudinary.com/diobpauw/image/upload/v1788870738/sean-pollock-PhYq704ffdA-unsplash.jpg",
    path: routes.services.realEstate
  },
];

export default function CoreSolutions() {
  return (
    <section className="bg-gray-50 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

        {/* =========================================
            CORE SOLUTIONS INTRODUCTION
        ========================================== */}
        <div className="mx-auto max-w-3xl text-center">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-sm font-medium tracking-[0.2em] text-green-600"
          >
            OUR CORE SOLUTIONS
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
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
            Technology designed to{" "}
            <span className="text-green-600">
              move businesses forward.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
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
            From business operations to healthcare, education, payments, and
            transportation, our solutions help organizations work smarter,
            operate efficiently, and deliver better experiences.
          </motion.p>

        </div>

        {/* =========================================
            PRODUCT CARDS
        ========================================== */}
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

          {services.map((service, index) => (
            <motion.article
              key={service.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
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

                <img
                  src={service.image}
                  alt={service.name}
                  className="
                  h-[480px]
                  w-full
                  object-contain
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-110
                  sm:h-[520px]
                  lg:h-[560px]
                  object-[center_top]
                  object-[50%_30%]
                  "
                />

                {/* Image overlay */}
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
              <div className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  justify-end
                  p-7
                  sm:p-8
                  lg:p-9
              ">

              {/* Content wrapper */}
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
                    {/* Service Name */}
                  <h3
                      className="
                        text-2xl
                        font-medium
                        tracking-tight
                        text-white
                      "
                    >
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p
                      className="
                        mt-3
                        max-w-md
                        text-sm
                        leading-6
                        text-white/80
                      "
                    >
                      {service.description}
                    </p>
                   <Link
                      href={service.path}
                      aria-label={`Learn more about ${service.name}`}
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
                        hover:bg-green-500
                        hover:scale-105
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
                  </div> 
             </div>
            </motion.article>
          ))}

        </div>
      </div>
    </section>
  );
}