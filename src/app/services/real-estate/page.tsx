import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { routes } from "@/config/routes";

export default function RealEstatePage() {
  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* Back Button */}
        <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8 lg:px-10">
          <BackButton
            fallback={routes.services.all}
            label="Back to Services"
          />
        </div>

        {/* HERO */}
        <section className="relative min-h-[500px] overflow-hidden bg-[#063d2b] sm:min-h-[540px] lg:min-h-[580px]">
          <div className="absolute inset-0">
            <img
              src="/images/real-estate/real-estate-hero.jpg"
              alt="GreenLunar Real Estate"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/95 via-[#063d2b]/65 to-transparent" />

          <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-end px-6 pb-14 sm:min-h-[540px] sm:px-8 sm:pb-16 lg:min-h-[580px] lg:px-10 lg:pb-20">
            <div className="max-w-5xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                GreenLunar Real Estate
              </p>

              <h1 className="mt-6 text-5xl font-medium leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-8xl">
                Creating spaces.
                <span className="block text-green-400">
                  Building long-term value.
                </span>
              </h1>

              <p className="mt-8 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
                We develop, manage and support real estate opportunities
                designed to create functional spaces, sustainable value and
                lasting investment potential.
              </p>

              <a
                href={routes.contact}
                className="mt-9 inline-flex items-center rounded-md bg-green-600 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.25)] transition-all duration-300 hover:bg-green-500"
              >
                Discuss a Property Opportunity
              </a>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  Real Estate at GreenLunar
                </p>

                <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl">
                  Property solutions
                  <span className="block text-green-600">
                    built around value.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-lg leading-9 text-gray-600">
                  GreenLunar Real Estate focuses on identifying, developing
                  and managing property opportunities that respond to the
                  needs of individuals, businesses and investors.
                </p>

                <p className="mt-6 text-lg leading-9 text-gray-600">
                  Our approach combines market insight, practical development,
                  asset management and a long-term view of property value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                What We Do
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Real estate solutions
                <span className="block text-green-600">
                  across the property lifecycle.
                </span>
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">01</span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Property Development
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Development of residential, commercial and mixed-use
                  properties designed around functionality and long-term value.
                </p>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">02</span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Property Investment
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Identification and evaluation of real estate opportunities
                  with potential for sustainable returns and asset growth.
                </p>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">03</span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Property Management
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Management support for property operations, maintenance,
                  tenant coordination and long-term asset performance.
                </p>
              </div>

              <div className="rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">04</span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Advisory & Development Support
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Practical support across property planning, feasibility,
                  development coordination and asset positioning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROPERTY CATEGORIES */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Property Focus
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Spaces designed for
                <span className="text-green-600"> different needs.</span>
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group overflow-hidden rounded-xl bg-white shadow-[0_12px_35px_rgba(0,0,0,0.07)]">
                <div className="overflow-hidden">
                  <img
                    src="/images/real-estate/residential.jpg"
                    alt="Residential property"
                    className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-medium text-gray-900">
                    Residential
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Homes and residential developments designed around
                    comfort, functionality and long-term liveability.
                  </p>
                </div>
              </div>

              <div className="group overflow-hidden rounded-xl bg-white shadow-[0_12px_35px_rgba(0,0,0,0.07)]">
                <div className="overflow-hidden">
                  <img
                    src="/images/real-estate/commercial.jpg"
                    alt="Commercial property"
                    className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-medium text-gray-900">
                    Commercial
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Business and commercial spaces designed to support
                    productivity, accessibility and enterprise growth.
                  </p>
                </div>
              </div>

              <div className="group overflow-hidden rounded-xl bg-white shadow-[0_12px_35px_rgba(0,0,0,0.07)]">
                <div className="overflow-hidden">
                  <img
                    src="/images/real-estate/mixed-use.jpg"
                    alt="Mixed-use property development"
                    className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-medium text-gray-900">
                    Mixed-Use Development
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    Integrated property developments that bring residential,
                    commercial and lifestyle functions together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR APPROACH */}
        <section className="bg-[#063d2b] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Our Approach
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                From opportunity
                <span className="text-green-400"> to lasting asset.</span>
              </h2>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-[#063d2b] p-8">
                <span className="text-sm text-green-400">01</span>
                <h3 className="mt-5 text-xl font-medium text-white">
                  Identify
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  We assess locations, property opportunities and market needs.
                </p>
              </div>

              <div className="bg-[#063d2b] p-8">
                <span className="text-sm text-green-400">02</span>
                <h3 className="mt-5 text-xl font-medium text-white">
                  Plan
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  We define the property concept, investment case and
                  development priorities.
                </p>
              </div>

              <div className="bg-[#063d2b] p-8">
                <span className="text-sm text-green-400">03</span>
                <h3 className="mt-5 text-xl font-medium text-white">
                  Develop
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  Projects are coordinated with a focus on quality,
                  functionality and value.
                </p>
              </div>

              <div className="bg-[#063d2b] p-8">
                <span className="text-sm text-green-400">04</span>
                <h3 className="mt-5 text-xl font-medium text-white">
                  Manage
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  We support the ongoing performance, maintenance and value of
                  the asset.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY GREENLUNAR */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Why GreenLunar Real Estate
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Property decisions guided by
                <span className="text-green-600"> long-term thinking.</span>
              </h2>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="border-t border-gray-200 pt-7">
                <h3 className="text-2xl font-medium text-gray-900">
                  Market Understanding
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  We approach property opportunities with consideration for
                  location, demand, usability and investment potential.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-7">
                <h3 className="text-2xl font-medium text-gray-900">
                  Integrated Delivery
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Our real estate capabilities can work alongside GreenLunar
                  Construction to support property development from planning
                  through execution.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-7">
                <h3 className="text-2xl font-medium text-gray-900">
                  Sustainable Value
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  We focus on creating assets that remain practical, relevant
                  and valuable over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-xl bg-[#ecfdf5] px-8 py-16 text-center sm:px-12 lg:px-20 lg:py-24">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Real Estate Opportunities
              </p>

              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Let&apos;s create
                <span className="text-green-600"> lasting property value.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600">
                Talk to GreenLunar about property development, investment,
                management or partnership opportunities.
              </p>

              <a
                href={routes.contact}
                className="mt-10 inline-flex items-center rounded-md bg-[#063d2b] px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-green-700"
              >
                Talk to Our Team
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}