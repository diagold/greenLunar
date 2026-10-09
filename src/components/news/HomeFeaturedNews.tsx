
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
};

function formatDate(date: string | null) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default async function HomeFeaturedNews() {
  const supabase = await createClient();

  // Fetch the three most recent featured, published articles.
  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, slug, excerpt, category, featured_image, published_at, created_at"
    )
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", {
      ascending: false,
      nullsFirst: false,
    })
    .limit(3);

  if (error) {
    console.error(
      "Unable to load featured news:",
      error.message
    );

    return null;
  }

  const articles = (data ?? []) as NewsArticle[];

  // Hide the section when there are no featured articles.
  if (articles.length === 0) {
    return null;
  }

  const [mainArticle, ...secondaryArticles] = articles;

  return (
    <section
      id="featured-news"
      className="bg-[#f7faf8] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* SECTION HEADING */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
              GreenLunar Insights
            </span>

            <h2 className="text-3xl font-semibold tracking-tight text-[#063d2b] sm:text-4xl lg:text-5xl">
              Latest News & Updates
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Discover our latest announcements,
              partnerships, innovations, and milestones.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex w-fit items-center gap-3 rounded-lg bg-[#063d2b] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-green-800"
          >
            View All News

            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* NEWS CONTENT */}
        <div className="flex flex-col gap-8">
          {/* MAIN FEATURED ARTICLE */}
          <Link
            href={`/news/${mainArticle.slug}`}
            className="
              group
              grid
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
              md:grid-cols-2
            "
          >
            {/* LEFT: FEATURED IMAGE */}
            <div className="relative min-h-[280px] overflow-hidden bg-gray-100 sm:min-h-[340px] md:min-h-[440px]">
              {mainArticle.featured_image ? (
                <Image
                  src={mainArticle.featured_image}
                  alt={mainArticle.title}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center bg-[#063d2b] px-6 text-center text-lg font-semibold text-white/70">
                  GreenLunar News
                </div>
              )}

              {/* FEATURED BADGE */}
              <span className="absolute left-5 top-5 rounded-full bg-[#063d2b] px-4 py-2 text-xs font-semibold text-white shadow-md">
                Featured News
              </span>
            </div>

            {/* RIGHT: ARTICLE INFORMATION */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
              {/* CATEGORY AND DATE */}
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                {mainArticle.category && (
                  <span className="font-semibold uppercase tracking-[0.15em] text-green-700">
                    {mainArticle.category}
                  </span>
                )}

                <span>
                  {formatDate(
                    mainArticle.published_at ??
                      mainArticle.created_at
                  )}
                </span>
              </div>

              {/* ARTICLE TITLE */}
              <h3
                className="
                  text-2xl
                  font-semibold
                  leading-tight
                  tracking-tight
                  text-[#063d2b]
                  transition-colors
                  duration-300
                  group-hover:text-green-700
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                {mainArticle.title}
              </h3>

              {/* ARTICLE EXCERPT */}
              {mainArticle.excerpt && (
                <p className="mt-6 line-clamp-4 text-base leading-8 text-gray-600">
                  {mainArticle.excerpt}
                </p>
              )}

              {/* READ ARTICLE LINK */}
              <div className="mt-8">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-3
                    border-b-2
                    border-[#063d2b]
                    pb-2
                    text-sm
                    font-semibold
                    text-[#063d2b]
                    transition-all
                    duration-300
                    group-hover:gap-5
                  "
                >
                  Read Full Article

                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </Link>

          {/* SECONDARY FEATURED ARTICLES */}
          {secondaryArticles.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {secondaryArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="
                    group
                    flex
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                    sm:flex-row
                  "
                >
                  {/* SECONDARY IMAGE */}
                  <div className="relative min-h-[220px] overflow-hidden bg-gray-100 sm:min-h-[240px] sm:w-2/5 sm:shrink-0">
                    {article.featured_image ? (
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center bg-[#063d2b] px-4 text-center text-sm font-semibold text-white/70">
                        GreenLunar News
                      </div>
                    )}
                  </div>

                  {/* SECONDARY ARTICLE DETAILS */}
                  <div className="flex flex-1 flex-col justify-center p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {article.category && (
                        <span className="font-semibold uppercase tracking-wider text-green-700">
                          {article.category}
                        </span>
                      )}

                      <span>
                        {formatDate(
                          article.published_at ??
                            article.created_at
                        )}
                      </span>
                    </div>

                    <h3 className="line-clamp-3 text-lg font-semibold leading-snug text-[#063d2b] transition-colors duration-300 group-hover:text-green-700 sm:text-xl">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                        {article.excerpt}
                      </p>
                    )}

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#063d2b] transition-all duration-300 group-hover:gap-3">
                      Read More

                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
