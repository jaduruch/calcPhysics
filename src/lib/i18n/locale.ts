export type Locale = 'en' | 'de';
export function localeFromPath(path: string): Locale {
  return /^\/de(?:\/|$)/.test(path) ? 'de' : 'en';
}
export function basePath(path: string): string {
  return path.split(/[?#]/)[0].replace(/\/+$/, '').replace(/^\/de(?=\/|$)/, '') || '/';
}
export function languagePath(path: string, locale: Locale): string {
  const base = basePath(path);
  return locale === 'de' ? `/de${base === '/' ? '' : base}` : base;
}
