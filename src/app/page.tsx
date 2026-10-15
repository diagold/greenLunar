import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CoreSolutions from "../components/CoreSolutions";
import WhyChooseUs from "../components/WhyChooseUs";
import MarketReach from "../components/MarketReach";
import TrustSection from "../components/TrustSection";
import PartnersClients from "../components/PartnersClients";
import Footer from "../components/Footer";
import HomeFeaturedNews from "@/components/news/HomeFeaturedNews";
import MemberCompany from "@/components/memberCompany/MemberCompanyContent";

import { createClient } from "@/lib/supabase/server";
import NewsModal from "@/components/NewsModal";

import Link from "next/link";

import AnimatedNumber from "@/components/AnimatedNumber";

import GroupChairman from "@/components/GroupChairman";


import { routes } from "@/config/routes";

export default async function Home() {
  const supabase = await createClient();

  /* =========================================================
     HERO
  ========================================================= */

  const {
    data: heroSlides,
    error: heroError,
  } = await supabase
    .from("homepage_hero_slides")
    .select(`
      id,
      eyebrow,
      title,
      highlight,
      ending,
      description,
      image_url,
      sort_order,
      is_active
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (heroError) {
    console.error(
      "Unable to load homepage hero slides:",
      heroError
    );
  }

  /* =========================================================
     CORE SOLUTIONS SETTINGS
  ========================================================= */

  const {
    data: coreSolutionsSettings,
    error: coreSettingsError,
  } = await supabase
    .from("homepage_core_solutions")
    .select(`
      id,
      eyebrow,
      heading,
      highlight,
      description,
      is_active
    `)
    .eq("is_active", true)
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (coreSettingsError) {
    console.error(
      "Unable to load Core Solutions settings:",
      coreSettingsError
    );
  }

  /* =========================================================
     CORE SOLUTION ITEMS
  ========================================================= */

  const {
    data: coreSolutionItems,
    error: coreSolutionItemsError,
  } = await supabase
    .from("homepage_core_solution_items")
    .select(`
      id,
      section_id,
      title,
      description,
      image_url,
      link_url,
      link_label,
      sort_order,
      is_active
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (coreSolutionItemsError) {
    console.error(
      "Unable to load Core Solution items:",
      coreSolutionItemsError
    );
  }

  /* =========================================================
     FILTER CORE SOLUTIONS FOR CURRENT SECTION
  ========================================================= */

  const activeCoreSolutionItems =
    coreSolutionsSettings
      ? (coreSolutionItems ?? []).filter(
          (item) =>
            item.section_id ===
            coreSolutionsSettings.id
        )
      : [];

  /* =========================================================
     WHY CHOOSE US SETTINGS
  ========================================================= */

  const {
    data: whyChooseUsSettings,
    error: whyChooseUsError,
  } = await supabase
    .from("homepage_why_choose_us")
    .select(`
      id,
      eyebrow,
      heading,
      highlight,
      description,
      image_url,
      stat_value,
      stat_label,
      is_active
    `)
    .eq("is_active", true)
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();

  if (whyChooseUsError) {
    console.error(
      "Unable to load Why Choose Us settings:",
      whyChooseUsError
    );
  }

  /* =========================================================
     WHY CHOOSE US REASONS
  ========================================================= */

  const {
    data: whyChooseUsReasons,
    error: whyChooseUsReasonsError,
  } = await supabase
    .from("homepage_why_choose_us_reasons")
    .select(`
      id,
      section_id,
      number,
      title,
      description,
      sort_order,
      is_active
    `)
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (whyChooseUsReasonsError) {
    console.error(
      "Unable to load Why Choose Us reasons:",
      whyChooseUsReasonsError
    );
  }

  /* =========================================================
     FILTER WHY CHOOSE US REASONS
  ========================================================= */

  const activeWhyChooseUsReasons =
    whyChooseUsSettings
      ? (whyChooseUsReasons ?? []).filter(
          (reason) =>
            reason.section_id ===
            whyChooseUsSettings.id
        )
      : [];


      /* =========================================================
   MARKET REACH SETTINGS
========================================================= */

const {
  data: marketReachSettings,
  error: marketReachError,
} = await supabase
  .from("homepage_market_reach")
  .select(`
    id,
    eyebrow,
    heading,
    highlight,
    description,
    map_image_url,
    is_active
  `)
  .eq("is_active", true)
  .order("created_at", {
    ascending: true,
  })
  .limit(1)
  .maybeSingle();

if (marketReachError) {
  console.error(
    "Unable to load Market Reach settings:",
    marketReachError
  );
}

/* =========================================================
   MARKET REACH LOCATIONS
========================================================= */

let marketReachLocations: {
  id: string;
  section_id: string;
  name: string;
  address: string | null;
  link_url: string | null;
  link_label: string | null;
  marker_left: number | null;
  marker_top: number | null;
  sort_order: number;
  is_active: boolean;
}[] = [];

if (marketReachSettings) {
  const {
    data: locations,
    error: locationsError,
  } = await supabase
    .from("homepage_market_reach_locations")
    .select(`
      id,
      section_id,
      name,
      address,
      link_url,
      link_label,
      marker_left,
      marker_top,
      sort_order,
      is_active
    `)
    .eq(
      "section_id",
      marketReachSettings.id
    )
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (locationsError) {
    console.error(
      "Unable to load Market Reach locations:",
      locationsError
    );
  } else {
    marketReachLocations =
      locations ?? [];
  }
}

/* =========================================================
   PARTNERS & CLIENTS
========================================================= */

const {
  data: partnersClientsSettings,
  error: partnersClientsSettingsError,
} = await supabase
  .from("homepage_partners_clients")
  .select(`
    id,
    eyebrow,
    heading,
    description,
    partners_eyebrow,
    partners_heading,
    partners_description,
    clients_eyebrow,
    clients_heading,
    clients_description,
    is_active
  `)
  .eq("is_active", true)
  .order("created_at", {
    ascending: true,
  })
  .limit(1)
  .maybeSingle();

if (partnersClientsSettingsError) {
  console.error(
    "Partners & Clients settings error:",
    partnersClientsSettingsError
  );
}

let partnersClientsItems: {
  id: string;
  section_id: string;
  item_type: "partner" | "client";
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
}[] = [];

if (partnersClientsSettings) {
  const {
    data,
    error,
  } = await supabase
    .from(
      "homepage_partner_client_items"
    )
    .select(`
      id,
      section_id,
      item_type,
      name,
      logo_url,
      website_url,
      sort_order,
      is_active
    `)
    .eq(
      "section_id",
      partnersClientsSettings.id
    )
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Partners & Clients items error:",
      error
    );
  } else {
    partnersClientsItems =
      (data ?? []) as typeof partnersClientsItems;
  }
}

