"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

import type { NewsArticle } from "@/types/news";

interface NewsPageContentProps {
  articles: NewsArticle[];
}

export default function NewsPageContent({
  articles,
}: NewsPageContentProps) {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(articles.map((article) => article.category))
    ),
  ];

  const featuredArticle =
    articles.find((article) => article.featured) ??
    articles[0] ??
    null;

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") {
      return articles;
    }

    return articles.filter(
      (article) =>
        article.category === activeCategory
    );
  }, [activeCategory, articles]);

  return (
    <>
      <Navbar />

      <main className="bg-white">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden bg-[#063d2b]">
          <div
            className="
              absolute
              -right-32
              -top-32
              h-[420px]
              w-[420px]
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-40
              left-20
              h-[360px]
              w-[360px]
              rounded-full
              bg-white/[0.03]
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-7xl
              px-6
              pb-20
              pt-32
              sm:px-8
              lg:px-10
              lg:pb-24
              lg:pt-36
            "
          >
            <BackButton
              fallback="/"
              label="Back"
            />

            <div className="mt-12 max-w-3xl">

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-green-300
                "
              >
                News & Insights
              </p>

              <h1
                className="
                  mt-5
                  text-4xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Stories shaping our
                <span className="text-green-300">
                  {" "}journey forward.
                </span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-base
                  leading-7
                  text-white/70
                  sm:text-lg
                "
              >
                Stay informed about GreenLunar&apos;s
                latest developments, innovations,
                partnerships and activities across
                our businesses.
              </p>

            </div>
          </div>
        </section>


        {/* =====================================================
            NO PUBLISHED ARTICLES
        ====================================================== */}

        {articles.length === 0 ? (
          <section className="px-6 py-28 sm:px-8 lg:px-10">

            <div
              className="
                mx-auto
                max-w-2xl
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#ecfdf5]
                  text-green-700
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 19V5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 3v5h5M8 13h8M8 17h6"
                  />
                </svg>
              </div>

              <h2
                className="
                  mt-5
                  text-2xl
                  font-semibold
                  text-gray-900
                "
              >
                News coming soon
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-gray-500
                "
              >
                There are currently no published
                articles. Please check back for
                GreenLunar&apos;s latest news and
                insights.
              </p>

            </div>

          </section>
        ) : (
          <>

            {/* =================================================
                FEATURED STORY
            ================================================== */}

            {featuredArticle && (
              <section
                className="
                  px-6
                  py-20
                  sm:px-8
                  lg:px-10
                  lg:py-24
                "
              >
                <div className="mx-auto max-w-7xl">

                  <div className="mb-8">

                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-green-700
                      "
                    >
                      Featured Story
                    </p>

                    <h2
                      className="
                        mt-3
                        text-3xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                      "
                    >
                      Latest from GreenLunar
                    </h2>

                  </div>


                  <Link
                    href={`/news/${featuredArticle.slug}`}
                    className="
                      group
                      grid
                      overflow-hidden
                      rounded-2xl
                      border
                      border-gray-100
                      bg-white
                      shadow-[0_15px_50px_rgba(0,0,0,0.06)]
                      transition-all
                      duration-500
                      hover:-translate-y-1
                      hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)]
                      lg:grid-cols-2
                    "
                  >

                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        min-h-[320px]
                        overflow-hidden
                        bg-[#ecfdf5]
                        lg:min-h-[430px]
                      "
                    >
                      {featuredArticle.featured_image ? (
                        <img
                          src={
                            featuredArticle.featured_image
                          }
                          alt={featuredArticle.title}
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-full
                            min-h-[320px]
                            items-center
                            justify-center
                            bg-[#ecfdf5]
                            text-green-700
                          "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="h-12 w-12"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4 15 4-4 4 4 2-2 6 6"
                            />
                          </svg>
                        </div>
                      )}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/25
                          via-transparent
                          to-transparent
                        "
                      />
                    </div>


                    {/* CONTENT */}
                    <div
                      className="
                        flex
                        flex-col
                        justify-center
                        p-8
                        sm:p-10
                        lg:p-12
                      "
                    >

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-3
                          text-xs
                        "
                      >
                        <span
                          className="
                            rounded-md
                            bg-[#ecfdf5]
                            px-3
                            py-1.5
                            font-semibold
                            text-green-700
                          "
                        >
                          {featuredArticle.category}
                        </span>

                        <span className="text-gray-400">
                          {formatDate(
                            featuredArticle.published_at ??
                              featuredArticle.created_at
                          )}
                        </span>

                        <span className="text-gray-300">
                          •
                        </span>

                        <span className="text-gray-400">
                          {featuredArticle.read_time} min read
                        </span>
                      </div>


                      <h3
                        className="
                          mt-6
                          text-3xl
                          font-semibold
                          leading-tight
                          tracking-tight
                          text-gray-900
                          transition
                          group-hover:text-green-700
                          sm:text-4xl
                        "
                      >
                        {featuredArticle.title}
                      </h3>


                      {featuredArticle.excerpt && (
                        <p
                          className="
                            mt-5
                            text-sm
                            leading-7
                            text-gray-500
                            sm:text-base
                          "
                        >
                          {featuredArticle.excerpt}
                        </p>
                      )}


                      <div
                        className="
                          mt-8
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-semibold
                          text-green-700
                        "
                      >
                        Read Full Story

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="
                            h-4
                            w-4
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12h14M13 6l6 6-6 6"
                          />
                        </svg>
                      </div>

                    </div>

                  </Link>

                </div>
              </section>
            )}


            {/* =================================================
                ALL NEWS
            ================================================== */}

            <section
              className="
                bg-[#f8faf9]
                px-6
                py-20
                sm:px-8
                lg:px-10
                lg:py-24
              "
            >

              <div className="mx-auto max-w-7xl">

                <div
                  className="
                    flex
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-green-700
                      "
                    >
                      Latest Updates
                    </p>

                    <h2
                      className="
                        mt-3
                        text-3xl
                        font-semibold
                        tracking-tight
                        text-gray-900
                        sm:text-4xl
                      "
                    >
                      News & Insights
                    </h2>

                  </div>


                  {/* CATEGORY FILTERS */}
                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    {categories.map((category) => (

                      <button
                        key={category}
                        type="button"
                        onClick={() =>
                          setActiveCategory(category)
                        }
                        className={`
                          rounded-md
                          border
                          px-4
                          py-2
                          text-xs
                          font-medium
                          transition-all
                          duration-300

                          ${
                            activeCategory === category
                              ? `
                                  border-[#063d2b]
                                  bg-[#063d2b]
                                  text-white
                                `
                              : `
                                  border-gray-200
                                  bg-white
                                  text-gray-600
                                  hover:border-green-600
                                  hover:text-green-700
                                `
                          }
                        `}
                      >
                        {category}
                      </button>

                    ))}

                  </div>

                </div>


                {/* NEWS GRID */}
                {filteredArticles.length > 0 ? (
                  <div
                    className="
                      mt-12
                      grid
                      grid-cols-1
                      gap-7
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >

                    {filteredArticles.map((article) => (

                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        className="
                          group
                          overflow-hidden
                          rounded-xl
                          border
                          border-gray-100
                          bg-white
                          shadow-sm
                          transition-all
                          duration-500
                          hover:-translate-y-1
                          hover:shadow-xl
                        "
                      >

                        {/* IMAGE */}
                        <div
                          className="
                            relative
                            h-[230px]
                            overflow-hidden
                            bg-[#ecfdf5]
                          "
                        >

                          {article.featured_image ? (
                            <img
                              src={article.featured_image}
                              alt={article.title}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-700
                                group-hover:scale-105
                              "
                            />
                          ) : (
                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-green-700
                              "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-10 w-10"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14"
                                />

                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4 15 4-4 4 4 2-2 6 6"
                                />
                              </svg>
                            </div>
                          )}

                          {article.featured && (
                            <div
                              className="
                                absolute
                                left-4
                                top-4
                                rounded-md
                                bg-[#063d2b]
                                px-3
                                py-1.5
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-wider
                                text-white
                              "
                            >
                              Featured
                            </div>
                          )}

                        </div>


                        {/* CONTENT */}
                        <div className="p-6">

                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                              text-xs
                              text-gray-400
                            "
                          >

                            <span
                              className="
                                font-semibold
                                text-green-700
                              "
                            >
                              {article.category}
                            </span>

                            <span>•</span>

                            <span>
                              {formatDate(
                                article.published_at ??
                                  article.created_at
                              )}
                            </span>

                          </div>


                          <h3
                            className="
                              mt-4
                              line-clamp-2
                              text-xl
                              font-semibold
                              leading-7
                              text-gray-900
                              transition
                              group-hover:text-green-700
                            "
                          >
                            {article.title}
                          </h3>


                          {article.excerpt && (
                            <p
                              className="
                                mt-3
                                line-clamp-3
                                text-sm
                                leading-6
                                text-gray-500
                              "
                            >
                              {article.excerpt}
                            </p>
                          )}


                          <div
                            className="
                              mt-6
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <span
                              className="
                                text-xs
                                text-gray-400
                              "
                            >
                              {article.read_time} min read
                            </span>

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                text-sm
                                font-semibold
                                text-green-700
                              "
                            >
                              Read More

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="
                                  h-4
                                  w-4
                                  transition-transform
                                  group-hover:translate-x-1
                                "
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 12h14M13 6l6 6-6 6"
                                />
                              </svg>
                            </span>

                          </div>

                        </div>

                      </Link>

                    ))}

                  </div>
                ) : (
                  <div
                    className="
                      mt-12
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-6
                      py-16
                      text-center
                    "
                  >
                    <p className="text-sm text-gray-500">
                      No articles are available in this
                      category.
                    </p>
                  </div>
                )}

              </div>

            </section>


            {/* =================================================
                CTA
            ================================================== */}

            <section
              className="
                bg-white
                px-6
                py-20
                sm:px-8
                lg:px-10
              "
            >
              <div
                className="
                  mx-auto
                  max-w-7xl
                  overflow-hidden
                  rounded-2xl
                  bg-[#063d2b]
                  px-8
                  py-12
                  text-center
                  sm:px-12
                  lg:py-16
                "
              >

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-green-300
                  "
                >
                  GreenLunar Group
                </p>

                <h2
                  className="
                    mx-auto
                    mt-4
                    max-w-3xl
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-white
                    sm:text-4xl
                  "
                >
                  Building solutions that create
                  lasting value.
                </h2>

                <Link
                  href="/contact"
                  className="
                    mt-8
                    inline-flex
                    items-center
                    justify-center
                    rounded-md
                    bg-white
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-[#063d2b]
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-lg
                  "
                >
                  Contact Us
                </Link>

              </div>
            </section>

          </>
        )}

      </main>

      <Footer />
    </>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}