"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderKanban,
  Handshake,
  Home,
  ImageIcon,
  Info,
  Layers3,
  Menu,
  Newspaper,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavChild[];
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

type AdminSidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newEnquiries: number;
};

/* =========================================================
   NAVIGATION
========================================================= */

function getNavigation(enquiryCount: number): NavSection[] {
  return [
    {
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: BarChart3,
        },
      ],
    },

    {
      title: "WEBSITE",
      items: [
        {
          label: "Homepage",
          icon: Home,
          children: [
            // {
            //   label: "Overview",
            //   href: "/admin/homepage",
            // },
            {
              label: "Hero",
              href: "/admin/homepage/hero",
            },
            {
              label: "Core Solutions",
              href: "/admin/homepage/core-solutions",
            },
            {
              label: "Why Choose Us",
              href: "/admin/homepage/why-choose-us",
            }, 
            {
              label: "Market Reach",
              href: "/admin/homepage/market-reach",
            },
             
             {
                label: "Trust Section",
               href: "/admin/homepage/trust",
              },
              {
                label: "Member Company",
                href: "/admin/homepage/member-company",
              },
              {
                label: "Partners & Clients",
               href: "/admin/homepage/partners-clients",
              },
            
          ],
        },

        /*
         * ABOUT US
         *
         * We are preparing the group now, but its child pages
         * should be added as we build the About CMS.
         */
        {
          label: "About Us",
          icon: Info,
          children: [
     
            {
              label: "Hero",
              href: "/admin/about/hero",
            },
            {
              label: "Who We Are",
              href: "/admin/about/who-we-are",
            },
            {
              label: "At A Glance",
              href: "/admin/about/at-a-glance",
            }, 
            {
              label: "Our Purpose",
              href: "/admin/about/purpose",
            },
             
             {
                label: "Certification & Standard",
               href: "/admin/about/certifications-standards",
              },
              {
                label: "Leadership",
                href: "/admin/about/leadership",
              },
              // {
              //   label: "Partners & Clients",
              //  href: "/admin/homepage/partners-clients",
              // },
            
          ],
        },
        {
          label: "About Us",
          icon: Info,
        },

        {
          label: "Services",
          href: "/admin/services",
          icon: Layers3,
        },

        {
          label: "Products",
          href: "/admin/products",
          icon: Package,
        },

        {
          label: "News",
          href: "/admin/news",
          icon: Newspaper,
          
        },


      ],
    },

    {
      title: "CONTENT",
      items: [
        {
          label: "Enquiries",
          href: "/admin/enquiries",
          icon: FileText,
          badge: enquiryCount,
        },
        {
          label: "Projects",
          href: "/admin/projects",
          icon: FolderKanban,
        },
        {
          label: "Team",
          href: "/admin/team",
          icon: Users,
        },
        {
          label: "Partners",
          href: "/admin/partners",
          icon: Handshake,
        },
        {
          label: "Media",
          href: "/admin/media",
          icon: ImageIcon,
        },
      ],
    },

    {
      title: "ADMINISTRATION",
      items: [
        {
          label: "SEO",
          href: "/admin/seo",
          icon: Search,
        },
        {
          label: "Settings",
          href: "/admin/settings",
          icon: Settings,
        },
        {
          label: "Users",
          href: "/admin/users",
          icon: ShieldCheck,
        },
        {
          label: "Audit Log",
          href: "/admin/audit-log",
          icon: FileText,
        },
      ],
    },
  ];
}

