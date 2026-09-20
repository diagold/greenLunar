import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import StatusFilter from "@/components/admin/StatusFilter";
const supabase = await createClient();

import {
  Search,
  Inbox,
  ChevronDown,
} from "lucide-react";



const PAGE_SIZE = 10;
const [
  allCountResult,
  newCountResult,
  readCountResult,
  repliedCountResult,
  archivedCountResult,
] = await Promise.all([
  supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true }),

  supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new"),

  supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "read"),

  supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "replied"),

  supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "archived"),
]);

const statusCounts = {
  all: allCountResult.count ?? 0,
  new: newCountResult.count ?? 0,
  read: readCountResult.count ?? 0,
  replied: repliedCountResult.count ?? 0,
  archived: archivedCountResult.count ?? 0,
};

type EnquiriesPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
};

export default async function EnquiriesPage({
  searchParams,
}: EnquiriesPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() || "";
  const status = params.status || "all";

  const requestedPage = Number(params.page || "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  const supabase = await createClient();

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // STATUS FILTER
  if (
    ["new", "read", "replied", "archived"].includes(status)
  ) {
    query = query.eq("status", status);
  }

  // SEARCH
  if (search) {
    const safeSearch = search
      .replace(/[%_,()]/g, " ")
      .trim();

    if (safeSearch) {
      query = query.or(
        `first_name.ilike.%${safeSearch}%,last_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,subject.ilike.%${safeSearch}%,location.ilike.%${safeSearch}%`
      );
    }
  }

  const {
    data: enquiries,
    error,
    count,
  } = await query.range(from, to);

  if (error) {
    console.error("Unable to load enquiries:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  const totalRecords = count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalRecords / PAGE_SIZE)
  );

  const createPageUrl = (page: number) => {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (status !== "all") {
      query.set("status", status);
    }

    query.set("page", String(page));

    return `/admin/enquiries?${query.toString()}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Website Enquiries
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage messages submitted through the
          Green Lunar website.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

        <form
          method="GET"
          className="flex flex-col gap-3 lg:flex-row"
        >
          {status !== "all" && (
            <input
              type="hidden"
              name="status"
              value={status}
            />
          )}

          {/* SEARCH */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search name, email, subject or location..."
              className="
                w-full rounded-xl
                border border-gray-200
                bg-white py-2.5
                pl-10 pr-4
                text-sm text-gray-900
                outline-none transition
                focus:border-[#073f30]
                focus:ring-2 focus:ring-green-100
              "
            />
          </div>

        <StatusFilter
      value={status}
      counts={statusCounts}
    />

          <button
            type="submit"
            className="
              rounded-xl bg-[#073f30]
              px-6 py-2.5
              text-sm font-medium text-white
              transition hover:bg-[#09543f]
            "
          >
            Filter
          </button>

          {(search || status !== "all") && (
            <Link
              href="/admin/enquiries"
              className="
                flex items-center justify-center
                rounded-xl border border-gray-200
                px-5 py-2.5
                text-sm font-medium text-gray-600
                transition hover:bg-gray-50
              "
            >
              Clear
            </Link>
          )}

        </form>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b border-gray-200 bg-gray-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Subject
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {enquiries?.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className={`
                    transition hover:bg-gray-50
                    ${
                      enquiry.status === "new"
                        ? "bg-green-50/30"
                        : ""
                    }
                  `}
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      {enquiry.status === "new" && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-green-600"
                          title="New enquiry"
                        />
                      )}

                      <div>

                        <p className="font-medium text-gray-900">
                          {enquiry.first_name}{" "}
                          {enquiry.last_name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {enquiry.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="max-w-[280px] px-6 py-4">

                    <p className="truncate text-sm text-gray-700">
                      {enquiry.subject}
                    </p>

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {enquiry.location}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge
                      status={enquiry.status}
                    />
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(
                      enquiry.created_at
                    ).toLocaleDateString(
                      "en-NG",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <Link
                      href={`/admin/enquiries/${enquiry.id}`}
                      className="
                        text-sm font-semibold
                        text-[#073f30]
                        hover:underline
                      "
                    >
                      View
                    </Link>

                  </td>

                </tr>
              ))}

              {!error && !enquiries?.length && (
                <tr>

                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >

                    <Inbox
                      size={34}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-4 font-medium text-gray-700">
                      No enquiries found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filter.
                    </p>

                  </td>

                </tr>
              )}

              {error && (
                <tr>

                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <p className="font-medium text-red-600">
                      Unable to load enquiries.
                    </p>
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        {!error && totalRecords > 0 && (
          <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {from + 1}
              </span>
              {" – "}
              <span className="font-medium text-gray-700">
                {Math.min(to + 1, totalRecords)}
              </span>
              {" of "}
              <span className="font-medium text-gray-700">
                {totalRecords}
              </span>
            </p>

            <div className="flex items-center gap-2">

              {currentPage > 1 ? (
                <Link
                  href={createPageUrl(
                    currentPage - 1
                  )}
                  className="
                    rounded-lg border border-gray-200
                    px-4 py-2 text-sm
                    font-medium text-gray-600
                    transition hover:bg-gray-50
                  "
                >
                  Previous
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-gray-100 px-4 py-2 text-sm text-gray-300">
                  Previous
                </span>
              )}

              <span className="px-2 text-sm text-gray-500">
                Page{" "}
                <strong className="text-gray-800">
                  {currentPage}
                </strong>
                {" of "}
                {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={createPageUrl(
                    currentPage + 1
                  )}
                  className="
                    rounded-lg border border-gray-200
                    px-4 py-2 text-sm
                    font-medium text-gray-600
                    transition hover:bg-gray-50
                  "
                >
                  Next
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded-lg border border-gray-100 px-4 py-2 text-sm text-gray-300">
                  Next
                </span>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    read: "bg-amber-50 text-amber-700",
    replied: "bg-green-50 text-green-700",
    archived: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1
        text-xs font-semibold capitalize
        ${
          styles[status] ??
          "bg-gray-100 text-gray-600"
        }
      `}
    >
      {status}
    </span>
  );
}