import Link from "next/link";
import NewsForm from "@/components/admin/news/NewsForm";

export default function CreateNewsPage() {
  return (
    <div className="space-y-8">

      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-400
        "
      >
        <Link
          href="/admin/news"
          className="
            transition
            hover:text-green-700
          "
        >
          News
        </Link>

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
            d="m9 18 6-6-6-6"
          />
        </svg>

        <span className="text-gray-600">
          Create Article
        </span>
      </div>


      {/* =====================================================
          HEADER
      ====================================================== */}

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
          News Management
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
          Create Article
        </h1>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            leading-6
            text-gray-500
          "
        >
          Create a news article, announcement or
          insight for the GreenLunar website.
        </p>

      </div>


      {/* =====================================================
          FORM
      ====================================================== */}

      <NewsForm />

    </div>
  );
}