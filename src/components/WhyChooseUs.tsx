"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    number: "01",
    title: "Practical Innovation",
    description:
      "We focus on technology that solves real operational challenges and delivers measurable value.",
  },
  {
    number: "02",
    title: "Built for Scale",
    description:
      "Our solutions are designed to grow with your organization, from everyday operations to expanding business needs.",
  },
  {
    number: "03",
    title: "User-Centered Design",
    description:
      "We create simple, intuitive experiences that make technology easier for people to understand and use.",
  },
  {
    number: "04",
    title: "Long-Term Partnership",
    description:
      "We work alongside our clients beyond implementation, continuously improving systems as their needs evolve.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">

          {/* =========================================
              IMAGE SIDE
          ========================================== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="group relative overflow-hidden rounded-xl">
              <img
                src="https://res.cloudinary.com/diobpauw/image/upload/v1789023191/hero-team.jpg"
                alt="Green Lunar team working together"
                className="
                  h-[420px]
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-105

                  sm:h-[520px]
                  lg:h-[600px]
                "
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* =====================================
                FLOATING STAT
            ====================================== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="
                absolute
                bottom-6
                left-6
                rounded-xl
                bg-white
                p-5
                shadow-[0_15px_40px_rgba(0,0,0,0.15)]

                sm:bottom-8
                sm:left-8
                sm:p-6
              "
            >
              <p className="text-3xl font-bold tracking-tight text-gray-900">
                10+
              </p>

              <p className="mt-1 text-xs font-medium tracking-wide text-gray-500">
                YEARS OF PURE CONSISTENCY
              </p>
            </motion.div>
          </motion.div>

          {/* =========================================
              CONTENT SIDE
          ========================================== */}
          <div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="
                mb-5
                text-sm
                font-medium
                tracking-[0.2em]
                text-green-600
              "
            >
              WHY CHOOSE GREEN LUNAR
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="
                max-w-2xl
                text-4xl
                font-semibold
                leading-[1.08]
                tracking-tight
                text-gray-900

                sm:text-5xl
                lg:text-6xl
              "
            >
              Technology that works for{" "}
              <span className="text-green-600">
                your business.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="
                mt-6
                max-w-xl
                text-base
                leading-7
                text-gray-600

                sm:text-lg
                sm:leading-8
              "
            >
              We combine technology, business understanding, and thoughtful
              design to create digital solutions that are practical,
              scalable, and built around the people who use them.
            </motion.p>

            {/* =====================================
                REASONS
            ====================================== */}
            <div className="mt-10 space-y-7">

              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.number}
                  initial={{ opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + index * 0.1,
                  }}
                  className="group flex gap-5"
                >

                  {/* Number */}
                  <div className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-green-50
                    text-xs
                    font-semibold
                    text-green-600
                    transition-colors
                    duration-300
                    group-hover:bg-green-500
                    group-hover:text-white
                  ">
                    {reason.number}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="
                      text-lg
                      font-semibold
                      tracking-tight
                      text-gray-900
                      transition-colors
                      duration-300
                      group-hover:text-green-600
                    ">
                      {reason.title}
                    </h3>

                    <p className="
                      mt-1.5
                      max-w-lg
                      text-sm
                      leading-6
                      text-gray-600
                    ">
                      {reason.description}
                    </p>
                  </div>

                </motion.div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}