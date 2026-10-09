export type ServiceStatus =
  | "draft"
  | "published"
  | "archived";

export type ServiceContentItem = {
  title: string;
  description: string;
};

export type ServiceGalleryItem = {
  url: string;
  alt: string;
};

export type ServiceProductSection = {
  enabled: boolean;

  eyebrow: string;
  heading: string;
  highlight: string;

  description: string;
  secondaryDescription: string;

  imageUrl: string;

  showProducts: boolean;
};

export type ServiceContentSection = {
  enabled: boolean;

  eyebrow: string;
  heading: string;
  highlight: string;

  description: string;
  secondaryDescription: string;

  imageUrl: string;
};

export type ServicePageContent = {
  hero: {
    eyebrow: string;
    heading: string;
    highlight: string;
    description: string;
  };

  introduction: {
    eyebrow: string;
    heading: string;
    highlight: string;
    description: string;
    secondaryDescription: string;
  };

  primarySection: ServiceProductSection;

  secondarySection: ServiceContentSection;

  whySection: {
    enabled: boolean;
    eyebrow: string;
    heading: string;
    highlight: string;
  };

  cta: {
    enabled: boolean;
    eyebrow: string;
    heading: string;
    highlight: string;
    description: string;
  };
};

export type ServiceFormData = {
  name: string;
  slug: string;
  category: string;

  shortDescription: string;
  description: string;

  imageUrl: string;
  gallery: ServiceGalleryItem[];

  capabilities: ServiceContentItem[];
  benefits: ServiceContentItem[];

  primaryButtonText: string;
  primaryButtonUrl: string;

  secondaryButtonText: string;
  secondaryButtonUrl: string;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoImageUrl: string;

  status: ServiceStatus;

  featured: boolean;
  sortOrder: number;
};

export type Service = {
  id: string;

  name: string;
  slug: string;

  category: string | null;

  short_description: string | null;
  description: string | null;

  image_url: string | null;
  gallery: ServiceGalleryItem[];

  capabilities: ServiceContentItem[];
  benefits: ServiceContentItem[];

  primary_button_text: string | null;
  primary_button_url: string | null;

  secondary_button_text: string | null;
  secondary_button_url: string | null;

  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  seo_image_url: string | null;

  status: ServiceStatus;

  featured: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
};