import Link from "next/link";

import {
  Archive,
  ArrowRight,
  Layers3,
  Plus,
  Search,
   Check,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import type {
  Service,
  ServiceStatus,
} from "@/types/service";

/* ==========================================================================
   PAGE TYPES
   ========================================================================== */

type ServicesPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;

    created?: string;
    archived?: string;
    restored?: string;
    deleted?: string;
  }>;
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

function getStatus(
  status: unknown
): ServiceStatus {
  if (
    status === "draft" ||
    status === "published" ||
    status === "archived"
  ) {
    return status;
  }

  return "draft";
}

function getStatusClasses(
  status: ServiceStatus
) {
  switch (status) {
    case "published":
      return "border-green-200 bg-green-50 text-green-700";

    case "archived":
      return "border-gray-200 bg-gray-100 text-gray-600";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getStatusLabel(
  status: ServiceStatus
) {
  switch (status) {
    case "published":
      return "Published";

    case "archived":
      return "Archived";

    default:
      return "Draft";
  }
}

/* ==========================================================================
   SERVICES PAGE
   ========================================================================== */

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const params = await searchParams;
  
  const createdService = params.created;

  const archivedService = params.archived;

  const restoredService = params.restored;

  const deletedService = params.deleted;

  const search =
    params.search?.trim() ?? "";

  const requestedStatus =
    params.status?.trim() ?? "all";

  const statusFilter =
    requestedStatus === "draft" ||
    requestedStatus === "published" ||
    requestedStatus === "archived"
      ? requestedStatus
      : "all";

  const supabase =
    await createClient();

  /* ========================================================================
     LOAD SERVICES
     ======================================================================== */

  let query = supabase
    .from("services")
    .select("*")
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (statusFilter !== "all") {
    query = query.eq(
      "status",
      statusFilter
    );
  }

  if (search) {
    const safeSearch = search
      .replace(/[%_,()]/g, " ")
      .trim();

    if (safeSearch) {
      query = query.or(
        `name.ilike.%${safeSearch}%,slug.ilike.%${safeSearch}%,category.ilike.%${safeSearch}%`
      );
    }
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    console.error(
      "Load services error:",
      error
    );
  }

  const services =
    (data ?? []) as Service[];

  /* ========================================================================
     COUNTS
     ======================================================================== */

  const [
    totalResult,
    publishedResult,
    draftResult,
    archivedResult,
  ] = await Promise.all([
    supabase
      .from("services")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("services")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "published"
      ),

    supabase
      .from("services")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "draft"
      ),

    supabase
      .from("services")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "archived"
      ),
  ]);

  const counts = {
    total:
      totalResult.count ?? 0,

    published:
      publishedResult.count ?? 0,

    draft:
      draftResult.count ?? 0,

    archived:
      archivedResult.count ?? 0,
  };

  /* ========================================================================
     RENDER
     ======================================================================== */

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
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
              text-[#073f30]
            "
          >
            Website Management
          </p>

          <h1
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
              sm:text-3xl
            "
          >
            Services
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
            Manage the services displayed on
            the Green Lunar website.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className="
            inline-flex
            w-fit
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#073f30]
            px-5 py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-[#09543f]
          "
        >
          <Plus size={17} />

          Add Service
        </Link>
      </div>
      
      {/* 
      =============
      SUCCESS MESSAGE
      ==================
      */}

      {createdService && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Check size={17} />
          </div>

          <div>
            <p className="font-semibold text-green-900">
              Service created successfully
            </p>

            <p className="mt-1 text-sm text-green-700">
              {createdService} has been added to your services.
            </p>
          </div>
        </div>
      )}
      {/* ================================================================== */}
      {/* STAT CARDS                                                         */}
      {/* ================================================================== */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <StatCard
          title="Total Services"
          value={counts.total}
          icon={
            <Layers3 size={20} />
          }
        />

        <StatCard
          title="Published"
          value={counts.published}
          icon={
            <ArrowRight size={20} />
          }
        />

        <StatCard
          title="Drafts"
          value={counts.draft}
          icon={
            <Layers3 size={20} />
          }
        />

        <StatCard
          title="Archived"
          value={counts.archived}
          icon={
            <Archive size={20} />
          }
        />
      </div>

      {/* ================================================================== */}
      {/* SEARCH + FILTER                                                    */}
      {/* ================================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-4
          shadow-sm
        "
      >
        <form
          method="GET"
          className="
            flex
            flex-col
            gap-3
            md:flex-row
            md:items-center
          "
        >
          {/* SEARCH */}

          <div
            className="
              relative
              flex-1
            "
          >
            <Search
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search services..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                py-3
                pl-11
                pr-4
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-[#073f30]
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          {/* STATUS */}

          <select
            name="status"
            defaultValue={statusFilter}
            className="
              min-w-[170px]
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-sm
              text-gray-700
              outline-none
              transition
              focus:border-[#073f30]
              focus:ring-2
              focus:ring-green-100
            "
          >
            <option value="all">
              All statuses
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="archived">
              Archived
            </option>
          </select>

          <button
            type="submit"
            className="
              rounded-xl
              bg-gray-900
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-black
            "
          >
            Filter
          </button>

          {(search ||
            statusFilter !== "all") && (
            <Link
              href="/admin/services"
              className="
                rounded-xl
                border
                border-gray-200
                px-5
                py-3
                text-center
                text-sm
                font-semibold
                text-gray-600
                transition
                hover:bg-gray-50
              "
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* ================================================================== */}
      {/* ERROR                                                              */}
      {/* ================================================================== */}

      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            text-sm
            text-red-700
          "
        >
          Unable to load services. Please
          check the Supabase configuration.
        </div>
      )}

      {/* ================================================================== */}
      {/* SERVICE TABLE                                                      */}
      {/* ================================================================== */}

      {!error && (
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >
          {services.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search) ||
                statusFilter !==
                  "all"
              }
            />
          ) : (
            <>
              {/* DESKTOP */}

              <div
                className="
                  hidden
                  overflow-x-auto
                  md:block
                "
              >
                <table
                  className="
                    w-full
                    min-w-[850px]
                    border-collapse
                  "
                >
                  <thead>
                    <tr
                      className="
                        border-b
                        border-gray-200
                        bg-gray-50/70
                      "
                    >
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Service
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Featured
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Order
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody
                    className="
                      divide-y
                      divide-gray-100
                    "
                  >
                    {services.map(
                      (service) => {
                        const status =
                          getStatus(
                            service.status
                          );

                        return (
                          <tr
                            key={
                              service.id
                            }
                            className="
                              transition
                              hover:bg-gray-50/70
                            "
                          >
                            <td className="px-6 py-4">
                              <div
                                className="
                                  flex
                                  items-center
                                  gap-4
                                "
                              >
                                <ServiceThumbnail
                                  service={
                                    service
                                  }
                                />

                                <div
                                  className="
                                    min-w-0
                                  "
                                >
                                  <p
                                    className="
                                      truncate
                                      text-sm
                                      font-semibold
                                      text-gray-900
                                    "
                                  >
                                    {
                                      service.name
                                    }
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      truncate
                                      text-xs
                                      text-gray-400
                                    "
                                  >
                                    /services/
                                    {
                                      service.slug
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {service.category ||
                                "—"}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  border
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-semibold
                                  ${getStatusClasses(
                                    status
                                  )}
                                `}
                              >
                                {getStatusLabel(
                                  status
                                )}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              {service.featured ? (
                                <span
                                  className="
                                    text-sm
                                    font-semibold
                                    text-[#073f30]
                                  "
                                >
                                  Yes
                                </span>
                              ) : (
                                <span
                                  className="
                                    text-sm
                                    text-gray-400
                                  "
                                >
                                  No
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-600">
                              {
                                service.sort_order
                              }
                            </td>

                            <td
                              className="
                                px-6
                                py-4
                                text-right
                              "
                            >
                              <Link
                                href={`/admin/services/${service.id}`}
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  text-sm
                                  font-semibold
                                  text-[#073f30]
                                  transition
                                  hover:text-green-700
                                "
                              >
                                Edit

                                <ArrowRight
                                  size={15}
                                />
                              </Link>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div
                className="
                  divide-y
                  divide-gray-100
                  md:hidden
                "
              >
                {services.map(
                  (service) => {
                    const status =
                      getStatus(
                        service.status
                      );

                    return (
                      <Link
                        key={
                          service.id
                        }
                        href={`/admin/services/${service.id}`}
                        className="
                          block
                          p-5
                          transition
                          hover:bg-gray-50
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            gap-4
                          "
                        >
                          <ServiceThumbnail
                            service={
                              service
                            }
                          />

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >
                              <div>
                                <p
                                  className="
                                    font-semibold
                                    text-gray-900
                                  "
                                >
                                  {
                                    service.name
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-xs
                                    text-gray-400
                                  "
                                >
                                  {service.category ||
                                    "Uncategorised"}
                                </p>
                              </div>

                              <ArrowRight
                                size={17}
                                className="
                                  mt-1
                                  shrink-0
                                  text-gray-400
                                "
                              />
                            </div>

                            <div
                              className="
                                mt-3
                                flex
                                flex-wrap
                                items-center
                                gap-2
                              "
                            >
                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  border
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-semibold
                                  ${getStatusClasses(
                                    status
                                  )}
                                `}
                              >
                                {getStatusLabel(
                                  status
                                )}
                              </span>

                              {service.featured && (
                                <span
                                  className="
                                    rounded-full
                                    bg-green-50
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-[#073f30]
                                  "
                                >
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   STAT CARD
   ========================================================================== */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-sm
              font-medium
              text-gray-500
            "
          >
            {title}
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
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
            rounded-xl
            bg-green-50
            text-[#073f30]
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SERVICE THUMBNAIL
   ========================================================================== */

function ServiceThumbnail({
  service,
}: {
  service: Service;
}) {
  if (service.image_url) {
    return (
      <img
        src={service.image_url}
        alt=""
        className="
          h-12
          w-12
          shrink-0
          rounded-xl
          object-cover
        "
      />
    );
  }

  return (
    <div
      className="
        flex
        h-12
        w-12
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-green-50
        text-[#073f30]
      "
    >
      <Layers3 size={20} />
    </div>
  );
}

/* ==========================================================================
   EMPTY STATE
   ========================================================================== */

function EmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        px-6
        py-16
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
          rounded-2xl
          bg-green-50
          text-[#073f30]
        "
      >
        <Layers3 size={25} />
      </div>

      <h2
        className="
          mt-5
          text-lg
          font-semibold
          text-gray-900
        "
      >
        {hasFilters
          ? "No matching services"
          : "No services yet"}
      </h2>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-gray-500
        "
      >
        {hasFilters
          ? "Try changing your search or status filter."
          : "Create your first service and manage how it appears on the Green Lunar website."}
      </p>

      {!hasFilters && (
        <Link
          href="/admin/services/new"
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-[#073f30]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#09543f]
          "
        >
          <Plus size={17} />

          Add First Service
        </Link>
      )}

      {hasFilters && (
        <Link
          href="/admin/services"
          className="
            mt-6
            text-sm
            font-semibold
            text-[#073f30]
            hover:underline
          "
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}