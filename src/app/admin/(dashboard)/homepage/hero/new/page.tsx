import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import HeroSlideForm from "@/components/admin/homepage/hero/HeroSlideForm";

export default function NewHeroSlidePage() {
  return (
    <div className="space-y-8">
      <Link
        href="/admin/homepage/hero"
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

      <div>
        <p className="text-sm font-medium text-green-700">
          Home Page / Hero
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
          Add Hero Slide
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Add a new image and corresponding content to the homepage hero
          slideshow.
        </p>
      </div>

      <HeroSlideForm mode="create" />
    </div>
  );
}