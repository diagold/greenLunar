"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  Inbox,
  FileText,
  Package,
  Layers3,
  BriefcaseBusiness,
  Users,
  Handshake,
  Images,
  Search,
  Settings,
  ShieldCheck,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

type AdminSidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  newEnquiries: number;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Enquiries",
    href: "/admin/enquiries",
    icon: Inbox,
  },
  {
    label: "Pages",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Layers3,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: BriefcaseBusiness,
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
    icon: Images,
  },
];

const administration = [
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
    icon: ScrollText,
  },
];

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
  newEnquiries,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen flex-col
          border-r border-white/10
          bg-[#073f30]
          text-white
          transition-all duration-300

          ${collapsed ? "lg:w-[88px]" : "lg:w-[270px]"}

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }

          w-[270px]
        `}
      >
        {/* LOGO */}
        <div
          className={`
            flex h-[82px] items-center
            border-b border-white/10
            px-5
            ${collapsed ? "lg:justify-center" : "justify-between"}
          `}
        >
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <img
              src="https://res.cloudinary.com/diobpauw/image/upload/v1789023068/ChatGPT_Image_Sep_10_2026_07_50_53_AM.png"
              alt="Green Lunar"
              className={`
                object-contain transition-all duration-300
                ${collapsed ? "h-10 w-10" : "h-12 w-40"}
              `}
            />
            
          </Link>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Website
            </p>
          )}

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group flex min-h-[46px] items-center
                    rounded-xl px-3
                    transition-all duration-200

                    ${
                      collapsed
                        ? "lg:justify-center lg:gap-0"
                        : "gap-3"
                    }

                    ${
                      active
                        ? "bg-white text-[#073f30] shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.3 : 1.8}
                    className="shrink-0"
                  />

                  <span
                    className={`
                      whitespace-nowrap text-sm font-medium
                      ${collapsed ? "lg:hidden" : ""}
                    `}
                  >
                    {item.label}
                  </span>
                  {item.href === "/admin/enquiries" &&
                    newEnquiries > 0 && (
                      <span
                        className={`
                          ml-auto flex min-w-5 items-center justify-center
                          rounded-full px-1.5 py-0.5
                          text-[11px] font-bold
                          ${
                            active
                              ? "bg-[#073f30] text-white"
                              : "bg-white text-[#073f30]"
                          }
                          ${collapsed ? "lg:hidden" : ""}
                        `}
                      >
                        {newEnquiries > 99 ? "99+" : newEnquiries}
                      </span>
                    )}
                </Link>
              );
            })}
          </nav>

          <div className="my-6 border-t border-white/10" />

          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Administration
            </p>
          )}

          <nav className="space-y-1">
            {administration.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group flex min-h-[46px] items-center
                    rounded-xl px-3
                    transition-all duration-200

                    ${
                      collapsed
                        ? "lg:justify-center lg:gap-0"
                        : "gap-3"
                    }

                    ${
                      active
                        ? "bg-white text-[#073f30] shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.3 : 1.8}
                    className="shrink-0"
                  />

                  <span
                    className={`
                      whitespace-nowrap text-sm font-medium
                      ${collapsed ? "lg:hidden" : ""}
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* COLLAPSE */}
        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`
              flex w-full items-center rounded-xl
              px-3 py-3
              text-white/60
              transition
              hover:bg-white/10 hover:text-white
              ${collapsed ? "justify-center" : "gap-3"}
            `}
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <ChevronLeft size={20} />

                <span className="text-sm font-medium">
                  Collapse menu
                </span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* DESKTOP SPACER */}
      <div
        className={`
          hidden shrink-0 transition-all duration-300 lg:block
          ${collapsed ? "w-[88px]" : "w-[270px]"}
        `}
      />
    </>
  );
}