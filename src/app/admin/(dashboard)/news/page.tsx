import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewsTable from "@/components/admin/news/NewsTable";



export default async function NewsPage() {
  const supabase = await createClient();

  /* =========================================================
     FETCH NEWS
  ========================================================= */

  const { data: articles, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
  }

  const news = articles ?? [];

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalArticles = news.length;

  const publishedArticles = news.filter(
    (article) => article.status === "published"
  ).length;

  const draftArticles = news.filter(
    (article) => article.status === "draft"
  ).length;

  const featuredArticles = news.filter(
    (article) => article.featured === true
  ).length;

  return (
    <div className="space-y-8">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-center
          sm:justify-between
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
            Content Management
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-semibold
              tracking-tight
              text-gray-900
            "
          >
            News
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Create, manage and publish news, announcements and insights
            across the GreenLunar website.
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#063d2b]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-[#0a5039]
            hover:shadow-md
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
              d="M12 5v14M5 12h14"
            />
          </svg>

          Create Article
        </Link>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}
        <StatCard
          label="Total Articles"
          value={totalArticles}
          description="All news articles"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2v6h6M8 13h8M8 17h8M8 9h2"
              />
            </svg>
          }
        />

        {/* PUBLISHED */}
        <StatCard
          label="Published"
          value={publishedArticles}
          description="Visible on website"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 6L9 17l-5-5"
              />
            </svg>
          }
        />

        {/* DRAFT */}
        <StatCard
          label="Drafts"
          value={draftArticles}
          description="Awaiting publication"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20h9"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
              />
            </svg>
          }
        />

        {/* FEATURED */}
        <StatCard
          label="Featured"
          value={featuredArticles}
          description="Current featured story"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"
              />
            </svg>
          }
        />
      </div>

      {/* =====================================================
          ARTICLES
      ====================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >
        {/* Table heading */}
        <div
          className="
            flex
            flex-col
            gap-2
            border-b
            border-gray-100
            px-6
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              All Articles
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage news published across the GreenLunar website.
            </p>
          </div>

          <p className="text-xs font-medium text-gray-400">
            {totalArticles}{" "}
            {totalArticles === 1 ? "article" : "articles"}
          </p>
        </div>

        <NewsTable articles={news} />
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

function StatCard({
  label,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-100
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>

          <p
            className="
              mt-3
              text-3xl
              font-semibold
              tracking-tight
              text-gray-900
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-[#ecfdf5]
            text-green-700
          "
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}