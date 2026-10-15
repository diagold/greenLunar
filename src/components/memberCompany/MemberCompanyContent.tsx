
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export interface MemberCompanySettings {
  id: string;
  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;
  secondary_description: string | null;
  statement_eyebrow: string | null;
  statement_heading: string | null;
  statement_highlight: string | null;
  statement_description: string | null;
  cta_label: string | null;
  cta_url: string | null;
  is_active: boolean;
}

export interface MemberCompanyItem {
  id: string;
  section_id: string;
  name: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

interface MemberCompanyProps {
  settings: MemberCompanySettings;
  companies: MemberCompanyItem[];
}

function CompanyCard({
  company,
  index,
}: {
  company: MemberCompanyItem;
  index: number;
}) {
  const card = (
    <div
      className="
        group flex h-[190px] items-center justify-center
        overflow-hidden rounded-xl border border-gray-100
        bg-white p-6
        shadow-[0_8px_25px_rgba(0,0,0,0.06)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_15px_35px_rgba(0,0,0,0.10)]
        sm:h-[210px]
      "
    >
      {/* Standard img supports external Supabase URLs
          without Next Image remotePatterns. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={company.image_url}
        alt={`${company.name} logo`}
        loading="lazy"
        className="
          h-full w-full object-contain
          transition-transform duration-500 ease-out
          group-hover:scale-105
        "
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index, 8) * 0.08,
      }}
    >
      {company.link_url ? (
        <Link
          href={company.link_url}
          aria-label={`View ${company.name}`}
          className="block"
        >
          {card}
        </Link>
      ) : (
        card
      )}
    </motion.div>
  );
}

export default function MemberCompanyContent({
  settings,
  companies,
}: MemberCompanyProps) {
  const safeCompanies = Array.isArray(companies)
    ? companies
    : [];

  const showStatement =
    Boolean(settings.statement_eyebrow) ||
    Boolean(settings.statement_heading) ||
    Boolean(settings.statement_description) ||
    Boolean(settings.cta_label && settings.cta_url);

  return (
    <section className="bg-[#f7faf8] py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* INTRODUCTION */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {settings.eyebrow && (
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                {settings.eyebrow}
              </p>
            )}

            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {settings.heading}

              {settings.highlight && (
                <span className="block text-green-600">
                  {settings.highlight}
                </span>
              )}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="lg:pb-2"
          >
            {settings.description && (
              <p className="max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                {settings.description}
              </p>
            )}

            {settings.secondary_description && (
              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600">
                {settings.secondary_description}
              </p>
            )}
          </motion.div>
        </div>

        {/* MEMBER COMPANY LOGOS */}
        {safeCompanies.length > 0 && (
          <div className="mt-16 flex justify-center">
            <div
              className="
                grid w-full max-w-6xl grid-cols-1
                justify-center gap-5 sm:grid-cols-2
                lg:[grid-template-columns:repeat(auto-fit,minmax(220px,260px))]
              "
            >
              {safeCompanies.map((company, index) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* GROUP STATEMENT */}
        {showStatement && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="
              mt-16 grid grid-cols-1 gap-10
              rounded-xl bg-[#063d2b]
              px-8 py-12 sm:px-12
              lg:grid-cols-[1.2fr_0.8fr]
              lg:items-center lg:px-14 lg:py-14
            "
          >
            <div>
              {settings.statement_eyebrow && (
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                  {settings.statement_eyebrow}
                </p>
              )}

              {settings.statement_heading && (
                <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-tight text-white sm:text-4xl">
                  {settings.statement_heading}

                  {settings.statement_highlight && (
                    <span className="text-green-400">
                      {" "}
                      {settings.statement_highlight}
                    </span>
                  )}
                </h2>
              )}

              {settings.statement_description && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                  {settings.statement_description}
                </p>
              )}
            </div>

            {settings.cta_label && settings.cta_url && (
              <div className="flex lg:justify-end">
                <Link
                  href={settings.cta_url}
                  className="
                    inline-flex items-center gap-3
                    rounded-md border border-white/20
                    bg-white/10 px-6 py-4
                    text-sm font-medium text-white
                    backdrop-blur-sm transition-all duration-300
                    hover:bg-white/15
                  "
                >
                  {settings.cta_label}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
