import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EnquiryActions from "@/components/admin/EnquiryActions";


export default async function EnquiryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: enquiry, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .single();


  const statusStyles: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    read: "bg-amber-50 text-amber-700",
    replied: "bg-green-50 text-green-700",
    archived: "bg-gray-100 text-gray-600",
  };

  const statusLabels: Record<string, string> = {
    new: "New",
    read: "Read",
    replied: "Replied",
    archived: "Archived",
  };

  if (enquiry.status === "new") {
    const { error: statusError } = await supabase
      .from("enquiries")
      .update({
        status: "read",
        updated_at: new Date().toISOString(),
      })
      .eq("id", enquiry.id);

    if (statusError) {
      console.error("Unable to mark enquiry as read:", {
        message: statusError.message,
        code: statusError.code,
      });
    } else {
      enquiry.status = "read";
    }
  }

  if (error || !enquiry) {
    notFound();
  }

  return (
    <main className="p-8">

      <Link
        href="/admin/enquiries"
        className="text-sm font-medium text-green-700 hover:text-green-800"
      >
        ← Back to enquiries
      </Link>

      <div className="mt-6 max-w-4xl">

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-start md:justify-between">

            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-green-700">
                Website Enquiry
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {enquiry.subject}
              </h1>
            </div>

            <span
              className={`
                inline-flex w-fit rounded-full
                px-3 py-1
                text-xs font-semibold
                ${statusStyles[enquiry.status] ?? "bg-gray-100 text-gray-600"}
              `}
            >
              {statusLabels[enquiry.status] ?? enquiry.status}
          </span>

          </div>

          <div className="grid gap-6 py-7 md:grid-cols-2">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Name
              </p>

              <p className="mt-2 text-gray-900">
                {enquiry.first_name} {enquiry.last_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Email
              </p>

                <div className="mt-8 border-t border-gray-100 pt-6">
                  <EnquiryActions
                    enquiryId={enquiry.id}
                    email={enquiry.email}
                    subject={enquiry.subject}
                    status={enquiry.status}
                  />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Location
              </p>

              <p className="mt-2 text-gray-900">
                {enquiry.location}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Received
              </p>

              <p className="mt-2 text-gray-900">
                {new Date(enquiry.created_at).toLocaleString("en-NG")}
              </p>
            </div>

          </div>

          <div className="border-t border-gray-100 pt-7">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Message
            </p>

            <p className="mt-4 whitespace-pre-line leading-7 text-gray-700">
              {enquiry.message}
            </p>

          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">

            <a
              href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(
                enquiry.subject
              )}`}
              className="inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
            >
              Reply by Email
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}