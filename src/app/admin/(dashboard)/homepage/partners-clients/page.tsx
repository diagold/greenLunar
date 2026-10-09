import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import PartnersClientsForm from "@/components/admin/homepage/partners-clients/PartnersClientsForm";

export default async function PartnersClientsAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const {
    data: settings,
    error: settingsError,
  } = await supabase
    .from("homepage_partners_clients")
    .select("*")
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (settingsError || !settings) {
    console.error(
      "Partners & Clients settings error:",
      settingsError
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load Partners & Clients
        </h1>

        <p className="mt-2 text-sm text-red-600">
          Please confirm that the Partners & Clients database
          tables and seed data have been created.
        </p>
      </div>
    );
  }

  const {
    data: items,
    error: itemsError,
  } = await supabase
    .from("homepage_partner_client_items")
    .select("*")
    .eq("section_id", settings.id)
    .order("sort_order", {
      ascending: true,
    });

  if (itemsError) {
    console.error(
      "Partners & Clients items error:",
      itemsError
    );

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">
          Unable to load logos
        </h1>

        <p className="mt-2 text-sm text-red-600">
          The section exists, but its partner and client records
          could not be loaded.
        </p>
      </div>
    );
  }

  const partners =
    items?.filter(
      (item) => item.item_type === "partner"
    ) ?? [];

  const clients =
    items?.filter(
      (item) => item.item_type === "client"
    ) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-green-700">
          Homepage
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Partners & Clients
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          Manage the homepage Partners & Clients section,
          including section content, logos, visibility and
          display order.
        </p>
      </div>

      <PartnersClientsForm
        settings={settings}
        partners={partners}
        clients={clients}
      />
    </div>
  );
}