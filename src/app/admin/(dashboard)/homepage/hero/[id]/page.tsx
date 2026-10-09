import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import HeroSlideForm from "@/components/admin/homepage/hero/HeroSlideForm";
import HeroSlideActions from "@/components/admin/homepage/hero/HeroSlideActions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditHeroSlidePage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: slide, error } = await supabase
    .from("homepage_hero_slides")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !slide) {
    notFound();
  }

  const initialData = {
    eyebrow: slide.eyebrow ?? "",
    title: slide.title ?? "",
    highlight: slide.highlight ?? "",
    ending: slide.ending ?? "",
    description: slide.description ?? "",
    imageUrl: slide.image_url ?? "",
    sortOrder: slide.sort_order ?? 0,
    isActive: slide.is_active ?? true,
  };

  return (
    <div className="space-y-8">
      <Link
        href="/admin/homepage/hero"
        scroll={true}
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-gray-500
          transition
          hover:text-gray-900
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hero Section
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-green-700">
            Home Page / Hero
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
            Edit Hero Slide
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Update the image, text and display settings for this homepage
            hero slide.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-700
            shadow-sm
            transition
            hover:bg-gray-50
          "
        >
          View Homepage
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <HeroSlideForm
        mode="edit"
        slideId={slide.id}
        initialData={initialData}
      />

      <div className="border-t border-gray-200 pt-8">
        <HeroSlideActions
          slideId={slide.id}
          slideTitle={slide.title}
          isActive={slide.is_active}
        />
      </div>
    </div>
  );
}