const homepagePartners =
  partnersClientsItems.filter(
    (item) =>
      item.item_type === "partner"
  );

const homepageClients =
  partnersClientsItems.filter(
    (item) =>
      item.item_type === "client"
  );

  /* =========================================================
   MEMBER COMPANY
========================================================= */

const {
  data: memberCompanySettings,
  error: memberCompanySettingsError,
} = await supabase
  .from("MemberCompanySettings")
  .select(`
    id,
    eyebrow,
    heading,
    highlight,
    description,
    secondary_description,
    statement_eyebrow,
    statement_heading,
    statement_highlight,
    statement_description,
    cta_label,
    cta_url,
    is_active
  `)
  .eq("is_active", true)
  .order("created_at", {
    ascending: true,
  })
  .limit(1)
  .maybeSingle();

if (memberCompanySettingsError) {
  console.error(
    "Member Company settings error:",
    memberCompanySettingsError
  );
}

/* =========================================================
   MEMBER COMPANY ITEMS
========================================================= */

let memberCompanyItems: {
  id: string;
  section_id: string;
  name: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}[] = [];

if (memberCompanySettings) {
  const {
    data,
    error,
  } = await supabase
    .from(
      "MemberCompanyItem"
    )
    .select(`
      id,
      section_id,
      name,
      image_url,
      link_url,
      sort_order,
      is_active
    `)
    .eq(
      "section_id",
      memberCompanySettings.id
    )
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Member Company items error:",
      error
    );
  } else {
    memberCompanyItems =
      (data ??
        []) as typeof memberCompanyItems;
  }
}

  const {
    data: leadership,
    error: leadershipError,
  } = await supabase
    .from("about_leadership")
    .select(`
      id,
      chairman_image_url,
      chairman_image_alt,
      chairman_label,
      chairman_position,
      chairman_name,
      chairman_description,
      is_active
    `)
    .eq("is_active", true)
    .order("created_at", {
      ascending: true,
    })
    .limit(1)
    .maybeSingle();


  /* =======================================================
     ERROR LOGGING

     We don't crash the homepage if the Chairman query
     fails. All other homepage sections can still render.
  ======================================================= */

  if (leadershipError) {
    console.error(
      "[Homepage] Unable to load Group Chairman:",
      {
        message:
          leadershipError.message,

        details:
          leadershipError.details,

        hint:
          leadershipError.hint,

        code:
          leadershipError.code,
      }
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <main>

    {/* <NewsModal
        image="/images/news/latest-news.jpg"
        category="Latest News"
        title="GreenLunar continues to build technology that moves business forward."
        description="Stay informed about our latest innovations, partnerships, projects and developments across GreenLunar Group."
        link="/news"
        linkText="Read More"
      /> */}

      <Navbar />

      <Hero slides={heroSlides ?? []} />

      {coreSolutionsSettings && (
        <CoreSolutions
          settings={coreSolutionsSettings}
          items={activeCoreSolutionItems}
        />
      )}

      {whyChooseUsSettings && (
        <WhyChooseUs
          settings={whyChooseUsSettings}
          reasons={activeWhyChooseUsReasons}
        />
      )}

      {marketReachSettings && (
        <MarketReach
          settings={marketReachSettings}
          locations={marketReachLocations}
        />
      )}

      <TrustSection />

      {memberCompanySettings && (
      <MemberCompany
            settings={
              memberCompanySettings
            }
            companies={
              memberCompanyItems
            }
          />
        )}


    {/* ===============================================
        GROUP CHAIRMAN
    ================================================ */}

      {leadership && (
        <GroupChairman
          imageUrl={leadership.chairman_image_url}
          imageAlt={leadership.chairman_image_alt}
          label={leadership.chairman_label}
          position={leadership.chairman_position}
          name={leadership.chairman_name}
          description={leadership.chairman_description}
        />
      )}

      <HomeFeaturedNews />

      {partnersClientsSettings && (
      <PartnersClients
        settings={
          partnersClientsSettings
        }
        partners={
          homepagePartners
        }
        clients={
          homepageClients
        }
      />
    )}

      <Footer />
    </main>
  );
}