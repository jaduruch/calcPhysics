import { basePath, localeFromPath, languagePath } from './i18n/locale.ts';
import { translateText } from './i18n/translate.ts';
import { germanText } from './i18n/text-de.ts';
import { models, topics, type Topic } from './content/topics.ts';

export const site = {
  origin: 'https://calcphysics.com',
  name: 'calcPhysics',
  author: 'Jana Ruch',
  homeTitle: 'Physics Calculators, Formulas & Theory | calcPhysics',
  homeDescription: 'Physics calculators for mechanics, electricity, thermodynamics, waves and optics. Solve formulas with unit conversions, calculation steps and diagrams.'
} as const;
// Netlify preview contexts set VITE_INDEXABLE=false; local development is never indexable.
export const indexable = import.meta.env?.DEV !== true && import.meta.env?.VITE_INDEXABLE !== 'false';

export function canonicalUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Expected a site-relative path');
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return `${site.origin}${pathname}`;
}
export function publishedPaths(items: readonly Topic[] = topics): string[] {
  return ['/', '/de', ...items.filter(topic => topic.published).flatMap(topic => [topic.path, languagePath(topic.path, 'de')])];
}
export function pageMetadata(path: string) {
  const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const german = localeFromPath(pathname) === 'de';
  const base = basePath(pathname);
  const topic = topics.find(topic => topic.published && topic.path === base);
  if (base !== '/' && !topic) return null;
  const localized = (value: string) => translateText(value, german ? 'de' : 'en');
  const hasSolution = !!topic && models.some(model => model.topicId === topic.id && model.calculator !== 'qubit');
  const solutionSuffix = german ? 'mit Schritt-für-Schritt-Lösungsweg' : 'with Step-by-Step Solution';
  const title = topic
    ? topic.seo?.title ? localized(topic.seo.title)
      : topic.kind ? `${localized(topic.title)} | ${site.name}`
      : `${localized(topic.title)}${german ? ': Rechner & Formeln' : ': Calculators & Formulas'} | ${site.name}`
    : german ? 'Physik-Rechner, Formeln & Theorie | calcPhysics' : site.homeTitle;
  const description = topic ? localized(topic.seo?.description ?? topic.description)
    : german ? 'Physik-Rechner für Mechanik, Elektrotechnik, Thermodynamik, Wellen und Optik. Formeln mit Einheitenumrechnung, Rechenwegen und Grafiken berechnen.' : site.homeDescription;
  return {
    title: hasSolution ? `${localized(topic!.title)} ${solutionSuffix} | ${site.name}` : title,
    description: hasSolution ? `${description} ${german ? 'Mit Schritt-für-Schritt-Lösungsweg.' : 'With Step-by-Step Solution.'}` : description,
    canonical: canonicalUrl(pathname)
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

// Describe only published pages and the breadcrumb hierarchy visible to readers.
export function pageStructuredData(path: string) {
  const metadata = pageMetadata(path);
  if (!metadata) return null;
  const locale = localeFromPath(path);
  const localized = (value: string) => locale === 'de' ? germanText[value] ?? value : value;
  const url = (value: string) => canonicalUrl(languagePath(value, locale));
  const topic = topics.find(item => item.published && item.path === basePath(path));
  const parent = topics.find(item => item.published && item.id === topic?.parentId);
  const breadcrumbs = [
    { name: locale === 'de' ? 'Startseite' : 'Home', url: url('/') },
    ...(parent ? [{ name: localized(parent.title), url: url(parent.path) }] : []),
    ...(topic ? [{ name: localized(topic.title), url: metadata.canonical }] : [])
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${site.origin}/#website`, url: canonicalUrl('/'), name: site.name, inLanguage: locale },
      { '@type': 'WebPage', '@id': `${metadata.canonical}#webpage`, url: metadata.canonical,
        name: metadata.title, description: metadata.description, inLanguage: locale,
        isPartOf: { '@id': `${site.origin}/#website` },
        ...(topic ? { breadcrumb: { '@id': `${metadata.canonical}#breadcrumb` } } : {}) },
      ...(topic ? [{ '@type': 'BreadcrumbList', '@id': `${metadata.canonical}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })) }] : [])
    ]
  };
}

export function structuredDataJson(path: string): string | null {
  const data = pageStructuredData(path);
  // Prevent HTML script termination if future content contains markup.
  return data ? JSON.stringify(data).replace(/</g, '\\u003c') : null;
}
