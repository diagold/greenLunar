"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";

const locations = [
  {
    name: "Lagos",
    address: "Lagos State, Nigeria",
  },
  {
    name: "Abuja",
    address: "Federal Capital Territory, Nigeria",
  },
  {
    name: "Kwara",
    address: "Kwara State, Nigeria",
  },
  {
    name: "Delta",
    address: "Delta State, Nigeria",
  },
];

export default function MarketReach() {
  return (
<section className="bg-gray-50 py-24 sm:py-28 lg:py-32">

    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

        <div className="mx-auto max-w-3xl text-center">

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mb-5 text-sm font-medium tracking-[0.2em] text-green-600"
            >
                Locations
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
                Where we operate{" "}
                <span className="text-green-600">
                across Nigeria
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
                Our technology solutions are designed to support businesses
                and organizations across key locations in Nigeria.
            </motion.p>

        </div> <br/> <br/>
 

        <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.10)] lg:grid-cols-2">

        {/* LEFT — NIGERIA MAP */}
        <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-6 sm:p-8 lg:p-10"
        >
        {/* Green Map Container */}
        <div className="relative flex h-full min-h-[300px] items-center justify-center overflow-hidden rounded-xl bg-[#0B4A36] p-8 sm:p-10 lg:min-h-[300px]">

        {/* Ambient glow */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-green-400/10 blur-3xl" />

        {/* Heading */}
        {/* <div className="absolute left-8 top-8">
            <p className="text-xs font-medium tracking-[0.2em] text-green-300">
            OUR REACH
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-white">
            Across Nigeria
            </h2>
        </div> */}

        {/* Nigeria Map */}
        <div className="relative w-full max-w-[420px]">
            <img
                src="https://res.cloudinary.com/diobpauw/image/upload/v1789023148/nigeria.svg"
                alt="Nigeria Map"
                className="h-auto w-full opacity-95"
                style={{
                filter:
                    "brightness(0) saturate(100%) invert(82%) sepia(19%) saturate(563%) hue-rotate(92deg) brightness(101%) contrast(90%)",
                }}
            />

            {/* Lagos */}
            <div className="absolute bottom-[22%] left-[18%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.18)]" />

            {/* Abuja */}
            <div className="absolute left-[49%] top-[47%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.18)]" />

            {/* Kwara */}
            <div className="absolute left-[37%] top-[42%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.18)]" />

            {/* Delta */}
            <div className="absolute bottom-[29%] left-[42%] h-3 w-3 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.18)]" />
            </div>

        </div>
        </motion.div>

    {/* RIGHT — LOCATIONS */}
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-[#f7faf8] p-8 sm:p-12 lg:p-14"
        >   

                <div className="space-y-4 min-h-[72px] items-center">
                    {locations.map((location, index) => (
                        <motion.div
                        key={location.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                        }}
                        className="group rounded-xl bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]"
                        >
                        <div className="flex items-center gap-4">

                            {/* Location Icon */}
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-50 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white">
                            <MapPin size={20} strokeWidth={1.8} />
                            </div>

                            {/* Location Details */}
                            <div className="min-w-0 flex-1">
                            <h4 className="text-base font-semibold text-gray-900">
                                {location.name}
                            </h4>

                            <p className="mt-1 text-sm text-gray-500">
                                {location.address}
                            </p>
                            </div>

                            {/* Learn More */}
                            <button
                            type="button"
                            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-green-600 transition-all duration-300 hover:text-green-700 sm:inline-flex"
                            >
                            Learn More
                            <ArrowUpRight
                                size={15}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                            </button>
                        </div>

                        {/* Mobile Learn More */}
                        <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green-600 transition-all duration-300 hover:text-green-700 sm:hidden"
                        >
                            Learn More
                            <ArrowUpRight size={15} />
                        </button>
                        </motion.div>
                    ))}
                </div>
        </motion.div>
        </div>
        </div>
    </div>
    </section>
  );
}