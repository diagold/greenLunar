import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  ServiceContentItem,
  ServiceGalleryItem,
  ServicePageContent,
} from "@/types/service";

export const revalidate = 60;

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  image_url: string | null;
  category: string | null;
};

type ServiceRecord = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  gallery: ServiceGalleryItem[] | null;
  capabilities: ServiceContentItem[] | null;
  benefits: ServiceContentItem[] | null;

  primary_button_text: string | null;
  primary_button_url: string | null;
  secondary_button_text: string | null;
  secondary_button_url: string | null;

  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  seo_image_url: string | null;

  page_content: ServicePageContent | null;

  status: "draft" | "published" | "archived";
  featured: boolean;
  sort_order: number;
};

/* =========================================================
   HELPERS
========================================================= */

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getPageContent(
  pageContent: ServicePageContent | null
): ServicePageContent | null {
  if (
    !pageContent ||
    typeof pageContent !== "object" ||
    Array.isArray(pageContent)
  ) {
    return null;
  }

  return pageContent;
}

function getCapabilities(
  capabilities: ServiceContentItem[] | null
): ServiceContentItem[] {
  if (!Array.isArray(capabilities)) {
    return [];
  }

  return capabilities.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      hasText(item.title)
  );
}

function getBenefits(
  benefits: ServiceContentItem[] | null
): ServiceContentItem[] {
  if (!Array.isArray(benefits)) {
    return [];
  }

  return benefits.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      hasText(item.title)
  );
}

function getGallery(
  gallery: ServiceGalleryItem[] | null
): ServiceGalleryItem[] {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery.filter(
    (item) =>
      item &&
      typeof item === "object" &&
      hasText(item.url)
  );
}

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

/* =========================================================
   BUTTON COMPONENT
========================================================= */

function ServiceButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-md bg-green-600 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.20)] transition-all duration-300 hover:bg-green-700 hover:shadow-[0_15px_40px_rgba(22,163,74,0.28)]"
      : "inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#063d2b]";

  const content = (
    <>
      {children}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="ml-2 h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h14M13 6l6 6-6 6"
        />
      </svg>
    </>
  );

  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = createPublicClient();

  const { data: service } = await supabase
    .from("services")
    .select(
      `
        name,
        slug,
        short_description,
        seo_title,
        seo_description,
        seo_keywords,
        seo_image_url,
        image_url
      `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!service) {
    return {
      title: "Service | GreenLunar",
    };
  }

  const title =
    service.seo_title?.trim() ||
    `${service.name} | GreenLunar`;

  const description =
    service.seo_description?.trim() ||
    service.short_description?.trim() ||
    `${service.name} services from GreenLunar.`;

  const socialImage =
    service.seo_image_url?.trim() ||
    service.image_url?.trim();

  const keywords = service.seo_keywords
    ? service.seo_keywords
        .split(",")
        .map((keyword: string) => keyword.trim())
        .filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,

    openGraph: {
      title,
      description,
      type: "website",
      images: socialImage
        ? [
            {
              url: socialImage,
              alt: service.name,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImage
        ? [socialImage]
        : undefined,
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const supabase = createPublicClient();

  const {
    data: serviceData,
    error: serviceError,
  } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

if (serviceError) {
  console.error("Unable to load service", {
    message: serviceError.message,
    details: serviceError.details,
    hint: serviceError.hint,
    code: serviceError.code,
    slug,
  });

  throw new Error(
    `Unable to load service: ${serviceError.message}`
  );
}

if (!serviceData) {
  console.error("Published service not found", {
    slug,
  });

  notFound();
}

  const service =
    serviceData as ServiceRecord;

  const pageContent =
    getPageContent(service.page_content);

  const capabilities =
    getCapabilities(service.capabilities);

  const benefits =
    getBenefits(service.benefits);

  const gallery =
    getGallery(service.gallery);

  /* =======================================================
     PRODUCTS

     For now, products are displayed when the service
     primary section has showProducts enabled.

     If page_content has not yet been populated, Technology
     is also treated as a product-based service.
  ======================================================= */

  const shouldLoadProducts =
    pageContent?.primarySection?.showProducts === true ||
    service.slug === "technology";

  let products: Product[] = [];

  if (shouldLoadProducts) {
    const {
      data: productData,
      error: productError,
    } = await supabase
      .from("products")
      .select(
        `
          id,
          name,
          slug,
          short_description,
          image_url,
          category
        `
      )
      .eq("status", "published")
      .order("sort_order", {
        ascending: true,
      });

    if (productError) {
      console.error(
        "Unable to load service products:",
        productError
      );
    }

    products = productData ?? [];
  }

  /* =======================================================
     FALLBACK CONTENT

     This allows existing services to render even before
     page_content is completely populated in the CMS.
  ======================================================= */

  const heroEyebrow =
    pageContent?.hero?.eyebrow ||
    `GreenLunar ${service.name}`;

  const heroHeading =
    pageContent?.hero?.heading ||
    service.name;

  const heroHighlight =
    pageContent?.hero?.highlight ||
    "built for impact.";

  const heroDescription =
    pageContent?.hero?.description ||
    service.short_description ||
    service.description ||
    "";

  const heroImage =
    service.image_url || "";

  const introductionEyebrow =
    pageContent?.introduction?.eyebrow ||
    `${service.name} at GreenLunar`;

  const introductionHeading =
    pageContent?.introduction?.heading ||
    `Solutions designed`;

  const introductionHighlight =
    pageContent?.introduction?.highlight ||
    "around real-world needs.";

  const introductionDescription =
    pageContent?.introduction?.description ||
    service.description ||
    service.short_description ||
    "";

  const introductionSecondaryDescription =
    pageContent?.introduction
      ?.secondaryDescription || "";

  const primarySection =
    pageContent?.primarySection;

  const secondarySection =
    pageContent?.secondarySection;

  const whySection =
    pageContent?.whySection;

  const cta =
    pageContent?.cta;

  const primaryButtonText =
    service.primary_button_text ||
    "Contact Us";

  const primaryButtonUrl =
    service.primary_button_url ||
    "/contact";

  const secondaryButtonText =
    service.secondary_button_text;

  const secondaryButtonUrl =
    service.secondary_button_url;

  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative min-h-[520px] overflow-hidden bg-[#063d2b] sm:min-h-[560px] lg:min-h-[600px]">
          {/* Hero Image */}
          {heroImage ? (
            <div className="absolute inset-0">
              <img
                src={heroImage}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#063d2b]" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/95 via-[#063d2b]/65 to-transparent" />

          {/* Content */}
          <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 pb-16 sm:min-h-[560px] sm:px-8 sm:pb-20 lg:min-h-[600px] lg:px-10 lg:pb-24">
            <div className="max-w-5xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                {heroEyebrow}
              </p>

              <h1 className="mt-6 text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-8xl">
                {heroHeading}

                {heroHighlight && (
                  <span className="block text-green-400">
                    {heroHighlight}
                  </span>
                )}
              </h1>

              {heroDescription && (
                <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                  {heroDescription}
                </p>
              )}

              {(primaryButtonText ||
                secondaryButtonText) && (
                <div className="mt-9 flex flex-wrap gap-4">
                  {primaryButtonText &&
                    primaryButtonUrl && (
                      <ServiceButton
                        href={primaryButtonUrl}
                      >
                        {primaryButtonText}
                      </ServiceButton>
                    )}

                  {secondaryButtonText &&
                    secondaryButtonUrl && (
                      <ServiceButton
                        href={secondaryButtonUrl}
                        variant="secondary"
                      >
                        {secondaryButtonText}
                      </ServiceButton>
                    )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRODUCTION
        ===================================================== */}
        <section
          id="overview"
          className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  {introductionEyebrow}
                </p>

                <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl">
                  {introductionHeading}

                  {introductionHighlight && (
                    <span className="block text-green-600">
                      {introductionHighlight}
                    </span>
                  )}
                </h2>
              </div>

              <div>
                {introductionDescription && (
                  <p className="text-lg leading-9 text-gray-600">
                    {introductionDescription}
                  </p>
                )}

                {introductionSecondaryDescription && (
                  <p className="mt-6 text-lg leading-9 text-gray-600">
                    {
                      introductionSecondaryDescription
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRIMARY SECTION
        ===================================================== */}
        {primarySection?.enabled !== false &&
          (primarySection ||
            products.length > 0) && (
            <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
              <div className="mx-auto max-w-7xl">
                {primarySection && (
                  <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-24">
                    {/* Text */}
                    <div>
                      {primarySection.eyebrow && (
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                          {
                            primarySection.eyebrow
                          }
                        </p>
                      )}

                      {(primarySection.heading ||
                        primarySection.highlight) && (
                        <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                          {
                            primarySection.heading
                          }

                          {primarySection.highlight && (
                            <span className="block text-green-600">
                              {
                                primarySection.highlight
                              }
                            </span>
                          )}
                        </h2>
                      )}

                      {primarySection.description && (
                        <p className="mt-7 text-base leading-8 text-gray-600 sm:text-lg">
                          {
                            primarySection.description
                          }
                        </p>
                      )}

                      {primarySection.secondaryDescription && (
                        <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
                          {
                            primarySection.secondaryDescription
                          }
                        </p>
                      )}
                    </div>

                    {/* Image */}
                    {primarySection.imageUrl && (
                      <div className="overflow-hidden rounded-xl">
                        <img
                          src={
                            primarySection.imageUrl
                          }
                          alt={
                            primarySection.heading ||
                            service.name
                          }
                          className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[520px]"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* =============================================
                    PRODUCTS
                ============================================= */}
                {products.length > 0 && (
                  <div
                    className={
                      primarySection
                        ? "mt-20"
                        : ""
                    }
                  >
                    <div className="max-w-3xl">
                      <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                        Our Products
                      </p>

                      <h3 className="mt-5 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                        Software solutions designed
                        around
                        <span className="text-green-600">
                          {" "}
                          real-world needs.
                        </span>
                      </h3>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {products.map(
                        (product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                          >
                            {/* Image */}
                            <div className="relative h-[220px] overflow-hidden bg-gray-100">
                              {product.image_url ? (
                                <img
                                  src={
                                    product.image_url
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center px-6 text-center">
                                  <span className="text-sm font-medium text-gray-400">
                                    {
                                      product.name
                                    }
                                  </span>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-8">
                              <h4 className="text-2xl font-medium text-gray-900">
                                {
                                  product.name
                                }
                              </h4>

                              <p className="mt-4 text-sm leading-7 text-gray-600">
                                {product.short_description ||
                                  "A GreenLunar software solution developed to support efficient digital operations."}
                              </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-gray-200 px-8 py-5">
                              <span className="text-sm font-medium text-gray-500">
                                {product.category ||
                                  "Software Solution"}
                              </span>

                              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-green-600 text-white transition-transform duration-300 group-hover:translate-x-1">
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
                              </span>
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* =====================================================
            SECONDARY SECTION
        ===================================================== */}
        {secondarySection?.enabled !== false &&
          (secondarySection ||
            capabilities.length > 0) && (
            <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
              <div className="mx-auto max-w-7xl">
                {secondarySection && (
                  <>
                    <div className="max-w-4xl">
                      {secondarySection.eyebrow && (
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                          {
                            secondarySection.eyebrow
                          }
                        </p>
                      )}

                      {(secondarySection.heading ||
                        secondarySection.highlight) && (
                        <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                          {
                            secondarySection.heading
                          }

                          {secondarySection.highlight && (
                            <span className="block text-green-600">
                              {
                                secondarySection.highlight
                              }
                            </span>
                          )}
                        </h2>
                      )}

                      {secondarySection.description && (
                        <p className="mt-7 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                          {
                            secondarySection.description
                          }
                        </p>
                      )}

                      {secondarySection.secondaryDescription && (
                        <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                          {
                            secondarySection.secondaryDescription
                          }
                        </p>
                      )}
                    </div>

                    {secondarySection.imageUrl && (
                      <div className="mt-14 overflow-hidden rounded-xl">
                        <img
                          src={
                            secondarySection.imageUrl
                          }
                          alt={
                            secondarySection.heading ||
                            service.name
                          }
                          className="h-[380px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[500px] lg:h-[580px]"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Capabilities */}
                {capabilities.length > 0 && (
                  <div
                    className={
                      secondarySection
                        ? "mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                        : "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {capabilities.map(
                      (item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]"
                        >
                          <h3 className="text-2xl font-medium text-gray-900">
                            {item.title}
                          </h3>

                          {item.description && (
                            <p className="mt-4 text-sm leading-7 text-gray-600">
                              {
                                item.description
                              }
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

        {/* =====================================================
            WHY GREENLUNAR / BENEFITS
        ===================================================== */}
        {benefits.length > 0 &&
          whySection?.enabled !== false && (
            <section className="bg-[#063d2b] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
              <div className="mx-auto max-w-7xl">
                <div className="max-w-3xl">
                  <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                    {whySection?.eyebrow ||
                      `Why GreenLunar ${service.name}`}
                  </p>

                  <h2 className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {whySection?.heading ||
                      "Experience. Capability."}

                    <span className="block text-green-400">
                      {whySection?.highlight ||
                        "Solutions that deliver."}
                    </span>
                  </h2>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                  {benefits.map(
                    (item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className="border-t border-white/10 pt-7"
                      >
                        <h3 className="text-2xl font-medium text-white">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="mt-4 text-sm leading-7 text-white/60">
                            {
                              item.description
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>
          )}

        {/* =====================================================
            GALLERY
        ===================================================== */}
        {gallery.length > 0 && (
          <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  Gallery
                </p>

                <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                  {service.name}
                  <span className="text-green-600">
                    {" "}
                    in action.
                  </span>
                </h2>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                {gallery.map(
                  (item, index) => (
                    <div
                      key={`${item.url}-${index}`}
                      className="group overflow-hidden rounded-xl bg-gray-100"
                    >
                      <img
                        src={item.url}
                        alt={
                          item.alt ||
                          `${service.name} image ${
                            index + 1
                          }`
                        }
                        className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px]"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            CTA
        ===================================================== */}
        {cta?.enabled !== false && (
          <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-xl bg-[#f7faf8] px-8 py-16 text-center sm:px-12 lg:px-20 lg:py-24">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  {cta?.eyebrow ||
                    "Partner With Us"}
                </p>

                <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  {cta?.heading ||
                    `Let's discuss your ${service.name.toLowerCase()} requirements.`}

                  {cta?.highlight && (
                    <span className="text-green-600">
                      {" "}
                      {cta.highlight}
                    </span>
                  )}
                </h2>

                {(cta?.description ||
                  service.short_description) && (
                  <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
                    {cta?.description ||
                      service.short_description}
                  </p>
                )}

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <ServiceButton
                    href={primaryButtonUrl}
                  >
                    {primaryButtonText}
                  </ServiceButton>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}