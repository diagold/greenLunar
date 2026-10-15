
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MemberCompanyContent, {
  type MemberCompanyItem,
  type MemberCompanySettings,
} from "@/components/memberCompany/MemberCompanyContent";

export const metadata: Metadata = {
  title: "Member Companies | Green Lunar Group",
  description:
    "Explore the member companies of Green Lunar Group and our diverse business interests.",
};

// These names must match your actual Supabase tables.
const SETTINGS_TABLE = "member_company_settings";
const COMPANIES_TABLE = "member_company_items";

const defaultSettings: MemberCompanySettings = {
  id: "",
  eyebrow: "Our Group",
  heading: "Our Member Companies",
  highlight: null,
  description:
    "Explore the businesses and organisations that make up Green Lunar Group.",
  secondary_description: null,
  statement_eyebrow: null,
  statement_heading: null,
  statement_highlight: null,
  statement_description: null,
  cta_label: null,
  cta_url: null,
  is_active: true,
};

export default async function MemberCompanyPage() {
  const supabase = await createClient();

  const [settingsResult, companiesResult] = await Promise.all([
    supabase
      .from(SETTINGS_TABLE)
      .select("*")
      .limit(1)
      .maybeSingle(),

    supabase
      .from(COMPANIES_TABLE)
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (settingsResult.error) {
    console.error(
      "Failed to load member company settings:",
      settingsResult.error.message
    );
  }

  if (companiesResult.error) {
    console.error(
      "Failed to load member companies:",
      companiesResult.error.message
    );
  }

  const rawSettings = settingsResult.data;

  const settings: MemberCompanySettings = {
    ...defaultSettings,
    ...(rawSettings ?? {}),
    heading:
      rawSettings?.heading ??
      defaultSettings.heading,
    description:
      rawSettings?.description ??
      defaultSettings.description,
    is_active:
      rawSettings?.is_active ??
      defaultSettings.is_active,
  };

  const companies: MemberCompanyItem[] = Array.isArray(
    companiesResult.data
  )
    ? (companiesResult.data as MemberCompanyItem[])
        .filter(
          (company) =>
            typeof company.image_url === "string" &&
            company.image_url.trim().length > 0
        )
    : [];

  if (!settings.is_active) {
    return null;
  }

  return (
    <MemberCompanyContent
      settings={settings}
      companies={companies}
    />
  );
}
