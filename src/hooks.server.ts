import type { Handle } from '@sveltejs/kit/hooks';
import { localeFromPath } from '#lib/i18n/locale.ts';
export const handle: Handle = ({ event, resolve }) => resolve(event, {
  transformPageChunk: ({ html }) => html.replace('<html lang="en">', `<html lang="${localeFromPath(event.url.pathname)}">`)
});