/* =========================================================
   SIDEBAR
========================================================= */

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
  newEnquiries,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  const navigation = getNavigation(newEnquiries);

  /* =========================================================
     EXPANDED MENU STATE
  ========================================================= */

  const [expandedMenus, setExpandedMenus] = useState<
    Record<string, boolean>
  >({});

  /* =========================================================
     CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  /* =========================================================
     AUTOMATICALLY OPEN CURRENT PAGE GROUP
  ========================================================= */

  useEffect(() => {
    const nextExpanded: Record<string, boolean> = {};

    navigation.forEach((section) => {
      section.items.forEach((item) => {
        if (!item.children?.length) return;

        const hasActiveChild = item.children.some((child) =>
          isExactOrNestedActive(child.href)
        );

        if (hasActiveChild) {
          nextExpanded[item.label] = true;
        }
      });
    });

    setExpandedMenus((current) => ({
      ...current,
      ...nextExpanded,
    }));
  }, [pathname]);

  /* =========================================================
     ACTIVE ROUTES
  ========================================================= */

  function isExactOrNestedActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  /*
   * Child routes need more precise matching.
   *
   * Without this, /admin/homepage would also appear active
   * when visiting /admin/homepage/hero.
   */
  function isChildActive(
    href: string,
    siblings: NavChild[]
  ) {
    if (pathname === href) {
      return true;
    }

    const moreSpecificChildExists = siblings.some(
      (child) =>
        child.href !== href &&
        child.href.startsWith(`${href}/`) &&
        (pathname === child.href ||
          pathname.startsWith(`${child.href}/`))
    );

    if (moreSpecificChildExists) {
      return false;
    }

    return pathname.startsWith(`${href}/`);
  }

  function isParentActive(item: NavItem) {
    if (item.children?.length) {
      return item.children.some((child) =>
        isChildActive(child.href, item.children!)
      );
    }

    return item.href
      ? isExactOrNestedActive(item.href)
      : false;
  }

  /* =========================================================
     MENU CONTROLS
  ========================================================= */

  function toggleMenu(label: string) {
    if (collapsed) {
      setCollapsed(false);

      setExpandedMenus((current) => ({
        ...current,
        [label]: true,
      }));

      return;
    }

    setExpandedMenus((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          left-4
          top-4
          z-40
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-gray-200
          bg-white
          text-gray-700
          shadow-sm
          lg:hidden
        "
        aria-label="Open admin navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-[1px]
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          bg-[#073f30]
          text-white
          shadow-xl
          transition-all
          duration-300

          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          ${
            collapsed
              ? "w-[88px]"
              : "w-[260px]"
          }
        `}
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <div
          className="
            flex
            h-[108px]
            shrink-0
            items-center
            justify-between
            border-b
            border-white/10
            px-5
          "
        >
          <Link
            href="/admin"
            className={`
              flex
              items-center
              ${
                collapsed
                  ? "w-full justify-center"
                  : "gap-3"
              }
            `}
          >
            <div
              className="
                relative
                h-14
                w-14
                shrink-0
              "
            >
              <Image
                src="https://res.cloudinary.com/diobpauw/image/upload/v1789023068/ChatGPT_Image_Sep_10_2026_07_50_53_AM.png"
                alt="Green Lunar"
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Green Lunar
                </p>

                <p className="mt-0.5 text-[11px] text-white/50">
                  Admin Portal
                </p>
              </div>
            )}
          </Link>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-white/70
              transition
              hover:bg-white/10
              hover:text-white
              lg:hidden
            "
            aria-label="Close admin navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-6
          "
        >
          <div className="space-y-7">
            {navigation.map((section, sectionIndex) => (
              <div
                key={
                  section.title ??
                  `section-${sectionIndex}`
                }
              >
                {/* SECTION TITLE */}

                {section.title && !collapsed && (
                  <p
                    className="
                      mb-3
                      px-3
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-white/40
                    "
                  >
                    {section.title}
                  </p>
                )}

                {section.title && collapsed && (
                  <div
                    className="
                      mx-auto
                      mb-4
                      h-px
                      w-8
                      bg-white/10
                    "
                  />
                )}

                {/* ITEMS */}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    const active =
                      isParentActive(item);

                    const hasChildren =
                      Boolean(item.children?.length);

                    const expanded =
                      Boolean(
                        expandedMenus[item.label]
                      );

                    /* =====================================
                       PARENT WITH SUBMENU
                    ====================================== */

                    if (hasChildren) {
                      return (
                        <div key={item.label}>
                          <button
                            type="button"
                            onClick={() =>
                              toggleMenu(item.label)
                            }
                            title={
                              collapsed
                                ? item.label
                                : undefined
                            }
                            className={`
                              group
                              relative
                              flex
                              min-h-[46px]
                              w-full
                              items-center
                              rounded-xl
                              transition-all
                              duration-200

                              ${
                                collapsed
                                  ? "justify-center px-2"
                                  : "gap-3 px-3"
                              }

                              ${
                                active
                                  ? "bg-white/15 text-white"
                                  : "text-white/75 hover:bg-white/10 hover:text-white"
                              }
                            `}
                          >
                            <Icon
                              className={`
                                h-[19px]
                                w-[19px]
                                shrink-0

                                ${
                                  active
                                    ? "text-green-300"
                                    : "text-white/70 group-hover:text-white"
                                }
                              `}
                            />

                            {!collapsed && (
                              <>
                                <span
                                  className="
                                    flex-1
                                    truncate
                                    text-left
                                    text-sm
                                    font-medium
                                  "
                                >
                                  {item.label}
                                </span>

                                <ChevronDown
                                  className={`
                                    h-4
                                    w-4
                                    shrink-0
                                    text-white/50
                                    transition-transform
                                    duration-200

                                    ${
                                      expanded
                                        ? "rotate-180"
                                        : ""
                                    }
                                  `}
                                />
                              </>
                            )}
                          </button>

                          {/* CHILDREN */}

                          {!collapsed &&
                            expanded && (
                              <div
                                className="
                                  relative
                                  ml-[21px]
                                  mt-1
                                  space-y-1
                                  border-l
                                  border-white/10
                                  pb-1
                                  pl-4
                                "
                              >
                                {item.children!.map(
                                  (child) => {
                                    const childActive =
                                      isChildActive(
                                        child.href,
                                        item.children!
                                      );

                                    return (
                                      <Link
                                        key={child.href}
                                        href={child.href}
                                        className={`
                                          relative
                                          flex
                                          min-h-[38px]
                                          items-center
                                          rounded-lg
                                          px-3
                                          text-[13px]
                                          font-medium
                                          transition-all
                                          duration-200

                                          ${
                                            childActive
                                              ? "bg-white text-[#073f30] shadow-sm"
                                              : "text-white/60 hover:bg-white/10 hover:text-white"
                                          }
                                        `}
                                      >
                                        {/* ACTIVE DOT */}

                                        <span
                                          className={`
                                            mr-3
                                            h-1.5
                                            w-1.5
                                            shrink-0
                                            rounded-full

                                            ${
                                              childActive
                                                ? "bg-green-500"
                                                : "bg-white/20"
                                            }
                                          `}
                                        />

                                        <span className="truncate">
                                          {
                                            child.label
                                          }
                                        </span>
                                      </Link>
                                    );
                                  }
                                )}
                              </div>
                            )}
                        </div>
                      );
                    }

                    /* =====================================
                       NORMAL NAVIGATION ITEM
                    ====================================== */

                    if (!item.href) {
                      return null;
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={
                          collapsed
                            ? item.label
                            : undefined
                        }
                        className={`
                          group
                          relative
                          flex
                          min-h-[46px]
                          items-center
                          rounded-xl
                          transition-all
                          duration-200

                          ${
                            collapsed
                              ? "justify-center px-2"
                              : "gap-3 px-3"
                          }

                          ${
                            active
                              ? "bg-white text-[#073f30] shadow-sm"
                              : "text-white/75 hover:bg-white/10 hover:text-white"
                          }
                        `}
                      >
                        <Icon
                          className={`
                            h-[19px]
                            w-[19px]
                            shrink-0

                            ${
                              active
                                ? "text-[#073f30]"
                                : "text-white/70 group-hover:text-white"
                            }
                          `}
                        />

                        {!collapsed && (
                          <>
                            <span
                              className="
                                flex-1
                                truncate
                                text-sm
                                font-medium
                              "
                            >
                              {item.label}
                            </span>

                            {typeof item.badge ===
                              "number" &&
                              item.badge > 0 && (
                                <span
                                  className={`
                                    flex
                                    min-w-[22px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    px-1.5
                                    py-0.5
                                    text-[10px]
                                    font-semibold

                                    ${
                                      active
                                        ? "bg-[#073f30] text-white"
                                        : "bg-green-400 text-[#073f30]"
                                    }
                                  `}
                                >
                                  {item.badge >
                                  99
                                    ? "99+"
                                    : item.badge}
                                </span>
                              )}
                          </>
                        )}

                        {/* COLLAPSED BADGE */}

                        {collapsed &&
                          typeof item.badge ===
                            "number" &&
                          item.badge > 0 && (
                            <span
                              className="
                                absolute
                                right-2
                                top-2
                                h-2
                                w-2
                                rounded-full
                                bg-green-400
                              "
                            />
                          )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* =================================================
            COLLAPSE CONTROL
        ================================================== */}

        <div
          className="
            hidden
            shrink-0
            border-t
            border-white/10
            p-3
            lg:block
          "
        >
          <button
            type="button"
            onClick={() =>
              setCollapsed(
                (previous) => !previous
              )
            }
            className={`
              flex
              h-11
              w-full
              items-center
              rounded-xl
              text-white/60
              transition
              hover:bg-white/10
              hover:text-white

              ${
                collapsed
                  ? "justify-center"
                  : "gap-3 px-3"
              }
            `}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />

                <span className="text-sm font-medium">
                  Collapse Menu
                </span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* =====================================================
          DESKTOP SIDEBAR SPACER
      ====================================================== */}

      <div
        className={`
          hidden
          shrink-0
          transition-all
          duration-300
          lg:block

          ${
            collapsed
              ? "w-[88px]"
              : "w-[260px]"
          }
        `}
      />
    </>
  );
}