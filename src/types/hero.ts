export type HeroSlide = {
  id: string;
  eyebrow: string | null;
  title: string;
  highlight: string | null;
  ending: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type HeroSlideFormData = {
  eyebrow: string;
  title: string;
  highlight: string;
  ending: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
};