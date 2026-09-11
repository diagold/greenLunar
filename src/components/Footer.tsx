
"use client";

import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { routes } from "@/config/routes";

const companyLinks = [
    { name: "Home",href:routes.home},
    { name: "About Us", href: routes.about },
    { name: "Contact Us", href: routes.contact },
];

const serviceLinks = [
  { name: "Technology", href: routes.services.technology },
  { name: "Construction", href: routes.services.construction },
  { name: "Fitness & Wellness", href: routes.services.fitnessWellness },
  { name: "Media & Entertainment", href: routes.services.mediaEntertainment },
  { name: "Real Estate", href: routes.services.realEstate },
];

const socialLinks = [
  {
    name: "X",
    href: "https://x.com/Greenlunarng",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-[18px] w-[18px]"
      >
        <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.02 2.02 0 1 0 5.25 7.04 2.02 2.02 0 0 0 5.25 3ZM20.44 13.2c0-3.46-1.85-5.07-4.32-5.07-1.99 0-2.88 1.09-3.38 1.86V8.5H9.36V20h3.38v-5.7c0-1.5.28-2.95 2.14-2.95 1.83 0 1.85 1.72 1.85 3.05V20h3.38l.33-6.8Z" />
      </svg>
    ),
  },
   {
    name: "Linkdln",
    href: "https://x.com/Greenlunarng",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-[18px] w-[18px]"
      >
        <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.02 2.02 0 1 0 5.25 7.04 2.02 2.02 0 0 0 5.25 3ZM20.44 13.2c0-3.46-1.85-5.07-4.32-5.07-1.99 0-2.88 1.09-3.38 1.86V8.5H9.36V20h3.38v-5.7c0-1.5.28-2.95 2.14-2.95 1.83 0 1.85 1.72 1.85 3.05V20h3.38l.33-6.8Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/greenlunarng?igsi=Y2tleHV6MDNmbTRi",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-[18px] w-[18px]"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle
          cx="17.5"
          cy="6.5"
          r="0.8"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1ByRdVHkL2/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-[18px] w-[18px]"
      >
        <path d="M13.5 21v-8h2.75l.41-3H13.5V8.08c0-.87.24-1.46 1.5-1.46h1.77V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.45V10H7v3h2.84v8h3.66Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#063d2b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.3fr]">

          {/* Brand */}
          <div>
            <a
              href="#"
              className="inline-flex items-center"
              aria-label="GreenLunar home"
            >
              <span className="text-2xl font-semibold tracking-tight">
                Green<span className="text-green-400">Lunar</span>
              </span>
            </a>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Building technology that moves business forward. We create
              practical digital solutions that simplify operations, improve
              efficiency, and accelerate growth.
            </p>

            <a
              href="#contact"
              className="
                mt-7
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-white
                transition-colors
                duration-300
                hover:text-green-400
              "
            >
              Let&apos;s work together
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </a>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-white/15
                    text-white/65
                    transition-all
                    duration-300
                    hover:border-green-400
                    hover:bg-green-400
                    hover:text-[#063d2b]
                  "
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="
                      text-sm
                      text-white/60
                      transition-colors
                      duration-300
                      hover:text-green-400
                    "
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-medium text-white">
              Our Services
            </h3>

            <ul className="mt-6 space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="
                      text-sm
                      text-white/60
                      transition-colors
                      duration-300
                      hover:text-green-400
                    "
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div id="contact">
            <h3 className="text-sm font-medium text-white">
              Contact Us
            </h3>

            <div className="mt-6 space-y-6">

              {/* Phone */}
              <div
               
                className="group flex items-start gap-4"
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-white/10
                    text-green-400
                    transition-all
                    duration-300
                    group-hover:bg-green-400
                    group-hover:text-[#063d2b]
                  "
                >
                  <Phone className="h-4 w-4" strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-white/75 transition-colors group-hover:text-green-400">
                    +234 70 7489 4559
                  </p>
                </div>
              </div>

              {/* Email */}
              <div
                className="group flex items-start gap-4"
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-white/10
                    text-green-400
                    transition-all
                    duration-300
                    group-hover:bg-green-400
                    group-hover:text-[#063d2b]
                  "
                >
                  <Mail className="h-4 w-4" strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-white/75 transition-colors group-hover:text-green-400">
                    info@greenlunar.com
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="group flex items-start gap-4">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-white/10
                    text-green-400
                    transition-all
                    duration-300
                    group-hover:bg-green-400
                    group-hover:text-[#063d2b]
                  "
                >
                  <MapPin className="h-4 w-4" strokeWidth={1.7} />
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    HQ
                  </p>
                  <p className="mt-1 max-w-xs text-sm leading-6 text-white/75">
                    11 Tairu Olugbani Street Oregun Ikeja, Lagos Nigeria.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom Footer */}
        <div
          className="
            flex
            flex-col
            gap-5
            text-xs
            text-white/40
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {new Date().getFullYear()} GreenLunar Technologies. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="transition-colors hover:text-green-400"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-green-400"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
