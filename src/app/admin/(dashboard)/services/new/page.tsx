import Link from "next/link";

import {
  ArrowLeft,
} from "lucide-react";

import ServiceForm from "@/components/admin/services/ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#073f30]"
      >
        <ArrowLeft
          size={16}
        />

        Back to services
      </Link>

      <div className="mb-8 mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#073f30]">
          Service Management
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Add Service
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Create a new service for the Green Lunar website. You can save it as a draft and publish it when it is ready.
        </p>
      </div>

      <ServiceForm />
    </div>
  );
}