export type Language = 'ar' | 'en';

export type ProductCategory = 'flowers' | 'aromatic' | 'spices';

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  name: {
    ar: string;
    en: string;
  };
  botanicalName: string;
  description: {
    ar: string;
    en: string;
  };
  image: string;
  origin: {
    ar: string;
    en: string;
  };
  applications: {
    ar: string[];
    en: string[];
  };
  availableForms: {
    ar: string[];
    en: string[];
  };
}

export interface TimelineStep {
  number: string;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
}