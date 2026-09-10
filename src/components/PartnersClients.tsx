"use client";

import { motion } from "framer-motion";

const clients = [
  {
    name: "Nigerian Army",
    logo: "https://res.cloudinary.com/diobpauw/image/upload/v1789023238/NA_Med.jpg",
  },
  {
    name: "TAP 0",
    logo: "/images/clients/TAP.jpeg",
  },
  {
   name: "TAP 1",
    logo: "/images/clients/TAP.jpeg",
  },
  {
   name: "nrc",
    logo: "/images/clients/nrc-logo.png",
  }
];

const partners = [
  {
    name: "Partner 1",
    logo: "https://res.cloudinary.com/diobpauw/image/upload/v1789023223/TAP.jpg",
  },
  {
    name: "Partner 2",
    logo: "/images/partners/TAP.jpeg",
  },
    {
    name: "Partner 3",
    logo: "/images/partners/NA_Med.jpeg",
  },
      {
    name: "Partner 4",
    logo: "/images/partners/NA_Med.jpeg",
  },
];

function LogoGrid({
  items,
}: {
  items: { name: string; logo: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            delay: index * 0.06,
          }}
        className="
          flex
          min-h-[100px]
          items-center
          justify-center
          rounded-lg
          bg-white
          px-6
          py-6
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)]
        "
        >
          <img
            src={item.logo}
            alt={item.name}
            className="
              max-h-12
              max-w-[140px]
              object-contain
              opacity-70
              transition-all
              duration-300
              hover:grayscale-0
              hover:opacity-100
            "
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function PartnersClients() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-medium tracking-[0.2em] text-green-600 sm:text-sm">
            OUR NETWORK
          </p>

          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            Trusted relationships.
            <br />
            <span className="text-green-600">
              Shared success.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            We work with forward-thinking organizations and technology
            partners to deliver solutions that create lasting value.
          </p>
        </motion.div>

        {/* Two Panels */}
        <div className="
                  mt-16
                  grid
                  grid-cols-1
                  items-start
                  gap-6
                  lg:grid-cols-2
                  lg:gap-8 
        ">

          {/* ==============================
              CLIENTS
          =============================== */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="
              rounded-xl
              bg-[#f7faf8]
              p-7
              sm:p-10
              lg:p-12
            "
          >
            <div className="mb-8">
              <p className="text-xs font-medium tracking-[0.18em] text-green-600">
                CLIENTS
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Our Clients
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                Organizations that trust Green Lunar to support their digital
                transformation and technology needs.
              </p>
            </div>

            <LogoGrid items={clients} />
          </motion.div>

          {/* ==============================
              PARTNERS
          =============================== */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="
              rounded-xl
              bg-[#ecfdf5]
              p-7
              sm:p-10
              lg:p-12
            "
          >
            <div className="mb-8">
              <p className="text-xs font-medium tracking-[0.18em] text-green-600">
                PARTNERS
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Our Partners
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                Strategic technology and business partners helping us deliver
                reliable solutions across different industries.
              </p>
            </div>

            <LogoGrid items={partners} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}