"use client";

import { motion } from "framer-motion";
import { Building2, Globe2, Users } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";

const stats = [
  {
    value: "25,000+",
    unit: "",
    label: "Customers",
    icon: Users,
  },
  {
    value: "4+",
    unit: "",
    label: "Offices Across Nigeria",
    icon: Building2,
  },
  {
    value: "250+",
    unit: "",
    label: "Employees",
    icon: Globe2,
  },
];

export default function TrustSection() {
  return (
    <section className="w-full min-h-[50vh] bg-[#ecfdf5]">
      <div
        className="
          flex
          min-h-[40vh]
          w-full
          items-center
          justify-center
          px-6
          py-20

          sm:px-10
          lg:px-16
          lg:py-24
        "
      >
        <div className="mx-auto w-full max-w-6xl text-center">

          {/* Heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="
              text-xs
              font-medium
              tracking-[0.2em]
              text-green-700
              sm:text-sm
            "
          >
            TRUSTED BY BUSINESSES
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="
              mx-auto
              mt-4
              max-w-3xl
              text-4xl
              font-semibold
              leading-[1.08]
              tracking-tight
              text-gray-900

              sm:text-5xl
              lg:text-6xl
            "
          >
            Trusted by organizations{" "}
            <span className="text-green-600">
              building the future.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-base
              leading-7
              text-gray-600
              sm:text-lg
              sm:leading-8
            "
          >
            Delivering reliable technology solutions that help organizations
            operate smarter, connect better, and grow with confidence.
          </motion.p>

          {/* Statistics */}
          <div
            className="
                mx-auto
                mt-14
                grid
                max-w-5xl
                grid-cols-1
                gap-10
                sm:grid-cols-3
                sm:gap-16
                lg:gap-24
            "
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + index * 0.1,
                  }}
                  className="px-6 py-7 sm:py-3"
                >
                  <div className="flex justify-center">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-md
                        bg-white
                        text-green-600
                        shadow-sm
                      "
                    >
                      <Icon size={20} strokeWidth={1.7} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                      {stat.value}

                      {stat.unit && (
                        <span className="ml-1 text-xl font-medium text-green-600">
                          {stat.unit}
                        </span>
                      )}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12"
          >
            <a
              href={routes.contact}
                    className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-md
                    bg-green-600
                    px-7
                    py-4
                    text-sm
                    font-medium
                    text-white
                    shadow-[0_8px_20px_rgba(22,163,74,0.25)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-green-700
                    hover:shadow-[0_12px_28px_rgba(22,163,74,0.35)]
                "
            >
              Partner With Us Today
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}