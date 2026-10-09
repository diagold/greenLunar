import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedNumber from "@/components/AnimatedNumber";
import GroupChairman from "@/components/GroupChairman";

import { routes } from "@/config/routes";


/* =========================================================
   PUBLIC SUPABASE CLIENT
========================================================= */

function createPublicSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase public environment variables are missing."
    );
  }

  return createClient(
    url,
    anonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}


/* =========================================================
   PAGE
========================================================= */

export default async function AboutPage() {
  const supabase =
    createPublicSupabaseClient();


  /* =======================================================
     LOAD MAIN ABOUT SECTIONS
  ======================================================= */

  const [
    heroResult,
    whoResult,
    glanceResult,
    purposeResult,
    certificationsResult,
    leadershipResult,
  ] = await Promise.all([
    supabase
      .from("about_hero")
      .select(`
        id,
        heading,
        highlight,
        ending,
        description,
        image_url,
        image_alt,
        is_active
      `)
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("about_who_we_are")
      .select(`
        id,
        eyebrow,
        heading,
        highlight,
        paragraph_one,
        paragraph_two,
        paragraph_three,
        is_active
      `)
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("about_at_a_glance")
      .select(`
        id,
        eyebrow,
        description,
        is_active
      `)
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("about_purpose")
      .select(`
        id,
        eyebrow,
        heading,
        highlight,

        mission_label,
        mission_heading,
        mission_description,

        vision_label,
        vision_heading,
        vision_description,

        values_label,
        values_heading,

        is_active
      `)
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle(),

    supabase
      .from(
        "about_certifications_standards"
      )
      .select(`
        id,

        eyebrow,
        heading,
        highlight,
        description,

        frameworks_eyebrow,
        frameworks_heading,
        frameworks_highlight,
        frameworks_description,

        is_active
      `)
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("about_leadership")
      .select(`
        id,

        eyebrow,
        heading,
        highlight,
        description,

        chairman_image_url,
        chairman_image_alt,
        chairman_label,
        chairman_position,
        chairman_name,
        chairman_description,

        executives_eyebrow,
        executives_heading,

        team_description,
        team_label,

        is_active
      `)
      .eq("is_active", true)
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle(),
  ]);


  /* =======================================================
     MAIN SECTION DATA
  ======================================================= */

  const hero =
    heroResult.data;

  const who =
    whoResult.data;

  const glance =
    glanceResult.data;

  const purpose =
    purposeResult.data;

  const certifications =
    certificationsResult.data;

  const leadership =
    leadershipResult.data;


  /* =======================================================
     LOG QUERY ERRORS
  ======================================================= */

  logSupabaseError(
    "About Hero",
    heroResult.error
  );

  logSupabaseError(
    "Who We Are",
    whoResult.error
  );

  logSupabaseError(
    "At a Glance",
    glanceResult.error
  );

  logSupabaseError(
    "Our Purpose",
    purposeResult.error
  );

  logSupabaseError(
    "Certifications",
    certificationsResult.error
  );

  logSupabaseError(
    "Leadership",
    leadershipResult.error
  );


  /* =======================================================
     LOAD CHILD COLLECTIONS
  ======================================================= */

  const [
    whoImagesResult,
    statsResult,
    valuesResult,
    certificationItemsResult,
    certificationLogosResult,
    leadershipMembersResult,
  ] = await Promise.all([
    who
      ? supabase
          .from(
            "about_who_we_are_images"
          )
          .select(`
            id,
            section_id,
            image_url,
            image_alt,
            sort_order,
            is_active
          `)
          .eq(
            "section_id",
            who.id
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),

    glance
      ? supabase
          .from(
            "about_at_a_glance_stats"
          )
          .select(`
            id,
            section_id,
            value,
            suffix,
            title,
            description,
            sort_order,
            is_active
          `)
          .eq(
            "section_id",
            glance.id
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),

    purpose
      ? supabase
          .from(
            "about_core_values"
          )
          .select(`
            id,
            section_id,
            number,
            title,
            sort_order,
            is_active
          `)
          .eq(
            "section_id",
            purpose.id
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),

    certifications
      ? supabase
          .from(
            "about_certification_items"
          )
          .select(`
            id,
            section_id,
            title,
            description,
            icon,
            sort_order,
            is_active
          `)
          .eq(
            "section_id",
            certifications.id
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),

    certifications
      ? supabase
          .from(
            "about_certification_logos"
          )
          .select(`
            id,
            section_id,
            name,
            logo_url,
            image_alt,
            website_url,
            sort_order,
            is_active
          `)
          .eq(
            "section_id",
            certifications.id
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),

    leadership
      ? supabase
          .from(
            "about_leadership_members"
          )
          .select(`
            id,
            section_id,
            name,
            role,
            description,
            image_url,
            image_alt,
            profile_url,
            sort_order,
            is_active
          `)
          .eq(
            "section_id",
            leadership.id
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),
  ]);


  /* =======================================================
     COLLECTION DATA
  ======================================================= */

  const whoImages =
    whoImagesResult.data ?? [];

  const stats =
    statsResult.data ?? [];

  const coreValues =
    valuesResult.data ?? [];

  const certificationItems =
    certificationItemsResult.data ??
    [];

  const certificationLogos =
    certificationLogosResult.data ??
    [];

  const leadershipMembers =
    leadershipMembersResult.data ??
    [];


  /* =======================================================
     LOG CHILD QUERY ERRORS
  ======================================================= */

  logSupabaseError(
    "Who We Are Images",
    whoImagesResult.error
  );

  logSupabaseError(
    "At a Glance Stats",
    statsResult.error
  );

  logSupabaseError(
    "Core Values",
    valuesResult.error
  );

  logSupabaseError(
    "Certification Items",
    certificationItemsResult.error
  );

  logSupabaseError(
    "Certification Logos",
    certificationLogosResult.error
  );

  logSupabaseError(
    "Leadership Members",
    leadershipMembersResult.error
  );


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-white">

      <Navbar />


      {/* ===================================================
          ABOUT HERO
      =================================================== */}

      {hero && (
        <section className="relative min-h-[520px] overflow-hidden bg-[#063d2b] sm:min-h-[560px] lg:min-h-[600px]">

          {/* Hero Image */}

          {hero.image_url && (
            <div className="absolute inset-0">

              <img
                src={
                  hero.image_url
                }
                alt={
                  hero.image_alt ||
                  "GreenLunar Technologies"
                }
                className="h-full w-full object-cover object-center"
              />

            </div>
          )}


          {/* Dark Overlay */}

          <div className="absolute inset-0 bg-black/45" />


          {/* Green Gradient */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/90 via-[#063d2b]/55 to-transparent" />


          {/* Hero Content */}

          <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 pb-16 sm:min-h-[560px] sm:px-8 sm:pb-20 lg:min-h-[600px] lg:px-10 lg:pb-24">

            <div className="max-w-4xl">

              <h1 className="text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-8xl">

                {hero.heading}

                {hero.highlight && (
                  <span className="block text-green-400">
                    {
                      hero.highlight
                    }
                  </span>
                )}

                {hero.ending && (
                  <span className="block">
                    {hero.ending}
                  </span>
                )}

              </h1>


              {hero.description && (
                <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                  {
                    hero.description
                  }
                </p>
              )}

            </div>

          </div>

        </section>
      )}


      {/* ===================================================
          WHO WE ARE
      =================================================== */}

      {who && (
        <section className="bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">

              {/* CONTENT */}

              <div>

                {who.eyebrow && (
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-600">
                    {
                      who.eyebrow
                    }
                  </p>
                )}


                <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl">

                  {who.heading}

                  {who.highlight && (
                    <span className="block text-green-600">
                      {
                        who.highlight
                      }
                    </span>
                  )}

                </h2>


                <div className="mt-7 space-y-5 text-base leading-8 text-gray-600">

                  {who.paragraph_one && (
                    <p>
                      {
                        who.paragraph_one
                      }
                    </p>
                  )}

                  {who.paragraph_two && (
                    <p>
                      {
                        who.paragraph_two
                      }
                    </p>
                  )}

                  {who.paragraph_three && (
                    <p>
                      {
                        who.paragraph_three
                      }
                    </p>
                  )}

                </div>

              </div>


              {/* IMAGE COLLAGE */}

              {whoImages.length > 0 && (
                <div className="relative overflow-hidden rounded-xl bg-[#ecfdf5]">

                  <div className="grid grid-cols-2 gap-5 p-5">

                    {whoImages
                      .slice(0, 4)
                      .map(
                        (image) => (
                          <div
                            key={
                              image.id
                            }
                            className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
                          >

                            <img
                              src={
                                image.image_url
                              }
                              alt={
                                image.image_alt ||
                                "GreenLunar"
                              }
                              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
                            />

                          </div>
                        )
                      )}

                  </div>

                </div>
              )}

            </div>

          </div>

        </section>
      )}


      {/* ===================================================
          AT A GLANCE
      =================================================== */}

      {glance && (
        <section className="bg-[#063d2b] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-3xl">

              {glance.eyebrow && (
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
                  {
                    glance.eyebrow
                  }
                </p>
              )}


              {glance.description && (
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                  {
                    glance.description
                  }
                </p>
              )}

            </div>


            {stats.length > 0 && (
              <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">

                {stats.map(
                  (stat) => (
                    <div
                      key={
                        stat.id
                      }
                      className="bg-[#063d2b] px-8 py-10 sm:px-10 sm:py-12"
                    >

                      <p className="text-5xl font-medium tracking-tight text-green-400 sm:text-6xl">

                        <AnimatedNumber
                          value={
                            stat.value
                          }
                        />

                        {stat.suffix && (
                          <span>
                            {
                              stat.suffix
                            }
                          </span>
                        )}

                      </p>


                      <div className="mt-5 h-px w-10 bg-green-400/50" />


                      <h3 className="mt-5 text-base font-medium text-white">
                        {
                          stat.title
                        }
                      </h3>


                      {stat.description && (
                        <p className="mt-2 text-sm leading-6 text-white/45">
                          {
                            stat.description
                          }
                        </p>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>
      )}


      {/* ===================================================
          OUR PURPOSE
      =================================================== */}

      {purpose && (
        <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-2xl">

              {purpose.eyebrow && (
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-600">
                  {
                    purpose.eyebrow
                  }
                </p>
              )}


              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">

                {purpose.heading}

                {purpose.highlight && (
                  <span className="block text-green-600">
                    {
                      purpose.highlight
                    }
                  </span>
                )}

              </h2>

            </div>


            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* MISSION */}

              <div className="rounded-xl bg-[#063d2b] p-10 sm:p-12 lg:p-14">

                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                  {
                    purpose.mission_label
                  }
                </p>


                <h3 className="mt-6 text-3xl font-medium leading-tight text-white sm:text-4xl">
                  {
                    purpose.mission_heading
                  }
                </h3>


                <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
                  {
                    purpose.mission_description
                  }
                </p>

              </div>


              {/* VISION */}

              <div className="rounded-xl bg-green-100 p-10 sm:p-12 lg:p-14">

                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-700">
                  {
                    purpose.vision_label
                  }
                </p>


                <h3 className="mt-6 text-3xl font-medium leading-tight text-[#063d2b] sm:text-4xl">
                  {
                    purpose.vision_heading
                  }
                </h3>


                <p className="mt-6 max-w-xl text-base leading-8 text-[#063d2b]/65">
                  {
                    purpose.vision_description
                  }
                </p>

              </div>


              {/* CORE VALUES */}

              <div className="rounded-xl bg-[#063d2b] p-10 sm:p-12 lg:p-14">

                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                  {
                    purpose.values_label
                  }
                </p>


                <h3 className="mt-6 text-3xl font-medium leading-tight text-white sm:text-4xl">
                  {
                    purpose.values_heading
                  }
                </h3>


                <div className="mt-8 space-y-5">

                  {coreValues.map(
                    (value) => (
                      <div
                        key={
                          value.id
                        }
                        className="flex items-start gap-4"
                      >

                        <span className="text-sm font-medium text-green-600">
                          {
                            value.number
                          }
                        </span>


                        <p className="text-base leading-7 text-white/60">
                          {
                            value.title
                          }
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </section>
      )}


      {/* ===================================================
          CERTIFICATIONS & GLOBAL STANDARDS
      =================================================== */}

      {certifications && (
        <section className="bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

          <div className="mx-auto max-w-7xl">

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">

              {/* LEFT */}

              <div>

                {certifications.eyebrow && (
                  <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                    {
                      certifications.eyebrow
                    }
                  </p>
                )}


                <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                  {
                    certifications.heading
                  }

                  {certifications.highlight && (
                    <span className="block text-green-600">
                      {
                        certifications.highlight
                      }
                    </span>
                  )}

                </h2>


                {certifications.description && (
                  <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
                    {
                      certifications.description
                    }
                  </p>
                )}

              </div>


              {/* STANDARD CARDS */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {certificationItems.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id
                      }
                      className={`rounded-xl p-7 shadow-[0_10px_30px_rgba(0,0,0,0.05)] ${
                        index % 2 ===
                        0
                          ? "bg-[#f7faf8]"
                          : "bg-[#ecfdf5]"
                      }`}
                    >

                      <CertificationIcon
                        icon={
                          item.icon
                        }
                      />


                      <h3 className="mt-6 text-xl font-medium text-gray-900">
                        {
                          item.title
                        }
                      </h3>


                      {item.description && (
                        <p className="mt-3 text-sm leading-7 text-gray-600">
                          {
                            item.description
                          }
                        </p>
                      )}

                    </div>
                  )
                )}

              </div>

            </div>


            {/* =============================================
                COMMITMENT

                This remains hardcoded for now because the
                current admin form does not yet manage the
                commitment fields.
            ============================================== */}

            <div className="mt-14 rounded-xl bg-[#063d2b] px-8 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">

              <div className="max-w-3xl">

                <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-400">
                  Our Commitment
                </p>


                <h3 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
                  Building trust through
                  compliance, quality and
                  accountability.
                </h3>


                <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                  Our goal is to continuously
                  strengthen our systems,
                  certifications and operating
                  practices as GreenLunar grows
                  across Nigeria and
                  international markets.
                </p>

              </div>

            </div>


            {/* =============================================
                CERTIFICATIONS & FRAMEWORKS
            ============================================== */}

            <div className="mt-14">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  {certifications.frameworks_eyebrow && (
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-600">
                      {
                        certifications.frameworks_eyebrow
                      }
                    </p>
                  )}


                  <h3 className="mt-3 text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl">

                    {
                      certifications.frameworks_heading
                    }

                    {certifications.frameworks_highlight && (
                      <span className="text-green-600">
                        {" "}
                        {
                          certifications.frameworks_highlight
                        }
                      </span>
                    )}

                  </h3>

                </div>


                {certifications.frameworks_description && (
                  <p className="max-w-md text-sm leading-6 text-gray-500">
                    {
                      certifications.frameworks_description
                    }
                  </p>
                )}

              </div>


              {/* LOGOS */}

              {certificationLogos.length >
                0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.05)] lg:flex-nowrap lg:p-7">

                  {certificationLogos.map(
                    (logo) => {

                      const logoContent = (
                        <div className="group flex h-[130px] w-full items-center justify-center rounded-lg bg-[#f7faf8] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:w-[220px] lg:w-[200px]">

                          <img
                            src={
                              logo.logo_url
                            }
                            alt={
                              logo.image_alt ||
                              logo.name
                            }
                            className="max-h-[75px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />

                        </div>
                      );


                      if (
                        logo.website_url
                      ) {
                        return (
                          <a
                            key={
                              logo.id
                            }
                            href={
                              logo.website_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={
                              logo.name
                            }
                          >
                            {
                              logoContent
                            }
                          </a>
                        );
                      }


                      return (
                        <div
                          key={
                            logo.id
                          }
                        >
                          {
                            logoContent
                          }
                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </div>

        </section>
      )}


      {/* ===================================================
          LEADERSHIP
      =================================================== */}

      {leadership && (
        <section className="w-full bg-white">

          {/* ===============================================
              LEADERSHIP INTRODUCTION
          ================================================ */}

          <div className="px-6 pb-8 pt-10 sm:px-8 sm:pt-12 lg:px-10 lg:pt-14">

            <div className="mx-auto max-w-3xl text-center">

              {leadership.eyebrow && (
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-green-700">
                  {
                    leadership.eyebrow
                  }
                </p>
              )}


              <div className="mx-auto mt-3 h-[2px] w-14 bg-green-700" />


              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                {
                  leadership.heading
                }

                {leadership.highlight && (
                  <span className="text-green-700">
                    {" "}
                    {
                      leadership.highlight
                    }
                  </span>
                )}

              </h2>


              {leadership.description && (
                <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                  {
                    leadership.description
                  }
                </p>
              )}

            </div>

          </div>



        {/* ===============================================
            GROUP CHAIRMAN
        ================================================ */}

        <GroupChairman
          imageUrl={leadership.chairman_image_url}
          imageAlt={leadership.chairman_image_alt}
          label={leadership.chairman_label}
          position={leadership.chairman_position}
          name={leadership.chairman_name}
          description={leadership.chairman_description}
        />


          {/* ===============================================
              EXECUTIVE LEADERSHIP
          ================================================ */}

          <div className="flex items-center justify-center px-6 pb-12 pt-10 sm:px-8 lg:px-10 lg:pb-14 lg:pt-12">

            <div className="mx-auto w-full max-w-7xl">

              {/* HEADING */}

              <div className="text-center">

                {leadership.executives_eyebrow && (
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
                    {
                      leadership.executives_eyebrow
                    }
                  </p>
                )}


                {leadership.executives_heading && (
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    {
                      leadership.executives_heading
                    }
                  </h3>
                )}

              </div>


              {/* EXECUTIVE CARDS */}

              {leadershipMembers.length >
                0 && (
                <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 justify-center gap-8 md:grid-cols-2 xl:[grid-template-columns:repeat(3,minmax(0,1fr))]">

                  {leadershipMembers.map(
                    (member) => (
                      <article
                        key={
                          member.id
                        }
                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                      >

                        {/* IMAGE */}

                        <div className="relative h-[300px] overflow-hidden bg-gray-100">

                          {member.image_url ? (
                            <img
                              src={
                                member.image_url
                              }
                              alt={
                                member.image_alt ||
                                member.name
                              }
                              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gray-100">

                              <LeadershipPlaceholderIcon />

                            </div>
                          )}

                        </div>


                        {/* NAME + ROLE */}

                        <div className="relative z-10 mx-4 -mt-9 rounded-md bg-[#063d2b] px-4 py-4 text-center shadow-lg">

                          <h4 className="text-lg font-semibold uppercase tracking-wide text-white">
                            {
                              member.name
                            }
                          </h4>


                          <p className="mt-1 text-xs font-medium text-white/85">
                            {
                              member.role
                            }
                          </p>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="px-5 pb-5 pt-7 text-center">

                          {member.description && (
                            <p className="text-sm leading-7 text-gray-600">
                              {
                                member.description
                              }
                            </p>
                          )}


                          {member.profile_url && (
                            <Link
                              href={
                                member.profile_url
                              }
                              aria-label={`View ${member.name} profile`}
                              className="group/icon mx-auto mt-5 flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-green-700 transition-all duration-300 hover:-translate-y-1 hover:border-[#063d2b] hover:bg-[#063d2b] hover:text-white hover:shadow-md"
                            >

                              <ExecutiveProfileIcon />

                            </Link>
                          )}

                        </div>

                      </article>
                    )
                  )}

                </div>
              )}


              {/* ===========================================
                  WIDER EXECUTIVE TEAM
              ============================================ */}

              {(leadership.team_description ||
                leadership.team_label) && (
                <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-5 rounded-xl bg-[#ecfdf5] px-6 py-6 md:flex-row md:items-center md:justify-between lg:px-8">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">

                      <TeamIcon />

                    </div>


                    {leadership.team_description && (
                      <p className="max-w-3xl text-sm leading-7 text-gray-600">
                        {
                          leadership.team_description
                        }
                      </p>
                    )}

                  </div>


                  {leadership.team_label && (
                    <div className="shrink-0">

                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                        {
                          leadership.team_label
                        }
                      </span>

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </section>
      )}


      {/* ===================================================
          CTA

          CTA CMS has not been built yet, so this remains
          exactly as the current public page.
      =================================================== */}

      <section className="bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-xl bg-[#063d2b] px-8 py-16 text-center sm:px-12 lg:px-20 lg:py-20">

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Let&apos;s Work Together
            </p>


            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s build the future
              together.
            </h2>


            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/60">
              Have an idea, challenge, or
              project? Let&apos;s explore how
              technology can help move it
              forward.
            </p>


            <Link
              href={routes.contact}
              className="mt-9 inline-flex items-center gap-2 rounded-md bg-green-500 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-green-400"
            >
              Contact Us Today
            </Link>

          </div>

        </div>

      </section>


      <Footer />

    </main>
  );
}


/* =========================================================
   CERTIFICATION ICON
========================================================= */

function CertificationIcon({
  icon,
}: {
  icon: string | null;
}) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#063d2b] text-green-400">

      {icon === "iso" ? (
        <span className="text-sm font-semibold">
          ISO
        </span>
      ) : icon === "check" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
        >
          <circle
            cx="12"
            cy="12"
            r="8"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 12 2 2 4-4"
          />
        </svg>
      ) : icon === "lock" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
        >
          <rect
            x="5"
            y="10"
            width="14"
            height="10"
            rx="2"
          />

          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l7 4v5c0 4.5-2.8 7.7-7 9-4.2-1.3-7-4.5-7-9V7l7-4Z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.5 12 1.7 1.7 3.5-3.7"
          />
        </svg>
      )}

    </div>
  );
}


/* =========================================================
   EXECUTIVE PROFILE ICON
========================================================= */

function ExecutiveProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5 transition-transform duration-300 group-hover/icon:scale-110"
    >

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />

    </svg>
  );
}


/* =========================================================
   TEAM ICON
========================================================= */

function TeamIcon() {
  return (
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
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />

    </svg>
  );
}


/* =========================================================
   LEADERSHIP PLACEHOLDER
========================================================= */

function LeadershipPlaceholderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-14 w-14 text-green-700/30"
    >

      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 21a8 8 0 0 1 16 0"
      />

    </svg>
  );
}


/* =========================================================
   SUPABASE ERROR LOGGER
========================================================= */

function logSupabaseError(
  section: string,
  error:
    | {
        message?: string;
        details?: string;
        hint?: string;
        code?: string;
      }
    | null
    | undefined
) {
  if (!error) {
    return;
  }

  console.error(
    `[About Page] ${section}:`,
    {
      message:
        error.message,

      details:
        error.details,

      hint:
        error.hint,

      code:
        error.code,
    }
  );
}