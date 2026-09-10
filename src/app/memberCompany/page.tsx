"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { routes } from "@/config/routes";

const memberCompanies = [
  {
    image: "/images/services/construction.jpg",
    path: routes.services.construction,
  },
  {
    image: "https://res.cloudinary.com/diobpauw/image/upload/v1789031988/HVL_LOGO.png",
    path: routes.services.realEstate,
  },
  {
    image: "/images/logo/GrrenCardio.jpeg",
    path: routes.services.fitnessWellness,
  },
  {
    image: "/images/services/media.jpg",
    path: routes.services.mediaEntertainment,
  },
];

export default function MemberCompany() {
  return (
    <section className="bg-[#f7faf8] py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* =========================================
            INTRODUCTION
        ========================================== */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
              Our Member Companies
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              One group.
              <span className="block text-green-600">
                Multiple industries.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:pb-2"
          >
            <p className="max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              GreenLunar Group brings together a portfolio of companies
              operating across construction, real estate and hospitality,
              fitness and wellness, and media and entertainment.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600">
              Each member company operates with its own expertise while
              benefiting from the shared vision, capabilities and strategic
              direction of the wider group.
            </p>
          </motion.div>

        </div>

        {/* =========================================
            MEMBER COMPANY LOGOS
        ========================================== */}
        <div
          className="
            mx-auto
            mt-16
            grid
            max-w-6xl
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {memberCompanies.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
            >
              <Link
                href={member.path}
                className="
                  group
                  flex
                  h-[190px]
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-gray-100
                  bg-white
                  p-6
                  shadow-[0_8px_25px_rgba(0,0,0,0.06)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_15px_35px_rgba(0,0,0,0.10)]
                  sm:h-[210px]
                "
              >
                <img
                  src={member.image}
                  alt="GreenLunar member company"
                  className="
                    h-full
                    w-full
                    object-contain
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-105
                  "
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* =========================================
            GROUP STATEMENT
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="
            mt-16
            grid
            grid-cols-1
            gap-10
            rounded-xl
            bg-[#063d2b]
            px-8
            py-12
            sm:px-12
            lg:grid-cols-[1.2fr_0.8fr]
            lg:items-center
            lg:px-14
            lg:py-14
          "
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              GreenLunar Group
            </p>

            <h3 className="mt-4 max-w-2xl text-3xl font-medium leading-tight text-white sm:text-4xl">
              Building a diversified group designed for
              <span className="text-green-400">
                {" "}long-term growth.
              </span>
            </h3>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Our member companies are connected by a shared commitment to
              innovation, operational excellence, sustainable value creation
              and positive impact.
            </p>
          </div>

          <div className="flex lg:justify-end">
            <Link
              href={routes.about}
              className="
                inline-flex
                items-center
                gap-3
                rounded-md
                border
                border-white/20
                bg-white/10
                px-6
                py-4
                text-sm
                font-medium
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:bg-white/15
              "
            >
              About GreenLunar Group

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
          </div>
        </motion.div>

      </div>
    </section>
  );
}