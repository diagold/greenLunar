import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { routes } from "@/config/routes";

export default function ConstructionPage() {
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

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative min-h-[500px] overflow-hidden bg-[#063d2b] sm:min-h-[540px] lg:min-h-[580px]">

          {/* Hero Image */}
          <div className="absolute inset-0">
            <img
              src="/images/construction/construction-hero.jpg"
              alt="GreenLunar Construction"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/95 via-[#063d2b]/65 to-transparent" />

          {/* Content */}
          <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-end px-6 pb-14 sm:min-h-[540px] sm:px-8 sm:pb-16 lg:min-h-[580px] lg:px-10 lg:pb-20">

            <div className="max-w-5xl">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                GreenLunar Construction
              </p>

              <h1 className="mt-6 text-5xl font-medium leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-8xl">
                Building spaces.
                <span className="block text-green-400">
                  Creating lasting value.
                </span>
              </h1>

              <p className="mt-8 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
                We deliver construction and infrastructure solutions
                designed around quality, functionality, safety and
                long-term value.
              </p>

              <a
                href={routes.contact}
                className="mt-9 inline-flex items-center rounded-md bg-green-600 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.25)] transition-all duration-300 hover:bg-green-500 hover:shadow-[0_15px_40px_rgba(22,163,74,0.35)]"
              >
                Discuss a Project

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
              </a>

            </div>

          </div>
        </section>

        {/* =====================================================
            INTRODUCTION
        ===================================================== */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  Construction at GreenLunar
                </p>

                <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl">
                  Built with purpose.
                  <span className="block text-green-600">
                    Delivered with discipline.
                  </span>
                </h2>
              </div>

              <div>
                <p className="text-lg leading-9 text-gray-600">
                  GreenLunar Construction delivers building, civil and
                  infrastructure projects with a strong focus on quality,
                  project control and dependable execution.
                </p>

                <p className="mt-6 text-lg leading-9 text-gray-600">
                  Our approach combines planning, technical expertise,
                  construction management and practical execution to
                  create spaces and infrastructure that meet the needs of
                  businesses, institutions and communities.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            WHAT WE DO
        ===================================================== */}
        <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-4xl">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                What We Do
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Construction solutions
                <span className="block text-green-600">
                  from concept to completion.
                </span>
              </h2>

              <p className="mt-7 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                We provide construction services across key project stages,
                supporting clients from early planning through execution,
                delivery and ongoing improvement.
              </p>

            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

              {/* Building Construction */}
              <div className="group rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">
                  01
                </span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Building Construction
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Residential, commercial and institutional building
                  projects delivered with attention to quality,
                  functionality and durability.
                </p>
              </div>

              {/* Civil & Infrastructure */}
              <div className="group rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">
                  02
                </span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Civil & Infrastructure
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Infrastructure works that support access, utilities,
                  development and the effective use of built environments.
                </p>
              </div>

              {/* Renovation */}
              <div className="group rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">
                  03
                </span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Renovation & Development
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Upgrade, rehabilitation and redevelopment services
                  focused on improving existing spaces and extending
                  asset value.
                </p>
              </div>

              {/* Project Management */}
              <div className="group rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                <span className="text-sm font-medium text-green-600">
                  04
                </span>

                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  Project Management
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Structured coordination of project scope, resources,
                  timelines, quality and delivery from initiation through
                  completion.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            OUR APPROACH
        ===================================================== */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  Our Approach
                </p>

                <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                  A disciplined
                  <span className="block text-green-600">
                    path to delivery.
                  </span>
                </h2>

                <p className="mt-6 text-base leading-8 text-gray-600">
                  We approach every project with clear planning,
                  accountability and a focus on delivering practical
                  results.
                </p>
              </div>

              <div className="divide-y divide-gray-200">

                <div className="grid grid-cols-[70px_1fr] gap-5 py-7">
                  <span className="text-sm font-medium text-green-600">
                    01
                  </span>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Planning
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600">
                      We define project requirements, scope, resources and
                      execution priorities before work begins.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[70px_1fr] gap-5 py-7">
                  <span className="text-sm font-medium text-green-600">
                    02
                  </span>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Execution
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600">
                      Projects are executed through coordinated teams,
                      suppliers, contractors and project controls.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[70px_1fr] gap-5 py-7">
                  <span className="text-sm font-medium text-green-600">
                    03
                  </span>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Quality
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600">
                      Quality, safety and workmanship are monitored
                      throughout project execution.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[70px_1fr] gap-5 py-7">
                  <span className="text-sm font-medium text-green-600">
                    04
                  </span>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Delivery
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600">
                      We focus on completing projects in line with agreed
                      scope, expectations and operational requirements.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            PROJECTS
        ===================================================== */}
        <section className="bg-[#063d2b] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-3xl">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Our Projects
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                Building with
                <span className="text-green-400">
                  {" "}purpose.
                </span>
              </h2>

              <p className="mt-6 text-base leading-8 text-white/60 sm:text-lg">
                A selection of construction and infrastructure projects
                delivered across our areas of operation.
              </p>

            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {/* Project 1 */}
              <div className="group overflow-hidden rounded-xl bg-white/5">
                <div className="overflow-hidden">
                  <img
                    src="/images/construction/project-1.jpg"
                    alt="GreenLunar construction project"
                    className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
                    Construction
                  </p>

                  <h3 className="mt-3 text-xl font-medium text-white">
                    Building Development
                  </h3>
                </div>
              </div>

              {/* Project 2 */}
              <div className="group overflow-hidden rounded-xl bg-white/5">
                <div className="overflow-hidden">
                  <img
                    src="/images/construction/project-2.jpg"
                    alt="GreenLunar infrastructure project"
                    className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
                    Infrastructure
                  </p>

                  <h3 className="mt-3 text-xl font-medium text-white">
                    Infrastructure Development
                  </h3>
                </div>
              </div>

              {/* Project 3 */}
              <div className="group overflow-hidden rounded-xl bg-white/5">
                <div className="overflow-hidden">
                  <img
                    src="/images/construction/project-3.jpg"
                    alt="GreenLunar renovation project"
                    className="h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-400">
                    Development
                  </p>

                  <h3 className="mt-3 text-xl font-medium text-white">
                    Renovation & Redevelopment
                  </h3>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            WHY GREENLUNAR
        ===================================================== */}
        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-3xl">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Why GreenLunar Construction
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Built around
                <span className="text-green-600">
                  {" "}quality and trust.
                </span>
              </h2>

            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">

              <div className="border-t border-gray-200 pt-7">
                <span className="text-sm text-green-600">
                  01
                </span>

                <h3 className="mt-5 text-2xl font-medium text-gray-900">
                  Quality Delivery
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  We focus on workmanship, materials and execution that
                  support long-term project value.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-7">
                <span className="text-sm text-green-600">
                  02
                </span>

                <h3 className="mt-5 text-2xl font-medium text-gray-900">
                  Strong Project Control
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Planning, coordination and project oversight help keep
                  delivery aligned with agreed objectives.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-7">
                <span className="text-sm text-green-600">
                  03
                </span>

                <h3 className="mt-5 text-2xl font-medium text-gray-900">
                  Practical Solutions
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  We design and execute projects around the practical
                  requirements of clients and end users.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}
        <section className="px-6 pb-24 sm:px-8 lg:px-10 lg:pb-32">

          <div className="mx-auto max-w-7xl">

            <div className="rounded-xl bg-[#f7faf8] px-8 py-16 text-center sm:px-12 lg:px-20 lg:py-24">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Let&apos;s Build Together
              </p>

              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Have a construction
                <span className="text-green-600">
                  {" "}project in mind?
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
                Talk to our team about your construction, development
                or infrastructure requirements.
              </p>

              <a
                href={routes.contact}
                className="mt-10 inline-flex items-center rounded-md bg-green-600 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.20)] transition-all duration-300 hover:bg-green-500 hover:shadow-[0_15px_40px_rgba(22,163,74,0.28)]"
              >
                Discuss Your Project

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
              </a>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}