import type { MetadataRoute } from 'next';

const routes = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/products', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/nile-story', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/quality', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/sustainability', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://nilorigen.com${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}