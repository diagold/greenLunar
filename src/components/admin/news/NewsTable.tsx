"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import DeleteNewsButton from "@/components/admin/DeleteNewsButton";



interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  author: string;
  featured_image: string | null;
  status: "draft" | "published";
  featured: boolean;
  read_time: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface NewsTableProps {
  articles: NewsArticle[];
}

export default function NewsTable({
  articles,
}: NewsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  /* =========================================================
     FILTER ARTICLES
  ========================================================= */

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm) ||
        article.author.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        article.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  return (
    <div>

      {/* =====================================================
          SEARCH / FILTER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-gray-100
          px-6
          py-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* Search */}
        <div className="relative w-full md:max-w-md">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="
              absolute
              left-3.5
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-gray-400
            "
          >
            <circle cx="11" cy="11" r="8" />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search articles..."
            className="
              w-full
              rounded-lg
              border
              border-gray-200
              bg-white
              py-2.5
              pl-10
              pr-4
              text-sm
              text-gray-700
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-green-600
              focus:ring-2
              focus:ring-green-600/10
            "
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            text-gray-600
            outline-none
            transition
            focus:border-green-600
            focus:ring-2
            focus:ring-green-600/10
          "
        >
          <option value="all">All Status</option>

          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>
        </select>
      </div>

      {/* =====================================================
          EMPTY DATABASE
      ====================================================== */}

      {articles.length === 0 ? (
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            px-6
            py-20
            text-center
          "
        >
          <div
            className="
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
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 2v6h6M8 13h8M8 17h5"
              />
            </svg>
          </div>

          <h3
            className="
              mt-5
              text-lg
              font-semibold
              text-gray-900
            "
          >
            No news articles yet
          </h3>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-gray-500
            "
          >
            Create your first article to start
            publishing news and updates on the
            GreenLunar website.
          </p>

          <Link
            href="/admin/news/new"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-[#063d2b]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#0a5039]
            "
          >
            <span className="text-lg leading-none">
              +
            </span>

            Create First Article
          </Link>
        </div>
      ) : filteredArticles.length === 0 ? (

        /* ===================================================
           NO SEARCH RESULTS
        ==================================================== */

        <div className="px-6 py-16 text-center">

          <p className="text-sm font-medium text-gray-700">
            No matching articles found.
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Try changing your search or status filter.
          </p>

        </div>

      ) : (

        /* ===================================================
           TABLE
        ==================================================== */

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="bg-[#f8faf9]">

              <tr>

                <th
                  className="
                    px-6
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Article
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Category
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Published
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredArticles.map((article) => (

                <tr
                  key={article.id}
                  className="
                    transition-colors
                    hover:bg-gray-50/70
                  "
                >

                  {/* ARTICLE */}
                  <td className="px-6 py-4">

                    <div className="flex items-center gap-4">

                      {/* Image */}
                      <div
                        className="
                          h-14
                          w-20
                          shrink-0
                          overflow-hidden
                          rounded-lg
                          bg-gray-100
                        "
                      >
                        {article.featured_image ? (
                          <img
                            src={article.featured_image}
                            alt=""
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
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
                              strokeWidth="1.7"
                              className="h-5 w-5"
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

                      {/* Title */}
                      <div className="max-w-[330px]">

                        <div className="flex items-center gap-2">

                          <Link
                            href={`/admin/news/${article.id}/edit`}
                            className="
                              line-clamp-1
                              text-sm
                              font-semibold
                              text-gray-900
                              transition
                              hover:text-green-700
                            "
                          >
                            {article.title}
                          </Link>

                          {article.featured && (
                            <span
                              title="Featured article"
                              className="text-amber-500"
                            >
                              ★
                            </span>
                          )}

                        </div>

                        <p
                          className="
                            mt-1
                            line-clamp-1
                            text-xs
                            text-gray-400
                          "
                        >
                          /news/{article.slug}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CATEGORY */}
                  <td className="px-5 py-4">

                    <span
                      className="
                        inline-flex
                        rounded-md
                        bg-[#ecfdf5]
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-green-700
                      "
                    >
                      {article.category}
                    </span>

                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">

                    <StatusBadge
                      status={article.status}
                    />

                  </td>

                  {/* PUBLISHED DATE */}
                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                      text-sm
                      text-gray-500
                    "
                  >
                    {article.published_at
                      ? formatDate(article.published_at)
                      : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">

                    <div
                      className="
                        flex
                        items-center
                        justify-end
                        gap-2
                      "
                    >

                      {/* View */}
                      {article.status === "published" && (
                        <Link
                          href={`/news/${article.slug}`}
                          target="_blank"
                          title="View article"
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            text-gray-500
                            transition
                            hover:border-green-600
                            hover:text-green-700
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
                              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                            />

                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                            />
                          </svg>
                        </Link>
                      )}

                      {/* Edit */}
                      <Link
                        href={`/admin/news/${article.id}/edit`}
                        title="Edit article"
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-gray-500
                          transition
                          hover:border-green-600
                          hover:text-green-700
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
                            d="M12 20h9"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
                          />
                        </svg>
                      </Link>
                      
                      <DeleteNewsButton
                        articleId={article.id}
                        articleTitle={article.title}
                      />

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: "draft" | "published";
}) {
  if (status === "published") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-md
          bg-green-50
          px-2.5
          py-1
          text-xs
          font-medium
          text-green-700
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

        Published
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-md
        bg-gray-100
        px-2.5
        py-1
        text-xs
        font-medium
        text-gray-600
      "
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />

      Draft
    </span>
  );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}