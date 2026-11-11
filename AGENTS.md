# Project Guidelines

## Architecture
- This is a Next.js 14 App Router application using strict TypeScript. Route pages live under `app/`; keep them focused on composing shared components from `components/`.
- Reuse existing sections, product components, UI components, and shared types before introducing new abstractions. Keep route-specific content in its existing page or content module.
- SEO metadata and structured data are handled in the app routes and `components/seo/`. Keep `app/robots.ts` and `app/sitemap.ts` aligned with route changes.

## Localization
- The supported languages are English and Arabic. Use `lib/context/LanguageContext.tsx` and the dictionaries in `content/en.ts` and `content/ar.ts` for translated UI text; keep dictionary keys in sync.
- Preserve right-to-left behavior for Arabic and left-to-right behavior for English. For product copy, follow the bilingual data shape in `lib/data/products.ts` and shared definitions in `types/index.ts`.

## Styling
- Use the existing Tailwind utilities and project tokens from `tailwind.config.js`; global styles belong in `app/globals.css`.
- Follow the existing responsive and bilingual layout patterns. Check both language directions when changing shared layouts or UI.

## Validation
- Run `npm run lint` for lint validation and `npm run build` for production/type validation after relevant changes.
- For visible UI changes, verify the affected route in both English and Arabic, including RTL layout; check responsive behavior when browser tooling is available.
- There is no test script currently defined in `package.json`; do not assume a test suite exists.