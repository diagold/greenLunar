import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import ServiceForm from "@/components/admin/services/ServiceForm";
import ServiceActions from "@/components/admin/services/ServiceActions";

import type {
  ServiceFormData,
  ServiceStatus,
} from "@/types/service";

type EditServicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getServiceStatus(
  status: unknown
): ServiceStatus {
  if (
    status === "draft" ||
    status === "published" ||
    status === "archived"
  ) {
    return status;
  }

  return "draft";
}

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  const {
    data: service,
    error,
  } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load service:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    );
  }

  if (!service) {
    notFound();
  }

  const serviceStatus =
    getServiceStatus(
      service.status
    );

  const initialData: ServiceFormData = {
    name:
      service.name ?? "",

    slug:
      service.slug ?? "",

    category:
      service.category ??
      "Technology",

    shortDescription:
      service.short_description ??
      "",

    description:
      service.description ??
      "",

    imageUrl:
      service.image_url ?? "",

    gallery:
      Array.isArray(
        service.gallery
      )
        ? service.gallery
        : [],

    capabilities:
      Array.isArray(
        service.capabilities
      )
        ? service.capabilities
        : [],

    benefits:
      Array.isArray(
        service.benefits
      )
        ? service.benefits
        : [],

    primaryButtonText:
      service.primary_button_text ??
      "Get Started",

    primaryButtonUrl:
      service.primary_button_url ??
      "/contact",

    secondaryButtonText:
      service.secondary_button_text ??
      "Learn More",

    secondaryButtonUrl:
      service.secondary_button_url ??
      "#overview",

    seoTitle:
      service.seo_title ?? "",

    seoDescription:
      service.seo_description ??
      "",

    seoKeywords:
      service.seo_keywords ??
      "",

    seoImageUrl:
      service.seo_image_url ??
      "",

    status:
      serviceStatus,

    featured:
      service.featured ??
      false,

    sortOrder:
      service.sort_order ??
      0,
  };

  return (
    <div className="pb-12">
      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="mb-8">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#073f30]"
        >
          <ArrowLeft size={16} />

          Back to Services
        </Link>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#073f30]">
              Service Management
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Edit Service
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Update{" "}
              <span className="font-semibold text-gray-700">
                {service.name}
              </span>{" "}
              and control how it
              appears on the Green
              Lunar website.
            </p>
          </div>

          {/* PUBLIC PAGE LINK */}

          {serviceStatus ===
            "published" &&
            service.slug && (
              <Link
                href={`/services/${service.slug}`}
                target="_blank"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#073f30]/30 hover:text-[#073f30]"
              >
                View Public Page

                <ExternalLink
                  size={16}
                />
              </Link>
            )}
        </div>
      </div>

      {/* =========================================
          SERVICE EDIT FORM
      ========================================= */}

      <ServiceForm
        mode="edit"
        serviceId={
          service.id
        }
        initialData={
          initialData
        }
      />

      {/* =========================================
          DANGER / SERVICE ACTIONS
          
          Intentionally placed AFTER the entire
          editing form.
      ========================================= */}

      <div className="mt-12 border-t border-gray-200 pt-10">
        <ServiceActions
          serviceId={
            service.id
          }
          serviceName={
            service.name ??
            "Service"
          }
          status={
            serviceStatus
          }
        />
      </div>
    </div>
  );
}