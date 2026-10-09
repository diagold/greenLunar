import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  ImageIcon,
  Layers3,
  MapPinned,
  Medal,
  Network,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type HomepageSection = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  available: boolean;
};

export default async function HomepageAdminPage() {
  const supabase = await createClient();

  const { count: totalHeroSlides } = await supabase
    .from("homepage_hero_slides")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: activeHeroSlides } = await supabase
    .from("homepage_hero_slides")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("is_active", true);

  const sections: HomepageSection[] = [
    {
      title: "Hero Section",
      description:
        "Manage the homepage hero images, headings, descriptions and slide order.",
      href: "/admin/homepage/hero",
      icon: ImageIcon,
      available: true,
    },
    {
      title: "Core Solutions",
      description:
        "Manage the services and solution cards displayed on the homepage.",
      href: "/admin/homepage/core-solutions",
      icon: Layers3,
      available: false,
    },
    {
      title: "Why Choose Us",
      description:
        "Manage the reasons, supporting content and messaging displayed in this section.",
      href: "/admin/homepage/why-choose-us",
      icon: ShieldCheck,
      available: false,
    },
    {
      title: "Market Reach",
      description:
        "Manage the locations and supporting content displayed in the Market Reach section.",
      href: "/admin/homepage/market-reach",
      icon: MapPinned,
      available: false,
    },
    {
      title: "Trust Section",
      description:
        "Manage the statistics and impact numbers displayed on the homepage.",
      href: "/admin/homepage/trust",
      icon: Medal,
      available: false,
    },
    {
      title: "Member Company",
      description:
        "Manage the member-company information presented on the homepage.",
      href: "/admin/homepage/member-company",
      icon: Network,
      available: false,
    },
    {
      title: "Partners & Clients",
      description:
        "Manage partner and client logos, visibility and display order.",
      href: "/admin/homepage/partners-clients",
      icon: UsersRound,
      available: false,
    },
    {
      title: "Homepage SEO",
      description:
        "Manage homepage search metadata and social sharing information.",
      href: "/admin/homepage/seo",
      icon: Sparkles,
      available: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-green-700">
            Website Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
            Home Page
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Manage the sections and content displayed on the Green Lunar
            homepage.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="
            inline-flex
            w-fit
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            shadow-sm
            transition
            hover:border-gray-300
            hover:bg-gray-50
          "
        >
          View Homepage
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* =====================================================
          HOMEPAGE OVERVIEW
      ====================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Homepage Sections"
          value={sections.length}
        />

        <OverviewCard
          label="Hero Slides"
          value={totalHeroSlides ?? 0}
        />

        <OverviewCard
          label="Active Hero Slides"
          value={activeHeroSlides ?? 0}
        />

        <OverviewCard
          label="Sections Connected"
          value={sections.filter((section) => section.available).length}
        />
      </div>

      {/* =====================================================
          SECTION MANAGEMENT
      ====================================================== */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-950">
            Homepage Sections
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sections are arranged in the same order they appear on the public
            homepage.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {sections.map((section, index) => {
            const Icon = section.icon;

            const content = (
              <div
                className={`
                  group
                  relative
                  flex
                  min-h-[190px]
                  flex-col
                  justify-between
                  rounded-2xl
                  border
                  bg-white
                  p-6
                  shadow-sm
                  transition
                  ${
                    section.available
                      ? "border-gray-200 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
                      : "border-gray-100"
                  }
                `}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-green-50
                        text-green-700
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs font-medium text-gray-400">
                      Section {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-950">
                    {section.title}
                  </h3>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                    {section.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {section.available ? (
                    <>
                      <span className="text-sm font-medium text-green-700">
                        Manage section
                      </span>

                      <ArrowRight className="h-4 w-4 text-green-700 transition group-hover:translate-x-1" />
                    </>
                  ) : (
                    <span
                      className="
                        rounded-full
                        bg-gray-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-gray-500
                      "
                    >
                      Coming next
                    </span>
                  )}
                </div>
              </div>
            );

            if (!section.available) {
              return <div key={section.title}>{content}</div>;
            }

            return (
              <Link key={section.title} href={section.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function OverviewCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
        {value}
      </p>
    </div>
  );
}