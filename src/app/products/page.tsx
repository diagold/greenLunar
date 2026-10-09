import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
} from "lucide-react";

import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/types/product";

/*
|--------------------------------------------------------------------------
| Revalidation
|--------------------------------------------------------------------------
|
| Public product pages are refreshed from Supabase every 60 seconds.
|
*/

export const revalidate = 60;


/*
|--------------------------------------------------------------------------
| Page Props
|--------------------------------------------------------------------------
*/

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


/*
|--------------------------------------------------------------------------
| Product Page
|--------------------------------------------------------------------------
*/

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const supabase = createPublicClient();

  /*
  |--------------------------------------------------------------------------
  | Get Product
  |--------------------------------------------------------------------------
  |
  | Only published products are accessible publicly.
  |
  */

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load product:",
      error
    );
  }

  if (!data) {
    notFound();
  }

  const product = data as Product;


  /*
  |--------------------------------------------------------------------------
  | Clean CMS Content
  |--------------------------------------------------------------------------
  */

  const features = Array.isArray(product.features)
    ? product.features.filter(
        (feature) =>
          feature?.title ||
          feature?.description
      )
    : [];

  const benefits = Array.isArray(product.benefits)
    ? product.benefits.filter(
        (benefit) =>
          benefit?.title ||
          benefit?.description
      )
    : [];


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-white">

      {/* ============================================================= */}
      {/* HERO SECTION */}
      {/* ============================================================= */}

      <section className="relative overflow-hidden bg-[#073f30] px-6 pb-20 pt-32 text-white">

        {/* Decorative background */}

        <div className="pointer-events-none absolute inset-0">

          <div
            className="
              absolute -right-32 -top-32
              h-[500px] w-[500px]
              rounded-full
              bg-green-400/10
              blur-3xl
            "
          />

          <div
            className="
              absolute -bottom-40 -left-40
              h-[500px] w-[500px]
              rounded-full
              bg-green-300/5
              blur-3xl
            "
          />

        </div>


        <div className="relative mx-auto max-w-7xl">

          {/* Back Link */}

          <Link
            href="/products"
            className="
              inline-flex items-center gap-2
              text-sm font-medium
              text-green-100
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={17} />

            All Products
          </Link>


          <div
            className="
              mt-12 grid gap-12
              lg:grid-cols-2
              lg:items-center
            "
          >

            {/* Product Information */}

            <div>

              {product.category && (
                <p
                  className="
                    text-sm font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-green-300
                  "
                >
                  {product.category}
                </p>
              )}


              <h1
                className="
                  mt-4 max-w-2xl
                  text-4xl font-bold
                  leading-tight
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {product.name}
              </h1>


              {product.short_description && (
                <p
                  className="
                    mt-6 max-w-xl
                    text-base leading-8
                    text-green-50/80
                    sm:text-lg
                  "
                >
                  {product.short_description}
                </p>
              )}


              {/* Hero Buttons */}

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  href="/contact"
                  className="
                    inline-flex items-center
                    justify-center gap-2
                    rounded-xl
                    bg-white
                    px-5 py-3
                    text-sm font-bold
                    text-[#073f30]
                    transition
                    hover:bg-green-50
                  "
                >
                  Request a Demo

                  <ArrowRight size={17} />
                </Link>


                <Link
                  href="#overview"
                  className="
                    inline-flex items-center
                    justify-center gap-2
                    rounded-xl
                    border border-white/20
                    bg-white/5
                    px-5 py-3
                    text-sm font-semibold
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  Learn More
                </Link>

              </div>

            </div>


            {/* Product Image */}

            <div
              className="
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-white/5
                shadow-2xl
              "
            >

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="
                    aspect-[4/3]
                    h-full w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex aspect-[4/3]
                    items-center
                    justify-center
                    text-white/20
                  "
                >
                  <Package size={70} />
                </div>
              )}

            </div>

          </div>

        </div>

      </section>



      {/* ============================================================= */}
      {/* PRODUCT OVERVIEW */}
      {/* ============================================================= */}

      <section
        id="overview"
        className="scroll-mt-28 px-6 py-20"
      >

        <div
          className="
            mx-auto grid
            max-w-7xl
            gap-12
            lg:grid-cols-[1fr_320px]
          "
        >

          {/* Main Content */}

          <div>

            <div>

              <p
                className="
                  text-sm font-semibold
                  uppercase tracking-wider
                  text-[#073f30]
                "
              >
                About the Product
              </p>


              <h2
                className="
                  mt-3
                  text-3xl font-bold
                  text-gray-900
                  sm:text-4xl
                "
              >
                Built for better operations
              </h2>


              <div
                className="
                  mt-7
                  whitespace-pre-line
                  text-base leading-8
                  text-gray-600
                "
              >
                {product.description ||
                  product.short_description ||
                  "Additional product information will be available soon."}
              </div>

            </div>



            {/* ========================================================= */}
            {/* FEATURES */}
            {/* ========================================================= */}

            {features.length > 0 && (
              <section className="mt-20">

                <div className="max-w-2xl">

                  <p
                    className="
                      text-sm font-semibold
                      uppercase tracking-wider
                      text-[#073f30]
                    "
                  >
                    Key Features
                  </p>


                  <h2
                    className="
                      mt-3
                      text-3xl font-bold
                      text-gray-900
                    "
                  >
                    Powerful capabilities built in
                  </h2>


                  <p
                    className="
                      mt-4
                      text-base leading-7
                      text-gray-500
                    "
                  >
                    Explore the core capabilities
                    designed to support efficient
                    operations and better service
                    delivery.
                  </p>

                </div>


                <div
                  className="
                    mt-8 grid gap-5
                    sm:grid-cols-2
                  "
                >

                  {features.map(
                    (feature, index) => (
                      <div
                        key={`${feature.title}-${index}`}
                        className="
                          group
                          rounded-2xl
                          border border-gray-200
                          bg-white p-6
                          shadow-sm
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:border-green-200
                          hover:shadow-lg
                        "
                      >

                        <div
                          className="
                            flex h-11 w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-green-50
                            text-sm font-bold
                            text-[#073f30]
                            transition
                            group-hover:bg-[#073f30]
                            group-hover:text-white
                          "
                        >
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>


                        {feature.title && (
                          <h3
                            className="
                              mt-5
                              text-lg font-bold
                              text-gray-900
                            "
                          >
                            {feature.title}
                          </h3>
                        )}


                        {feature.description && (
                          <p
                            className="
                              mt-2
                              text-sm leading-6
                              text-gray-500
                            "
                          >
                            {feature.description}
                          </p>
                        )}

                      </div>
                    )
                  )}

                </div>

              </section>
            )}



            {/* ========================================================= */}
            {/* BENEFITS */}
            {/* ========================================================= */}

            {benefits.length > 0 && (
              <section
                className="
                  mt-20
                  overflow-hidden
                  rounded-3xl
                  bg-[#073f30]
                  p-8 text-white
                  sm:p-10
                "
              >

                <div className="max-w-2xl">

                  <p
                    className="
                      text-sm font-semibold
                      uppercase tracking-wider
                      text-green-300
                    "
                  >
                    Benefits
                  </p>


                  <h2
                    className="
                      mt-3
                      text-3xl font-bold
                    "
                  >
                    Why organisations choose this
                    solution
                  </h2>


                  <p
                    className="
                      mt-4
                      text-sm leading-7
                      text-green-50/70
                    "
                  >
                    Designed to deliver measurable
                    improvements across operations,
                    efficiency and service delivery.
                  </p>

                </div>


                <div
                  className="
                    mt-10 grid gap-5
                    sm:grid-cols-2
                  "
                >

                  {benefits.map(
                    (benefit, index) => (
                      <div
                        key={`${benefit.title}-${index}`}
                        className="
                          rounded-2xl
                          border border-white/10
                          bg-white/5
                          p-5
                        "
                      >

                        <div className="flex items-start gap-4">

                          <div
                            className="
                              flex h-9 w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-green-300
                              text-[#073f30]
                            "
                          >
                            <Check size={17} />
                          </div>


                          <div>

                            {benefit.title && (
                              <h3 className="font-bold text-white">
                                {benefit.title}
                              </h3>
                            )}


                            {benefit.description && (
                              <p
                                className="
                                  mt-2
                                  text-sm leading-6
                                  text-green-50/70
                                "
                              >
                                {benefit.description}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </section>
            )}

          </div>



          {/* =========================================================== */}
          {/* SIDEBAR */}
          {/* =========================================================== */}

          <aside>

            <div
              className="
                sticky top-28
                rounded-2xl
                border border-gray-100
                bg-gray-50
                p-6
              "
            >

              <p
                className="
                  text-sm font-semibold
                  text-gray-500
                "
              >
                Interested in this solution?
              </p>


              <h3
                className="
                  mt-2
                  text-xl font-bold
                  text-gray-900
                "
              >
                Talk to Green Lunar
              </h3>


              <p
                className="
                  mt-3
                  text-sm leading-6
                  text-gray-500
                "
              >
                Speak with our team about
                demonstrations, implementation,
                integration and deployment
                requirements.
              </p>


              <Link
                href="/contact"
                className="
                  mt-6 flex w-full
                  items-center
                  justify-center gap-2
                  rounded-xl
                  bg-[#073f30]
                  px-4 py-3
                  text-sm font-semibold
                  text-white
                  transition
                  hover:bg-[#09543f]
                "
              >
                Contact Us

                <ArrowRight size={16} />
              </Link>


              <div className="my-6 border-t border-gray-200" />


              <div className="space-y-4">

                {product.category && (
                  <div>

                    <p
                      className="
                        text-xs font-semibold
                        uppercase tracking-wider
                        text-gray-400
                      "
                    >
                      Category
                    </p>

                    <p
                      className="
                        mt-1 text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      {product.category}
                    </p>

                  </div>
                )}


                <div>

                  <p
                    className="
                      text-xs font-semibold
                      uppercase tracking-wider
                      text-gray-400
                    "
                  >
                    Product
                  </p>

                  <p
                    className="
                      mt-1 text-sm
                      font-semibold
                      text-gray-700
                    "
                  >
                    {product.name}
                  </p>

                </div>


                <div>

                  <p
                    className="
                      text-xs font-semibold
                      uppercase tracking-wider
                      text-gray-400
                    "
                  >
                    Provider
                  </p>

                  <p
                    className="
                      mt-1 text-sm
                      font-semibold
                      text-gray-700
                    "
                  >
                    Green Lunar Nigeria Limited
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>



      {/* ============================================================= */}
      {/* FINAL CTA */}
      {/* ============================================================= */}

      <section className="px-6 pb-20">

        <div
          className="
            mx-auto max-w-7xl
            overflow-hidden
            rounded-3xl
            bg-gray-100
            px-6 py-12
            sm:px-10
            lg:flex
            lg:items-center
            lg:justify-between
            lg:px-14
          "
        >

          <div className="max-w-2xl">

            <p
              className="
                text-sm font-semibold
                uppercase tracking-wider
                text-[#073f30]
              "
            >
              Get Started
            </p>


            <h2
              className="
                mt-3
                text-3xl font-bold
                text-gray-900
              "
            >
              Ready to explore {product.name}?
            </h2>


            <p
              className="
                mt-4
                text-base leading-7
                text-gray-500
              "
            >
              Contact our team to discuss your
              requirements and learn how this
              solution can be deployed within
              your organisation.
            </p>

          </div>


          <div className="mt-8 shrink-0 lg:ml-10 lg:mt-0">

            <Link
              href="/contact"
              className="
                inline-flex items-center
                justify-center gap-2
                rounded-xl
                bg-[#073f30]
                px-6 py-3.5
                text-sm font-bold
                text-white
                transition
                hover:bg-[#09543f]
              "
            >
              Request a Demo

              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}