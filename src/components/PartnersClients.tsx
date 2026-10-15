"use client";

import Image from "next/image";

type LogoItem = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url?: string | null;
};

interface PartnersClientsProps {
  partners?: LogoItem[] | null;
  clients?: LogoItem[] | null;
}

type ValidLogoItem = LogoItem & {
  logo_url: string;
};

function hasValidLogo(
  item: LogoItem
): item is ValidLogoItem {
  return (
    typeof item.logo_url === "string" &&
    item.logo_url.trim().length > 0
  );
}

// Reusable logo card
function LogoCard({ item }: { item: ValidLogoItem }) {
  const logo = (
    <div
      className="
        group flex h-28 items-center justify-center
        overflow-hidden rounded-xl
        border border-gray-100 bg-white p-5
        shadow-[0_5px_20px_rgba(0,0,0,0.04)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]
      "
    >
      <Image
        src={item.logo_url.trim()}
        alt={`${item.name} logo`}
        width={180}
        height={90}
        className="
          max-h-20 w-auto max-w-full
          object-contain grayscale-0
          transition-all duration-300
          group-hover:scale-105
          group-hover:grayscale
        "
      />
    </div>
  );

  if (item.website_url?.trim()) {
    return (
      <a
        href={item.website_url.trim()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${item.name}`}
        className="block"
      >
        {logo}
      </a>
    );
  }

  return <div>{logo}</div>;
}

export default function PartnersClients({
  partners = [],
  clients = [],
}: PartnersClientsProps) {
  // Filter out records without uploaded logos
  const validPartners = (partners ?? []).filter(hasValidLogo);
  const validClients = (clients ?? []).filter(hasValidLogo);

  const hasPartners = validPartners.length > 0;
  const hasClients = validClients.length > 0;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* MAIN SECTION HEADING - ALWAYS VISIBLE */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span
            className="
              text-sm font-semibold uppercase
              tracking-widest text-green-700
            "
          >
            Our Network
          </span>

          <h2
            className="
              mt-4 text-3xl font-semibold
              tracking-tight text-gray-900
              sm:text-4xl lg:text-5xl
            "
          >
            Partners &amp; Clients
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600">
            We work with trusted partners and organisations
            across industries to deliver innovative solutions,
            create lasting value and support sustainable growth.
          </p>
        </div>

        {/* LOGO SECTIONS - ONLY VISIBLE WHEN LOGOS EXIST */}
        {(hasPartners || hasClients) && (
          <div
            className={
              hasPartners && hasClients
                ? "grid grid-cols-1 items-start gap-8 lg:grid-cols-2"
                : "grid grid-cols-1"
            }
          >

            {/* PARTNERS LOGO CONTAINER */}
            {hasPartners && (
              <div
                className="
                  rounded-2xl bg-[#ecfdf5]
                  p-8 lg:p-10
                "
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Our Partners
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Collaborating with organisations to
                    deliver innovative solutions and
                    create sustainable business value.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {validPartners.map((partner) => (
                    <LogoCard
                      key={partner.id}
                      item={partner}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CLIENTS LOGO CONTAINER */}
            {hasClients && (
              <div
                className="
                  rounded-2xl bg-[#f7faf8]
                  p-8 lg:p-10
                "
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Our Clients
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Organisations that trust our
                    technology, services and expertise.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {validClients.map((client) => (
                    <LogoCard
                      key={client.id}
                      item={client}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
