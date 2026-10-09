export type ProductStatus =
  | "draft"
  | "published"
  | "archived";

export type ProductFeature = {
  title: string;
  description: string;
};

export type ProductBenefit = {
  title: string;
  description: string;
};

export type ProductContentItem = {
  title: string;
  description: string;
};

export type ProductGalleryItem = {
  url: string;
  alt: string;
};

export type ProductFormData = {
  name: string;
  slug: string;
  category: string;

  shortDescription: string;
  description: string;

  imageUrl: string;

  gallery: ProductGalleryItem[];

  features: ProductContentItem[];
  benefits: ProductContentItem[];

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoImageUrl: string;

  primaryButtonText: string;
  primaryButtonUrl: string;

  secondaryButtonText: string;
  secondaryButtonUrl: string;

  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;

  name: string;
  slug: string;

  short_description: string | null;
  description: string | null;

  category: string | null;

  image_url: string | null;

  features: ProductFeature[];
  benefits: ProductBenefit[];

  gallery: ProductGalleryItem[];

  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  seo_image_url: string | null;

  primary_button_text: string | null;
  primary_button_url: string | null;

  secondary_button_text: string | null;
  secondary_button_url: string | null;

  status: ProductStatus;

  featured: boolean;

  sort_order: number;

  created_at: string;
  updated_at: string;
};