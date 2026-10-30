import { topics, type Topic } from './content/topics.ts';

export const site = {
  origin: 'https://calcphysics.com',
  name: 'calcPhysics',
  homeTitle: 'Physics Calculators & Theory | calcPhysics',
  homeDescription: 'Explore physics theory and calculate position, velocity and time with SI prefixes, unit conversions, step-by-step formulas and motion diagrams.'
} as const;
// Netlify preview contexts set VITE_INDEXABLE=false; local development is never indexable.
export const indexable = import.meta.env?.DEV !== true && import.meta.env?.VITE_INDEXABLE !== 'false';

export function canonicalUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Expected a site-relative path');
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return `${site.origin}${pathname}`;
}
export function publishedPaths(items: readonly Topic[] = topics): string[] {
  return ['/', ...items.filter(topic => topic.published).map(topic => topic.path)];
}
export function pageMetadata(path: string) {
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const topic = topics.find(topic => topic.published && topic.path === pathname);
  if (pathname !== '/' && !topic) return null;
  return {
    title: topic ? (topic.seo?.title ?? `${topic.title}: Physics Theory & Calculators | ${site.name}`) : site.homeTitle,
    description: topic ? (topic.seo?.description ?? topic.description) : site.homeDescription,
    canonical: canonicalUrl(topic?.path ?? '/')
  };
}
function xml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!);
}
export function sitemapXml(items: readonly Topic[] = topics): string {
  const urls = publishedPaths(items).map(path => `  <url><loc>${xml(canonicalUrl(path))}</loc></url>`).join('\n');
  // No fabricated lastmod or Google-ignored priority values.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
export function robotsTxt(allowIndexing = indexable): string {
  return allowIndexing
    ? `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
}
