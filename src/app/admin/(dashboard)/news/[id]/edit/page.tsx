

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NewsForm from "@/components/admin/news/NewsForm";


interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPage({
  params,
}: EditNewsPageProps) {
  // Get article ID from the dynamic URL
  const { id } = await params;

  if (!id) {
    notFound();
  }

  // Initialize Supabase server client
  const supabase = await createClient();

  // Fetch the existing news article
  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    console.error("Error fetching news article:", error);
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Edit News Article
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Update the article details, content, images,
          and publication settings.
        </p>
      </div>

      {/* Pre-populated News Form */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <NewsForm article={article} />
      </div>
    </div>
  );
}
