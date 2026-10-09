import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

import { createClient } from "@/lib/supabase/server";

import type { NewsArticle } from "@/types/news";
import ArticleContent from "@/components/admin/news/ArticleContent";


interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* =========================================================
   FETCH ARTICLE
========================================================= */

async function getArticle(
  slug: string
): Promise<NewsArticle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(
      "Error fetching news article:",
      error
    );

    return null;
  }

  return data as NewsArticle | null;
}

/* =========================================================
   FETCH RELATED ARTICLES
========================================================= */

async function getRelatedArticles(
  article: NewsArticle
): Promise<NewsArticle[]> {
  const supabase = await createClient();

  /*
   * First try to find articles from the same category.
   */

  const { data: sameCategory, error } =
    await supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .eq("category", article.category)
      .neq("id", article.id)
      .order("published_at", {
        ascending: false,
      })
      .limit(3);

  if (error) {
    console.error(
      "Error fetching related articles:",
      error
    );
  }

  const related =
    (sameCategory as NewsArticle[] | null) ?? [];

  /*
   * If we already have 3 articles, we're done.
   */

  if (related.length >= 3) {
    return related;
  }

  /*
   * Otherwise fill the remaining spaces with
   * other published articles.
   */

  const excludedIds = [
    article.id,
    ...related.map((item) => item.id),
  ];

  const needed = 3 - related.length;

  let fallbackQuery = supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    })
    .limit(needed);

  excludedIds.forEach((id) => {
    fallbackQuery = fallbackQuery.neq("id", id);
  });

  const { data: fallback, error: fallbackError } =
    await fallbackQuery;

  if (fallbackError) {
    console.error(
      "Error fetching fallback related articles:",
      fallbackError
    );
  }

  return [
    ...related,
    ...((fallback as NewsArticle[] | null) ?? []),
  ].slice(0, 3);
}

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "News Article | GreenLunar Group",
    };
  }

  return {
    title: `${article.title} | GreenLunar Group`,

    description:
      article.excerpt ??
      `Read the latest news and updates from GreenLunar Group.`,

    openGraph: {
      title: article.title,

      description:
        article.excerpt ??
        "Latest news from GreenLunar Group.",

      type: "article",

      publishedTime:
        article.published_at ?? undefined,

      authors: [article.author],

      images: article.featured_image
        ? [
            {
              url: article.featured_image,
              alt: article.title,
            },
          ]
        : undefined,
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles =
    await getRelatedArticles(article);

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <Navbar />

      <main className="bg-white">

        {/* ===================================================
            ARTICLE HERO
        ==================================================== */}

        <section
          className="
            relative
            overflow-hidden
            bg-[#063d2b]
          "
        >
          {/* Decorative background */}
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
              -bottom-48
              left-10
              h-[420px]
              w-[420px]
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
              fallback="/news"
              label="Back to News"
            />

            <div className="mt-12 max-w-4xl">

              {/* META */}
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
                    bg-white/10
                    px-3
                    py-1.5
                    font-semibold
                    text-green-300
                  "
                >
                  {article.category}
                </span>

                <span className="text-white/55">
                  {formatDate(
                    article.published_at ??
                      article.created_at
                  )}
                </span>

                <span className="text-white/30">
                  •
                </span>

                <span className="text-white/55">
                  {article.read_time} min read
                </span>
              </div>

              {/* TITLE */}
              <h1
                className="
                  mt-7
                  text-4xl
                  font-semibold
                  leading-[1.1]
                  tracking-tight
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {article.title}
              </h1>

              {/* EXCERPT */}
              {article.excerpt && (
                <p
                  className="
                    mt-7
                    max-w-3xl
                    text-base
                    leading-8
                    text-white/70
                    sm:text-lg
                  "
                >
                  {article.excerpt}
                </p>
              )}

              {/* AUTHOR */}
              <div
                className="
                  mt-8
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  {getInitials(article.author)}
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      text-white/45
                    "
                  >
                    Published by
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      font-medium
                      text-white
                    "
                  >
                    {article.author}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===================================================
            FEATURED IMAGE
        ==================================================== */}

        {article.featured_image && (
          <section
            className="
              px-6
              pt-12
              sm:px-8
              lg:px-10
              lg:pt-16
            "
          >
            <div className="mx-auto max-w-6xl">

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  bg-gray-100
                  shadow-[0_20px_60px_rgba(0,0,0,0.10)]
                "
              >
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="
                    max-h-[650px]
                    w-full
                    object-cover
                  "
                />
              </div>

            </div>
          </section>
        )}

        {/* ===================================================
            ARTICLE BODY
        ==================================================== */}

        <section
          className="
            px-6
            py-16
            sm:px-8
            lg:px-10
            lg:py-20
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-6xl
              grid-cols-1
              gap-12
              lg:grid-cols-[220px_minmax(0,1fr)]
              lg:gap-16
            "
          >

            {/* SIDEBAR */}
            <aside className="hidden lg:block">

              <div className="sticky top-28">

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-gray-400
                  "
                >
                  Article
                </p>

                <div
                  className="
                    mt-5
                    space-y-4
                    border-l
                    border-gray-200
                    pl-5
                  "
                >
                  <div>
                    <p className="text-xs text-gray-400">
                      Category
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      {article.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Published
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      {formatDate(
                        article.published_at ??
                          article.created_at
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Reading time
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      {article.read_time} minutes
                    </p>
                  </div>
                </div>

              </div>
            </aside>

            {/* ARTICLE */}
            <article className="min-w-0">

              <div
                className="
                  space-y-7
                  text-[16px]
                  leading-8
                  text-gray-600
                  sm:text-[17px]
                "
              >
                {paragraphs.map(
                  (paragraph, index) => (
                    <div key={index}>
                       <ArticleContent content={article.content} />
                    </div>
                  )
                )}
              </div>

              {/* ARTICLE END */}
              <div
                className="
                  mt-14
                  border-t
                  border-gray-200
                  pt-8
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-6
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[0.14em]
                        text-gray-400
                      "
                    >
                      Published by
                    </p>

                    <p
                      className="
                        mt-2
                        text-base
                        font-semibold
                        text-gray-900
                      "
                    >
                      {article.author}
                    </p>
                  </div>

                  <Link
                    href="/news"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-green-700
                      transition
                      hover:text-[#063d2b]
                    "
                  >
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
                        d="M19 12H5M11 18l-6-6 6-6"
                      />
                    </svg>

                    Back to News
                  </Link>
                </div>
              </div>

            </article>

          </div>
        </section>

        {/* ===================================================
            RELATED STORIES
        ==================================================== */}

        {relatedArticles.length > 0 && (
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
                  Keep Reading
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
                  Related Stories
                </h2>

              </div>

              <div
                className="
                  mt-10
                  grid
                  grid-cols-1
                  gap-7
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {relatedArticles.map(
                  (relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/news/${relatedArticle.slug}`}
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
                          h-[220px]
                          overflow-hidden
                          bg-[#ecfdf5]
                        "
                      >
                        {relatedArticle.featured_image ? (
                          <img
                            src={
                              relatedArticle.featured_image
                            }
                            alt={relatedArticle.title}
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
                      </div>

                      {/* CONTENT */}
                      <div className="p-6">

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-xs
                          "
                        >
                          <span
                            className="
                              font-semibold
                              text-green-700
                            "
                          >
                            {relatedArticle.category}
                          </span>

                          <span className="text-gray-300">
                            •
                          </span>

                          <span className="text-gray-400">
                            {formatDate(
                              relatedArticle.published_at ??
                                relatedArticle.created_at
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
                          {relatedArticle.title}
                        </h3>

                        {relatedArticle.excerpt && (
                          <p
                            className="
                              mt-3
                              line-clamp-2
                              text-sm
                              leading-6
                              text-gray-500
                            "
                          >
                            {relatedArticle.excerpt}
                          </p>
                        )}

                        <div
                          className="
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-green-700
                          "
                        >
                          Read Story

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
                        </div>

                      </div>

                    </Link>
                  )
                )}
              </div>

            </div>
          </section>
        )}

        {/* ===================================================
            CTA
        ==================================================== */}

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
              Discover how we&apos;re building
              solutions for tomorrow.
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

      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}