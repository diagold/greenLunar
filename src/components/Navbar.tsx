"use client";

import { useState } from "react";
import Link from "next/link";
import { routes } from "@/config/routes";

const services = [
  {
    name: "Technology Solutions",
    path: routes.services.technology
  },
  {
    name: "Construction",
    path: routes.services.construction
  },
  {
    name: "Fitness & Wellness",
    path: routes.services.fitnessWellness
  },
  {
    name: "Media & Entertainment",
    path: routes.services.mediaEntertainment,
  },
  {
    name: "Real Estate",
    path: routes.services.realEstate,
  },
];

const companys = [
  {
    name: "HardRock Construction Ltd",
    path: routes.memberCompany.hardrock
  },
  {
    name: "Heighest Venture Ltd",
    path: routes.memberCompany.hvl
  },
  {
    name: "Green Cardio Ltd",
    path: routes.memberCompany.fitnessWellness
  },
  {
    name: "Shinal Entertainment Ltd",
    path: routes.memberCompany.shinal
  },
  
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/90 backdrop-blur-md">
      
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}

        <Link href="/" className="flex items-center">
         <div className="flex h-15 w-15 items-center justify-center rounded-xl">
          <img
            src="https://res.cloudinary.com/diobpauw/image/upload/v1789023068/ChatGPT_Image_Sep_10_2026_07_50_53_AM.png"
            alt="GreenLunar"
            className="h-10 w-auto"
          />
         </div>
          <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight text-gray-950">
                GREEN LUNAR
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-500 justify-between items-center flex">
                Group
              </div>
            </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">

          {/* Home */}
          <Link
            href={routes.home}
            className="text-sm font-medium text-gray-700 transition hover:text-green-600"
          >
            Home
          </Link>

          {/* About */}
          <Link
            href={routes.about}
            className="text-sm font-medium text-gray-700 transition hover:text-green-600"
          >
            About
          </Link>

          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >

            <button
              type="button"
              onClick={() => setProductsOpen(!productsOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-green-600"
            >
              Our Services

              <svg
                className={`h-4 w-4 transition-transform ${
                  productsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>

            </button>


            {/* Dropdown */}
            {productsOpen && (
              <div className="absolute left-1/2 top-full w-[200px] -translate-x-1/2 pt-4">

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">

                  <div className="grid grid-cols-1 gap-2">

                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.path}
                        className="rounded-xl p-4 transition hover:bg-gray-50 px-3 py-2 text-xs font-normal text-gray-600 transition-colors duration-200 hover:text-green-600"
                      >

                        <div className="flex items-start gap-3">

                          <div>

                            <h4 className="font-normal text-gray-950">
                              {service.name}
                            </h4>

                          </div>

                        </div>

                      </Link>
                    ))}

                  </div>


                  {/* View All Products */}
                  

                </div>

              </div>
            )}

          </div>

          {/* Contact */}
          <a
            href={routes.contact}
            className="text-sm font-medium text-gray-700 transition hover:text-green-600"
          >
            Contact Us
          </a>


          {/* Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setLocationsOpen(true)}
            onMouseLeave={() => setLocationsOpen(false)}
          >

            <button
              type="button"
              onClick={() => setLocationsOpen(!locationsOpen)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-green-600"
            >
              Member Company

              <svg
                className={`h-4 w-4 transition-transform ${
                  locationsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>

            </button>


            {/* Dropdown */}
            {locationsOpen && (
              <div className="absolute left-1/2 top-full w-[200px] -translate-x-1/2 pt-4">

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">

                  <div className="grid grid-cols-1 gap-2">

                    {companys.map((company) => (
                      <Link
                        key={company.name}
                        href={company.path}
                        className="rounded-xl p-4 transition hover:bg-gray-50 px-3 py-2 text-xs font-normal text-gray-600 transition-colors duration-200 hover:text-green-600"
                      >

                        <div className="flex items-start gap-3">

                          <div>

                            <h4 className="font-normal text-gray-950">
                              {company.name}
                            </h4>

                          </div>

                        </div>

                      </Link>
                    ))}

                  </div>


                  {/* View All Locations */}
                  

                </div>

              </div>
            )}

          </div>



        </nav>


        {/* Desktop CTA */}
        {/* <div className="hidden lg:block">

          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            Request a Demo
          </a>

        </div> */}


        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 lg:hidden"
          aria-label="Toggle menu"
        >

          <div className="space-y-1.5">

            <span
              className={`block h-0.5 w-5 bg-gray-900 transition ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-gray-900 transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-gray-900 transition ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />

          </div>

        </button>

      </div>


      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">

          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-6">

            <Link 
              href={routes.home}
              onClick={() => setMenuOpen(false)}
              className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800"
            >
              Home
            </Link>

            <Link
              href={routes.about}
              onClick={() => setMenuOpen(false)}
              className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800"
            >
              About
            </Link>

            {/* Mobile Products */}
            
            <button
              type="button"
              onClick={() => setProductsOpen(!productsOpen)}
              className="flex items-center justify-between border-b border-gray-100 py-4 text-left text-sm font-medium text-gray-800"
            >

              Products

              <svg
                className={`h-4 w-4 transition-transform ${
                  productsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>

            </button>


            {productsOpen && (
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">

                {services.map((service) => (
                  <a
                    key={service.name}
                    href="#"
                    onClick={() => setMenuOpen(false)}
                    className="block py-3"
                  >

                    <div className="text-sm font-normal text-gray-900">
                      {service.name}
                    </div>

                  </a>
                ))}

              </div>
            )}

            <Link
              href={routes.contact}
              onClick={() => setMenuOpen(false)}
              className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800"
            >
              Contact Us
            </Link>

             <button
              type="button"
              onClick={() => setLocationsOpen(!locationsOpen)}
              className="flex items-center justify-between border-b border-gray-100 py-4 text-left text-sm font-medium text-gray-800"
            >

              Locations

              <svg
                className={`h-4 w-4 transition-transform ${
                  locationsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>

            </button>


            {locationsOpen && (
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">

                {companys.map((company) => (
                  <a
                    key={company.name}
                    href={company.path}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3"
                  >

                    <div className="text-sm font-normal text-gray-900">
                      {company.name}
                    </div>

                  </a>
                ))}

              </div>
            )}


          {/* Locations Dropdown */}
           
            

            {/* <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-5 rounded-full bg-gray-950 px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Request a Demo
            </a> */}

          </nav>

        </div>
      )}

    </header>
  );
}