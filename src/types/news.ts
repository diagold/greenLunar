export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  status: "draft" | "published";
  featured: boolean;
  read_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}