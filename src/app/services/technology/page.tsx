import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Technology | GreenLunar",
  description:
    "GreenLunar delivers locally developed software solutions and globally sourced technology hardware for businesses, institutions and communities.",
};

export const revalidate = 60;

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  image_url: string | null;
  category: string | null;
};

export default async function TechnologyPage() {
  const supabase = createPublicClient();

  const { data: products, error } = await supabase
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

  if (error) {
    console.error("Unable to load technology products:", error);
  }

  const publishedProducts: Product[] = products ?? [];

  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative min-h-[520px] overflow-hidden bg-[#063d2b] sm:min-h-[560px] lg:min-h-[600px]">
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img
              src="https://res.cloudinary.com/diobpauw/image/upload/v1788869773/robynne-o-HOrhCnQsxnQ-unsplash.jpg"
              alt="GreenLunar Technology"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/95 via-[#063d2b]/65 to-transparent" />

          {/* Content */}
          <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 pb-16 sm:min-h-[560px] sm:px-8 sm:pb-20 lg:min-h-[600px] lg:px-10 lg:pb-24">
            <div className="max-w-5xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                GreenLunar Technology
              </p>

              <h1 className="mt-6 text-5xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-8xl">
                Technology
                <span className="block text-green-400">
                  built for impact.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                From globally sourced hardware to software solutions developed
                specifically for Nigeria, we bring technology closer to the
                people and businesses that need it.
              </p>
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
                  Technology at GreenLunar
                </p>

                <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl">
                  Global technology.
                  <span className="block text-green-600">
                    Local understanding.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-lg leading-9 text-gray-600">
                  At GreenLunar Group, our technology business is built around
                  two complementary areas: hardware and software. We work with
                  leading Original Equipment Manufacturers around the world to
                  provide reliable technology hardware, while our software
                  products are developed locally to address the unique needs of
                  Nigerian businesses, organizations and communities.
                </p>

                <p className="mt-6 text-lg leading-9 text-gray-600">
                  This combination allows us to provide complete technology
                  solutions — from the physical infrastructure people interact
                  with to the software that powers their operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SOFTWARE
        ===================================================== */}
        <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-24">
              {/* Text */}
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  Software
                </p>

                <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Software
                  <span className="block text-green-600">
                    built for Nigeria.
                  </span>
                </h2>

                <p className="mt-7 text-base leading-8 text-gray-600 sm:text-lg">
                  Our software solutions are indigenously developed with
                  Nigerian businesses, institutions and everyday users in mind.
                </p>

                <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
                  Rather than adapting solutions built for completely different
                  markets, we develop products around the realities, workflows
                  and challenges faced by Nigerian organizations.
                </p>
              </div>

              {/* Image */}
              <div className="overflow-hidden rounded-xl">
                <img
                  src="https://res.cloudinary.com/diobpauw/image/upload/v1788927809/tianyi-ma-WiONHd_zYI4-unsplash.jpg"
                  alt="GreenLunar indigenous software solutions"
                  className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[520px]"
                />
              </div>
            </div>

            {/* =================================================
                SOFTWARE PRODUCTS — FROM PRODUCTS CMS
            ================================================= */}
            <div className="mt-20">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  Our Products
                </p>

                <h3 className="mt-5 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                  Software solutions designed around
                  <span className="text-green-600">
                    {" "}
                    real-world needs.
                  </span>
                </h3>
              </div>

              {publishedProducts.length > 0 ? (
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {publishedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                    >
                      {/* Product Image */}
                      <div className="relative h-[220px] overflow-hidden bg-gray-100">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 px-6 text-center">
                            <span className="text-sm font-medium text-gray-400">
                              {product.name}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Product Content */}
                      <div className="flex-1 p-8">
                        <h4 className="text-2xl font-medium text-gray-900">
                          {product.name}
                        </h4>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                          {product.short_description ||
                            "A GreenLunar software solution developed to support efficient digital operations."}
                        </p>
                      </div>

                      {/* Product Footer */}
                      <div className="flex items-center justify-between border-t border-gray-200 px-8 py-5">
                        <span className="text-sm font-medium text-gray-500">
                          {product.category || "Software Solution"}
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
                  ))}
                </div>
              ) : (
                <div className="mt-12 rounded-xl border border-gray-200 bg-white px-8 py-12 text-center">
                  <h4 className="text-xl font-medium text-gray-900">
                    Our software solutions are being updated.
                  </h4>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
                    Published GreenLunar products will appear here
                    automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            HARDWARE
        ===================================================== */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            {/* Heading */}
            <div className="max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Hardware
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Technology hardware
                <span className="block text-green-600">
                  from trusted global OEMs.
                </span>
              </h2>

              <p className="mt-7 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                We partner with leading Original Equipment Manufacturers around
                the world to source and deliver high-quality technology
                hardware for businesses, institutions and organizations.
              </p>
            </div>

            {/* Hardware Image */}
            <div className="mt-14 overflow-hidden rounded-xl">
              <img
                src="https://res.cloudinary.com/diobpauw/image/upload/v1788870472/alexandre-debieve-FO7JIlwjOtU-unsplash.jpg"
                alt="GreenLunar technology hardware solutions"
                className="h-[380px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[500px] lg:h-[580px]"
              />
            </div>

            {/* Hardware Products */}
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <h3 className="text-2xl font-medium text-gray-900">
                  Smart Boards
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Interactive smart boards available in multiple sizes for
                  classrooms, boardrooms, training facilities, meeting spaces
                  and other professional environments.
                </p>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <h3 className="text-2xl font-medium text-gray-900">
                  Access Control Turnstiles
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Modern turnstile systems designed to help organizations
                  manage controlled access, improve security and monitor
                  movement within facilities.
                </p>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <h3 className="text-2xl font-medium text-gray-900">
                  Boom Barriers
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Automated vehicle access solutions for residential estates,
                  corporate facilities, parking areas and other
                  controlled-entry environments.
                </p>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <h3 className="text-2xl font-medium text-gray-900">
                  CCTV Cameras
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Surveillance and monitoring solutions designed to support
                  security operations across residential, commercial and
                  institutional environments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHY GREENLUNAR TECHNOLOGY
        ===================================================== */}
        <section className="bg-[#063d2b] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Why GreenLunar Technology
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                Global capability.
                <span className="block text-green-400">
                  Nigerian innovation.
                </span>
              </h2>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border-t border-white/10 pt-7">
                <h3 className="text-2xl font-medium text-white">
                  Global Partnerships
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  We work with leading OEMs around the world to bring quality
                  technology hardware to the Nigerian market.
                </p>
              </div>

              <div className="border-t border-white/10 pt-7">
                <h3 className="text-2xl font-medium text-white">
                  Local Innovation
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  Our software products are developed with an understanding of
                  the Nigerian environment, workflows and market.
                </p>
              </div>

              <div className="border-t border-white/10 pt-7">
                <h3 className="text-2xl font-medium text-white">
                  Complete Solutions
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  We bring hardware, software and implementation together to
                  create technology solutions that solve practical problems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-xl bg-[#f7faf8] px-8 py-16 text-center sm:px-12 lg:px-20 lg:py-24">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Partner With Us
              </p>

              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Let&apos;s find the right
                <span className="text-green-600">
                  {" "}
                  technology solution.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
                Whether you need technology hardware, software or a complete
                technology solution, our team is ready to discuss your
                requirements.
              </p>

              <Link
                href="/contact"
                className="mt-10 inline-flex items-center rounded-md bg-green-600 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.20)] transition-all duration-300 hover:bg-green-700 hover:shadow-[0_15px_40px_rgba(22,163,74,0.28)]"
              >
                Contact Us

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
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}