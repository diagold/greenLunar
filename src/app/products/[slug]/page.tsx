import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Package,
} from "lucide-react";

import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


/* -------------------------------------------------------------------------- */
/* Revalidation                                                               */
/* -------------------------------------------------------------------------- */

export const revalidate = 60;


/* -------------------------------------------------------------------------- */
/* Page Props                                                                 */
/* -------------------------------------------------------------------------- */

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


/* -------------------------------------------------------------------------- */
/* Metadata                                                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = createPublicClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      name,
      slug,
      short_description,
      image_url,
      seo_title,
      seo_description,
      seo_keywords,
      seo_image_url
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load product metadata:",
      error
    );
  }

  if (!product) {
    return {
      title: "Product | Green Lunar",
      description:
        "Explore Green Lunar technology solutions.",
    };
  }

  const title =
    product.seo_title?.trim() ||
    `${product.name} | Green Lunar`;

  const description =
    product.seo_description?.trim() ||
    product.short_description?.trim() ||
    `Learn more about ${product.name} from Green Lunar Nigeria Limited.`;

  const socialImage =
    product.seo_image_url?.trim() ||
    product.image_url?.trim() ||
    undefined;

  const keywords = product.seo_keywords
    ? product.seo_keywords
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
              alt: product.name,
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


/* -------------------------------------------------------------------------- */
/* Product Page                                                               */
/* -------------------------------------------------------------------------- */

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const supabase = createPublicClient();


  /* ------------------------------------------------------------------------ */
  /* Load Product                                                             */
  /* ------------------------------------------------------------------------ */

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load product:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );
  }

  if (!data) {
    notFound();
  }

  const product = data as Product;


  /* ------------------------------------------------------------------------ */
  /* Clean Features                                                           */
  /* ------------------------------------------------------------------------ */

  const features = Array.isArray(product.features)
    ? product.features.filter(
        (feature) =>
          feature &&
          (
            feature.title?.trim() ||
            feature.description?.trim()
          )
      )
    : [];


  /* ------------------------------------------------------------------------ */
  /* Clean Benefits                                                           */
  /* ------------------------------------------------------------------------ */

  const benefits = Array.isArray(product.benefits)
    ? product.benefits.filter(
        (benefit) =>
          benefit &&
          (
            benefit.title?.trim() ||
            benefit.description?.trim()
          )
      )
    : [];


  /* ------------------------------------------------------------------------ */
  /* Clean Gallery                                                            */
  /* ------------------------------------------------------------------------ */

  const gallery = Array.isArray(product.gallery)
    ? product.gallery.filter(
        (image) =>
          image &&
          typeof image.url === "string" &&
          image.url.trim()
      )
    : [];


  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
    <Navbar/>
      <main className="min-h-screen bg-white">

        {/* ================================================================== */}
        {/* HERO                                                               */}
        {/* ================================================================== */}


        <section
      className="
        relative
        min-h-[500px]
        overflow-hidden
        bg-[#073f30]
        text-white
        lg:min-h-[540px]
      "
    >
      {/* ================================================================ */}
      {/* BACKGROUND IMAGE                                                 */}
      {/* ================================================================ */}

      {product.image_url ? (
        <img
          src={product.image_url}
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
        />
      ) : (
        <div
          className="
            absolute
            inset-0
            bg-[#073f30]
          "
        />
      )}


      {/* ================================================================ */}
      {/* DARK / GREEN OVERLAY                                             */}
      {/* ================================================================ */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-[#032f24]/95
          via-[#073f30]/80
          to-black/25
        "
      />


      {/* Extra bottom gradient for readability */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/30
          via-transparent
          to-black/10
        "
      />


      {/* ================================================================ */}
      {/* CONTENT                                                          */}
      {/* ================================================================ */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[500px]
          max-w-7xl
          flex-col
          px-6
          pb-14
          pt-28
          lg:min-h-[540px]
          lg:px-8
          lg:pb-16
          lg:pt-32
        "
      >
        {/* Back to Products */}

        <Link
          href="/products"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            text-sm
            font-medium
            text-white/80
            transition
            hover:text-white
          "
        >
          <ArrowLeft
            size={17}
          />

          All Products
        </Link>


        {/* Main Hero Content */}

        <div
          className="
            flex
            flex-1
            items-center
          "
        >
          <div
            className="
              max-w-3xl
              py-8
              lg:max-w-2xl
            "
          >
            {/* Category */}

            {product.category && (
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-green-200
                    sm:text-sm
                  "
                >
                  {product.category}
                </span>

                <span
                  className="
                    h-px
                    w-12
                    bg-green-200/60
                  "
                />
              </div>
            )}


            {/* Product Name */}

            <h1
              className="
                max-w-3xl
                text-4xl
                font-bold
                leading-[1.05]
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              {product.name}
            </h1>


            {/* Short Description */}

            {product.short_description && (
              <p
                className="
                  mt-5
                  max-w-2xl
                  text-base
                  leading-7
                  text-white/85
                  sm:text-lg
                  sm:leading-8
                "
              >
                {product.short_description}
              </p>
            )}


            {/* Buttons */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-3
              "
            >
              <Link
                href="/contact"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#073f30]
                  shadow-lg
                  shadow-black/10
                  transition
                  hover:bg-green-50
                "
              >
                Request a Demo

                <ArrowRight
                  size={17}
                />
              </Link>


              <Link
                href="#overview"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-white/50
                  bg-white/5
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  backdrop-blur-sm
                  transition
                  hover:border-white
                  hover:bg-white/10
                    "
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================================================================== */}
        {/* OVERVIEW + CONTENT + SIDEBAR                                       */}
        {/* ================================================================== */}

        <section
          id="overview"
          className="
            scroll-mt-28
            px-6
            py-20
          "
        >

          <div
            className="
              mx-auto
              grid
              max-w-7xl
              gap-12
              lg:grid-cols-[minmax(0,1fr)_320px]
            "
          >

            {/* ============================================================ */}
            {/* MAIN COLUMN                                                  */}
            {/* ============================================================ */}

            <div className="min-w-0">


              {/* ---------------------------------------------------------- */}
              {/* OVERVIEW                                                   */}
              {/* ---------------------------------------------------------- */}

              <section>

                <p
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#073f30]
                  "
                >
                  About the Product
                </p>


                <h2
                  className="
                    mt-3
                    text-3xl
                    font-bold
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
                    text-base
                    leading-8
                    text-gray-600
                  "
                >
                  {product.description ||
                    product.short_description ||
                    "Additional product information will be available soon."}
                </div>

              </section>


              {/* ---------------------------------------------------------- */}
              {/* FEATURES                                                   */}
              {/* ---------------------------------------------------------- */}

              {features.length > 0 && (
                <section className="mt-20">

                  <div className="max-w-2xl">

                    <p
                      className="
                        text-sm
                        font-semibold
                        uppercase
                        tracking-wider
                        text-[#073f30]
                      "
                    >
                      Key Features
                    </p>


                    <h2
                      className="
                        mt-3
                        text-3xl
                        font-bold
                        text-gray-900
                      "
                    >
                      Powerful capabilities built in
                    </h2>


                    <p
                      className="
                        mt-4
                        text-base
                        leading-7
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
                    mt-10
                    grid
                    justify-center
                    gap-5
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="
                        group
                        mx-auto
                        flex
                        w-full
                        max-w-[340px]
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-5
                        py-5
                        text-center
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-green-200
                        hover:shadow-md
                      "
                    >
                      <div
                        className="
                          mb-3
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          bg-green-50
                          text-[#073f30]
                          transition
                          duration-300
                          group-hover:bg-[#073f30]
                          group-hover:text-white
                        "
                      >
                        <CheckCircle2 size={20} />
                      </div>

                      <h3 className="text-base font-semibold text-gray-900">
                        {feature.title}
                      </h3>

                      {feature.description && (
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                </section>
              )}


              {/* ---------------------------------------------------------- */}
              {/* BENEFITS                                                   */}
              {/* ---------------------------------------------------------- */}

              {benefits.length > 0 && (
                <section
                  className="
                    mt-20
                    overflow-hidden
                    rounded-3xl
                    bg-[#073f30]
                    p-8
                    text-white
                    sm:p-10
                  "
                >

                  <div className="max-w-2xl">

                    <p
                      className="
                        text-sm
                        font-semibold
                        uppercase
                        tracking-wider
                        text-green-300
                      "
                    >
                      Benefits
                    </p>


                    <h2
                      className="
                        mt-3
                        text-3xl
                        font-bold
                      "
                    >
                      Why organisations choose this solution
                    </h2>


                    <p
                      className="
                        mt-4
                        text-sm
                        leading-7
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
                      mt-10
                      grid
                      gap-5
                      sm:grid-cols-2
                    "
                  >

                    {benefits.map(
                      (benefit, index) => (
                        <article
                          key={`${benefit.title}-${index}`}
                          className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/5
                            p-5
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              gap-4
                            "
                          >

                            <div
                              className="
                                flex
                                h-9
                                w-9
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
                                <h3
                                  className="
                                    font-bold
                                    text-white
                                  "
                                >
                                  {benefit.title}
                                </h3>
                              )}


                              {benefit.description && (
                                <p
                                  className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-green-50/70
                                  "
                                >
                                  {benefit.description}
                                </p>
                              )}

                            </div>

                          </div>

                        </article>
                      )
                    )}

                  </div>

                </section>
              )}


              {/* ---------------------------------------------------------- */}
              {/* PRODUCT GALLERY                                            */}
              {/* ---------------------------------------------------------- */}

              {gallery.length > 0 && (
                <section className="mt-20">

                  <div className="max-w-2xl">

                    <p
                      className="
                        text-sm
                        font-semibold
                        uppercase
                        tracking-wider
                        text-[#073f30]
                      "
                    >
                      Product Gallery
                    </p>


                    <h2
                      className="
                        mt-3
                        text-3xl
                        font-bold
                        text-gray-900
                      "
                    >
                      See the solution in action
                    </h2>


                    <p
                      className="
                        mt-4
                        text-base
                        leading-7
                        text-gray-500
                      "
                    >
                      Explore screenshots and visual
                      highlights from {product.name}.
                    </p>

                  </div>


                  <div
                    className="
                      mt-8
                      grid
                      gap-5
                      sm:grid-cols-2
                    "
                  >

                    {gallery.map(
                      (image, index) => (
                        <figure
                          key={`${image.url}-${index}`}
                          className="
                            group
                            overflow-hidden
                            rounded-2xl
                            border
                            border-gray-200
                            bg-gray-50
                            shadow-sm
                          "
                        >

                          <div className="overflow-hidden">

                            <img
                              src={image.url}
                              alt={
                                image.alt ||
                                `${product.name} screenshot ${index + 1}`
                              }
                              className="
                                aspect-video
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-[1.03]
                              "
                            />

                          </div>


                          {image.alt && (
                            <figcaption
                              className="
                                border-t
                                border-gray-100
                                bg-white
                                px-4
                                py-3
                                text-sm
                                text-gray-500
                              "
                            >
                              {image.alt}
                            </figcaption>
                          )}

                        </figure>
                      )
                    )}

                  </div>

                </section>
              )}

            </div>


            {/* ============================================================ */}
            {/* SIDEBAR                                                      */}
            {/* ============================================================ */}

            <aside>

              <div
                className="
                  sticky
                  top-28
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50
                  p-6
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  Interested in this solution?
                </p>


                <h3
                  className="
                    mt-2
                    text-xl
                    font-bold
                    text-gray-900
                  "
                >
                  Talk to Green Lunar
                </h3>


                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
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
                    mt-6
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#073f30]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#09543f]
                  "
                >
                  Request a Demo

                  <ArrowRight size={16} />
                </Link>


                <div
                  className="
                    my-6
                    border-t
                    border-gray-200
                  "
                />


                <div className="space-y-5">

                  {product.category && (
                    <div>

                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-400
                        "
                      >
                        Category
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
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
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Product
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
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
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Provider
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
                      Green Lunar Nigeria Limited
                    </p>

                  </div>


                  <div>

                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Availability
                    </p>

                    <div
                      className="
                        mt-2
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-green-100
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-green-800
                      "
                    >
                      <span
                        className="
                          h-2
                          w-2
                          rounded-full
                          bg-green-600
                        "
                      />

                      Available
                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </section>


        {/* ================================================================== */}
        {/* FINAL REQUEST DEMO CTA                                             */}
        {/* ================================================================== */}

        <section
          className="
            px-6
            pb-20
          "
        >

          <div
            className="
              relative
              mx-auto
              max-w-7xl
              overflow-hidden
              rounded-3xl
              bg-[#073f30]
              px-6
              py-12
              text-white
              sm:px-10
              lg:flex
              lg:items-center
              lg:justify-between
              lg:px-14
              lg:py-14
            "
          >

            {/* CTA decoration */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-green-300/10
                blur-3xl
              "
            />


            <div
              className="
                relative
                max-w-2xl
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  text-green-300
                "
              >
                Get Started
              </p>


              <h2
                className="
                  mt-3
                  text-3xl
                  font-bold
                  sm:text-4xl
                "
              >
                Ready to explore {product.name}?
              </h2>


              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-green-50/75
                "
              >
                Contact our team to discuss your
                requirements and learn how{" "}
                {product.name} can be deployed
                within your organisation.
              </p>

            </div>


            <div
              className="
                relative
                mt-8
                shrink-0
                lg:ml-10
                lg:mt-0
              "
            >

              <Link
                href="/contact"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-bold
                  text-[#073f30]
                  transition
                  hover:bg-green-50
                "
              >
                Request a Demo

                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

        </section>

      </main>
    <Footer/>
    </>
  );
}