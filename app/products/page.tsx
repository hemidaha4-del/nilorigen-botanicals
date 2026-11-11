import type { Metadata } from 'next';
import React from 'react';
import { StructuredData } from '@/components/seo/StructuredData';
import { Navbar } from '@/components/sections/Navbar';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { Footer } from '@/components/sections/Footer';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { productsData } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'المنتجات النباتية المصرية',
  description:
    'استكشف محفظة المنتجات المصرية: الآذريون والبابونج والكركديه وحشيشة الليمون والكراوية والمريمية والنعناع الأخضر والفلفلي واليانسون.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'محفظة المنتجات النباتية المصرية | Nilorigen Botanicals',
    description:
      'أزهار وأعشاب عطرية وتوابل مصرية. استعرض الأسماء النباتية والأشكال المتاحة ومعلومات الاستخدام.',
    url: 'https://nilorigen.com/products',
    type: 'website',
    images: [{ url: '/og/products.png', width: 1200, height: 630, alt: 'Botanical Products by Nilorigen Botanicals' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'محفظة المنتجات النباتية المصرية | Nilorigen Botanicals',
    description:
      'أزهار وأعشاب عطرية وتوابل مصرية. استعرض الأسماء النباتية والأشكال المتاحة ومعلومات الاستخدام.',
    images: ['/og/products.png'],
  },
};

const productsSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'محفظة المنتجات النباتية المصرية',
  description:
    'أزهار وأعشاب عطرية وتوابل مصرية للتوريد إلى الأسواق العالمية.',
  url: 'https://nilorigen.com/products',
  mainEntity: {
    '@type': 'ItemList',
    name: 'محفظة Nilorigen Botanicals',
    itemListOrder: 'Unordered',
    numberOfItems: productsData.length,
    itemListElement: productsData.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name.ar,
        description: product.description.ar,
        category: product.category,
        image: product.image,
        url: 'https://nilorigen.com/products',
        brand: {
          '@type': 'Brand',
          name: 'Nilorigen Botanicals',
        },
        additionalProperty: {
          '@type': 'PropertyValue',
          name: 'Botanical name',
          value: product.botanicalName,
        },
      },
    })),
  },
};

export default function ProductsPage() {
  return (
    <>
      <StructuredData data={productsSchema} />
      <main className="min-h-screen bg-darkgreen text-offwhite relative overflow-x-hidden">
        <Navbar />
        <div className="pt-24">
          <ProductsSection />
        </div>
        <FloatingWhatsApp />
        <Footer />
      </main>
    </>
  );
}
