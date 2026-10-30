import { sitemapXml } from '#lib/seo.ts';
import type { RequestHandler } from './$types';

export const prerender = true;
export const GET: RequestHandler = () => new Response(sitemapXml(), {
  headers: { 'Content-Type': 'application/xml; charset=utf-8' }
});
