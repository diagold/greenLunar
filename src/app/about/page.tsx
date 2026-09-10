
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedNumber from "@/components/AnimatedNumber";
import Link from "next/link";
import { routes } from "@/config/routes";
import BackButton from "@/components/BackButton";
import CoreSolutions from "@/app/memberCompany/page"


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">

      <Navbar />
        
        {/* About Hero */}
    <section className="relative min-h-[520px] overflow-hidden bg-[#063d2b] sm:min-h-[560px] lg:min-h-[600px]">

    {/* Hero Image */}
    <div className="absolute inset-0">
        <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788881718/pasja1000-lake-2816802_1920.jpg"
        alt="GreenLunar Technologies"
        className="h-full w-full object-cover object-center"
        />
    </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Green Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/90 via-[#063d2b]/55 to-transparent" />

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 pb-16 sm:min-h-[560px] sm:px-8 sm:pb-20 lg:min-h-[600px] lg:px-10 lg:pb-24">

            <div className="max-w-4xl">

            {/* Heading */}
            <h1 className="text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-8xl">
                Technology that
                <span className="block text-green-400">
                moves business
                </span>
                forward.
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                We build practical solutions that connect people, technology,
                and businesses to create smarter ways of working and living.
            </p>

            </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-600">
                Who We Are
              </p>

              <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl">
                Building solutions for a
                <span className="block text-green-600">
                  changing world.
                </span>
              </h2>

              <div className="mt-7 space-y-5 text-base leading-8 text-gray-600">
                <p>
                  GreenLunar is a technology-driven company focused on
                  creating innovative solutions that help organizations
                  operate more efficiently and grow sustainably.
                </p>

                <p>
                  Our work brings together technology, creativity, and
                  practical industry knowledge to solve real-world problems.
                  From digital platforms to business and infrastructure
                  solutions, we focus on creating measurable value.
                </p>

                <p>
                  We believe technology should not make business more
                  complicated. It should make it simpler, smarter, and more
                  connected.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-[#ecfdf5]">
  <div className="grid grid-cols-2 gap-5 p-5">

    {/* Image 1 */}
    <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788869585/fabio-oyXis2kALVg-unsplash.jpg"
        alt="GreenLunar Technology"
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
      />
    </div>

    {/* Image 2 */}
    <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788869159/james-sullivan-ESZRBtkQ_f8-unsplash.jpg"
        alt="GreenLunar Solutions"
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
      />
    </div>

    {/* Image 3 */}
    <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788872191/alexander-dummer-aS4Duj2j7r4-unsplash.jpg"
        alt="GreenLunar Innovation"
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
      />
    </div>

    {/* Image 4 */}
    <div className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788870569/bank-phrom-Tzm3Oyu_6sk-unsplash.jpg"
        alt="GreenLunar Team"
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
      />
    </div>

  </div>
</div>

          </div>
        </div>
      </section>


    {/* At a Glance */}
    <section className="bg-[#063d2b] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
    <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
            At a Glance
        </p>

        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            A growing technology-driven company focused on creating solutions
            across multiple industries and delivering meaningful value to the
            organizations we serve.
        </p>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Stat 1 */}
        <div className="bg-[#063d2b] px-8 py-10 sm:px-10 sm:py-12">
            <p className="text-5xl font-medium tracking-tight text-green-400 sm:text-6xl">
                <AnimatedNumber value={5} /><span>+</span>
            </p>

            <div className="mt-5 h-px w-10 bg-green-400/50" />

            <h3 className="mt-5 text-base font-medium text-white">
            Business Sectors
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
            Diverse industries supported through our growing ecosystem.
            </p>
        </div>

        {/* Stat 2 */}
        <div className="bg-[#063d2b] px-8 py-10 sm:px-10 sm:py-12">
            <p className="text-5xl font-medium tracking-tight text-green-400 sm:text-6xl">
                <AnimatedNumber value={20} /><span>+</span>
            </p>

            <div className="mt-5 h-px w-10 bg-green-400/50" />

            <h3 className="mt-5 text-base font-medium text-white">
            Digital Solutions
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
            Technology products and platforms designed around real needs.
            </p>
        </div>

        {/* Stat 3 */}
        <div className="bg-[#063d2b] px-8 py-10 sm:px-10 sm:py-12">
            <p className="text-5xl font-medium tracking-tight text-green-400 sm:text-6xl">
                <AnimatedNumber value={100} />+
            </p>

            <div className="mt-5 h-px w-10 bg-green-400/50" />

            <h3 className="mt-5 text-base font-medium text-white">
            Projects Delivered
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
            Projects and solutions delivered across our areas of operation.
            </p>
        </div>

        {/* Stat 4 */}
        <div className="bg-[#063d2b] px-8 py-10 sm:px-10 sm:py-12">
            <p className="text-5xl font-medium tracking-tight text-green-400 sm:text-6xl">
                <AnimatedNumber value={250} />+
            </p>

            <div className="mt-5 h-px w-10 bg-green-400/50" />

            <h3 className="mt-5 text-base font-medium text-white">
            Organizations Served
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
            Businesses and organizations working with GreenLunar.
            </p>
        </div>

        </div>
    </div>
    </section>



      {/* Mission & Vision */}
      <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-600">
              Our Purpose
            </p>

            <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
              Driven by purpose.
              <span className="block text-green-600">
                Built for impact.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">

            <div className="rounded-xl bg-[#063d2b] p-10 sm:p-12 lg:p-14">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
                Our Mission
              </p>

              <h3 className="mt-6 text-3xl font-medium leading-tight text-white sm:text-4xl">
                Make technology useful, accessible, and impactful.
              </h3>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/60">
                We develop solutions that address practical challenges,
                improve efficiency, and help businesses and communities
                achieve better outcomes.
              </p>
            </div>

            <div className="rounded-xl bg-green-100 p-10 sm:p-12 lg:p-14">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-700">
                Our Vision
              </p>

              <h3 className="mt-6 text-3xl font-medium leading-tight text-[#063d2b] sm:text-4xl">
                A smarter future powered by innovation.
              </h3>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#063d2b]/65">
                We envision a future where intelligent technology creates
                better businesses, stronger communities, and more sustainable
                growth.
              </p>
            </div>

            {/* Our Core Values */}
            <div className="rounded-xl bg-[#063d2b] p-10 sm:p-12 lg:p-14">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                    Our Core Values
                </p>

                <h3 className="mt-6 text-3xl font-medium leading-tight text-white sm:text-4xl">
                    What guides us.
                </h3>

                <div className="mt-8 space-y-5 text-white/60">
                    <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-green-600">01</span>
                    <p className="text-base leading-7 text-white/60">
                        Integrity
                    </p>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-green-600">02</span>
                    <p className="text-base leading-7 text-white/60">
                        Innovation
                    </p>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-green-600">03</span>
                    <p className="text-base leading-7 text-white/60">
                        Excellence
                    </p>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-green-600">04</span>
                    <p className="text-base leading-7 text-white/60">
                        Sustainability
                    </p>
                    </div>

                    <div className="flex items-start gap-4">
                    <span className="text-sm font-medium text-green-600">05</span>
                    <p className="text-base leading-7 text-gray-700">
                        Community Empowerment
                    </p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

{/* =========================================
    CERTIFICATIONS & GLOBAL STANDARDS
========================================== */}
<section className="bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
  <div className="mx-auto max-w-7xl">

    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">

      {/* LEFT */}
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
          Certifications & Standards
        </p>

        <h2 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Nigerian compliance.
          <span className="block text-green-600">
            Global standards.
          </span>
        </h2>

        <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
          GreenLunar is committed to operating in line with applicable
          Nigerian regulatory requirements while adopting internationally
          recognized standards that promote quality, security, safety and
          operational excellence.
        </p>
      </div>

      {/* RIGHT */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Nigerian Compliance */}
        <div className="rounded-xl bg-[#f7faf8] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#063d2b] text-green-400">
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
          </div>

          <h3 className="mt-6 text-xl font-medium text-gray-900">
            Nigerian Regulatory Compliance
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            Our businesses are structured to operate in accordance with
            applicable Nigerian laws, regulatory requirements and industry
            obligations.
          </p>
        </div>

        {/* ISO Standards */}
        <div className="rounded-xl bg-[#ecfdf5] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#063d2b] text-green-400">
            <span className="text-sm font-semibold">
              ISO
            </span>
          </div>

          <h3 className="mt-6 text-xl font-medium text-gray-900">
            International Standards
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            We align our processes with internationally recognized frameworks
            for information security, quality management, risk management and
            operational governance.
          </p>
        </div>

        {/* Quality */}
        <div className="rounded-xl bg-[#f7faf8] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#063d2b] text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 12 2 2 4-4"
              />
            </svg>
          </div>

          <h3 className="mt-6 text-xl font-medium text-gray-900">
            Quality & Governance
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            We promote documented processes, accountability, continuous
            improvement and strong governance across our operations.
          </p>
        </div>

        {/* Security */}
        <div className="rounded-xl bg-[#ecfdf5] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#063d2b] text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>

          <h3 className="mt-6 text-xl font-medium text-gray-900">
            Security & Risk Management
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            Our technology operations place strong emphasis on information
            security, data protection, access control and risk management.
          </p>
        </div>

      </div>
    </div>

    {/* BOTTOM STATEMENT */}
    <div className="mt-14 rounded-xl bg-[#063d2b] px-8 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-400">
          Our Commitment
        </p>

        <h3 className="mt-3 text-2xl font-medium text-white sm:text-3xl">
          Building trust through compliance, quality and accountability.
        </h3>

        <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
          Our goal is to continuously strengthen our systems, certifications
          and operating practices as GreenLunar grows across Nigeria and
          international markets.
        </p>
      </div>
    </div>

{/* =========================================
    CERTIFICATION LOGOS
========================================== */}
<div className="mt-14">

  {/* Heading */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-green-600">
        Certifications & Frameworks
      </p>

      <h3 className="mt-3 text-2xl font-medium tracking-tight text-gray-900 sm:text-3xl">
        Recognized standards that guide
        <span className="text-green-600"> how we operate.</span>
      </h3>
    </div>

    <p className="max-w-md text-sm leading-6 text-gray-500">
      Our operations are guided by applicable Nigerian requirements and
      internationally recognized management and security standards.
    </p>
  </div>

  {/* Logo Container */}
  <div
    className="
        mt-8
  flex
  flex-wrap
  justify-center
  gap-4
  rounded-xl
  border
  border-gray-100
  bg-white
  p-5
  shadow-[0_10px_35px_rgba(0,0,0,0.05)]
  lg:flex-nowrap
  lg:p-7
    "
  >

    {/* CAC */}
    <div
      className="
        group
    flex
    h-[130px]
    w-full
    items-center
    justify-center
    rounded-lg
    bg-[#f7faf8]
    p-6
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-md
    sm:w-[220px]
    lg:w-[200px]
      "
    >
      <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788927653/CAC.jpg"
        alt="Corporate Affairs Commission"
        className="max-h-[75px]
      w-full
      object-contain
      transition-transform
      duration-300
      group-hover:scale-105"
      />
    </div>

    {/* NDPC */}
    <div
      className="
        group
    flex
    h-[130px]
    w-full
    items-center
    justify-center
    rounded-lg
    bg-[#f7faf8]
    p-6
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-md
    sm:w-[220px]
    lg:w-[200px]
      "
    >
      <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788927679/NDPC-copped.png"
        alt="Nigeria Data Protection Commission"
        className="max-h-[75px]
      w-full
      object-contain
      transition-transform
      duration-300
      group-hover:scale-105"
      />
    </div>

    {/* ISO 27001 */}
    <div
      className="
        group
    flex
    h-[130px]
    w-full
    items-center
    justify-center
    rounded-lg
    bg-[#f7faf8]
    p-6
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-md
    sm:w-[220px]
    lg:w-[200px]
      "
    >
      <img
        src="https://res.cloudinary.com/diobpauw/image/upload/v1788931217/ISO.jpg"
        alt="ISO IEC 27001 Information Security Management"
        className="max-h-[75px]
      w-full
      object-contain
      transition-transform
      duration-300
      group-hover:scale-105"
      />
    </div>

    

  </div>
</div>

  </div>
</section>


      {/* CTA */}
      <section className="bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-[#063d2b] px-8 py-16 text-center sm:px-12 lg:px-20 lg:py-20">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-400">
              Let&apos;s Work Together
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s build the future together.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/60">
              Have an idea, challenge, or project? Let&apos;s explore how
              technology can help move it forward.
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
