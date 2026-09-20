import {
  Inbox,
  MailOpen,
  CheckCircle2,
  Archive,
} from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    totalResult,
    newResult,
    readResult,
    repliedResult,
    archivedResult,
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

  const statistics = [
    {
      title: "Total Enquiries",
      value: totalResult.count ?? 0,
      icon: Inbox,
    },
    {
      title: "New Enquiries",
      value: newResult.count ?? 0,
      icon: Inbox,
    },
    {
      title: "Read",
      value: readResult.count ?? 0,
      icon: MailOpen,
    },
    {
      title: "Replied",
      value: repliedResult.count ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Archived",
      value: archivedResult.count ?? 0,
      icon: Archive,
    },
  ];

const { data: recentEnquiries } = await supabase
  .from("enquiries")
  .select(
    "id, first_name, last_name, email, subject, status, created_at"
  )
  .order("created_at", { ascending: false })
  .limit(5);

  <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

    <div>
      <h2 className="font-semibold text-gray-900">
        Recent Enquiries
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Latest messages received from the website.
      </p>
    </div>

    <Link
      href="/admin/enquiries"
      className="text-sm font-medium text-[#073f30] hover:underline"
    >
      View all
    </Link>

  </div>

  <div className="divide-y divide-gray-100">

    {recentEnquiries?.map((enquiry) => (
      <Link
        key={enquiry.id}
        href={`/admin/enquiries/${enquiry.id}`}
        className="
          flex items-center justify-between
          gap-4 px-6 py-4
          transition hover:bg-gray-50
        "
      >

        <div className="min-w-0">

          <p className="truncate font-medium text-gray-900">
            {enquiry.first_name} {enquiry.last_name}
          </p>

          <p className="mt-1 truncate text-sm text-gray-500">
            {enquiry.subject}
          </p>

        </div>

        <div className="flex shrink-0 items-center gap-4">

          <span
            className={`
              rounded-full px-2.5 py-1
              text-xs font-semibold capitalize

              ${
                enquiry.status === "new"
                  ? "bg-blue-50 text-blue-700"
                  : enquiry.status === "read"
                  ? "bg-amber-50 text-amber-700"
                  : enquiry.status === "replied"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }
            `}
          >
            {enquiry.status}
          </span>

          <span className="hidden text-xs text-gray-400 sm:block">
            {new Date(
              enquiry.created_at
            ).toLocaleDateString("en-NG", {
              day: "2-digit",
              month: "short",
            })}
          </span>

        </div>

      </Link>
    ))}

    {!recentEnquiries?.length && (
      <div className="px-6 py-12 text-center text-sm text-gray-500">
        No enquiries received yet.
      </div>
    )}

  </div>

</div>

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Overview of your Green Lunar website.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                rounded-2xl border border-gray-200
                bg-white p-5 shadow-sm
                transition
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-xl bg-green-50
                    text-[#073f30]
                  "
                >
                  <Icon size={21} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}