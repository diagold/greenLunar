"use client";

import { motion } from "framer-motion";

export default function HeroHeading() {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      className="text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <motion.span
        className="block whitespace-nowrap"
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
        Building Technology that
      </motion.span>

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
        moves business
      </motion.span>

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
        forward.
      </motion.span>
    </motion.h1>
  );
}