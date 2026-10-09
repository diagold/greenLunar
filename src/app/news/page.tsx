import { createClient } from "@/lib/supabase/server";

import NewsPageContent from "@/components/news/NewsPageContent";

import type { NewsArticle } from "@/types/news";

export const revalidate = 60;

export default async function NewsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Error fetching published news:",
      error
    );
  }

  const articles: NewsArticle[] =
    data ?? [];

  return (
    <NewsPageContent articles={articles} />
  );
}