
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { routes } from "@/config/routes";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = products[slug];

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="bg-white">

       <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8 lg:px-10">
        <BackButton /> 
      </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative min-h-[500px] overflow-hidden bg-[#063d2b] sm:min-h-[540px] lg:min-h-[580px]">
     

          <div className="absolute inset-0">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/95 via-[#063d2b]/65 to-transparent" />

          <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-end px-6 pb-14 sm:min-h-[540px] sm:px-8 sm:pb-16 lg:min-h-[580px] lg:px-10 lg:pb-20">

            <div className="max-w-5xl">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                {product.category}
              </p>

              <h1 className="mt-6 text-6xl font-medium leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-9xl">
                {product.name}
              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/75 sm:text-xl">
                {product.tagline}
              </p>

              <Link
                href={routes.contact}
                className="mt-9 inline-flex items-center rounded-md bg-green-600 px-7 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.25)] transition-all duration-300 hover:bg-green-500 hover:shadow-[0_15px_40px_rgba(22,163,74,0.35)]"
              >
                Request a Demo

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


        {/* =====================================================
            INTRODUCTION
        ===================================================== */}

        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">

              <div>

                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  About {product.name}
                </p>

                <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl">
                  Technology designed
                  <span className="block text-green-600">
                    for real-world needs.
                  </span>
                </h2>

              </div>

              <div>

                <p className="text-lg leading-9 text-gray-600">
                  {product.description}
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-3xl">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Key Capabilities
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                Everything you need to
                <span className="text-green-600">
                  {" "}work smarter.
                </span>
              </h2>

            </div>


            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">

              {product.features.map((feature, index) => (

                <div
                  key={feature.title}
                  className="group rounded-xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]"
                >

                  <div className="flex items-start justify-between">

                    <span className="text-sm font-medium text-green-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-green-600 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>

                  </div>

                  <h3 className="mt-8 text-2xl font-medium text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-gray-600">
                    {feature.description}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">

              <div>

                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  How It Works
                </p>

                <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                  From process
                  <span className="block text-green-600">
                    to possibility.
                  </span>
                </h2>

              </div>


              <div className="divide-y divide-gray-200">

                {product.workflow.map((step) => (

                  <div
                    key={step.number}
                    className="grid grid-cols-[70px_1fr] gap-5 py-7"
                  >

                    <span className="text-sm font-medium text-green-600">
                      {step.number}
                    </span>

                    <div>

                      <h3 className="text-xl font-medium text-gray-900">
                        {step.title}
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-7 text-gray-600">
                        {step.description}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            WHO IT IS FOR
        ===================================================== */}

        <section className="bg-[#063d2b] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-3xl">

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                Who It&apos;s For
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
                Built for organizations
                <span className="block text-green-400">
                  that want to move forward.
                </span>
              </h2>

            </div>


            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2 lg:grid-cols-3">

              {product.users.map((user, index) => (

                <div
                  key={user}
                  className="border-t border-white/10 py-6"
                >

                  <div className="flex items-center gap-5">

                    <span className="text-sm text-green-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-base font-medium text-white">
                      {user}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            PRODUCT VISUAL
        ===================================================== */}

        <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="overflow-hidden rounded-xl bg-[#f7faf8]">

              <img
                src={product.image}
                alt={`${product.name} product`}
                className="h-[420px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[550px] lg:h-[650px]"
              />

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
                GreenLunar Technology
              </p>

              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Ready to transform
                <span className="text-green-600">
                  {" "}{product.name}?
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
                Talk to our team about how {product.name} can support
                your organization and help you work more efficiently.
              </p>

              <Link
                href={routes.contact}
                className="mt-10 inline-flex items-center rounded-md bg-green-600 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.25)] transition-all duration-300 hover:bg-green-500 hover:shadow-[0_15px_40px_rgba(22,163,74,0.35)]"
              >
                Request a Demo

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
