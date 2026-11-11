<script lang="ts">
  import { pageMetadata, structuredDataJson, indexable, site } from '#lib/seo.ts';
  import { languagePath } from '#lib/i18n/locale.ts';
  let { path }: { path: string } = $props();
  const metadata = $derived(pageMetadata(path));
  const structuredData = $derived(structuredDataJson(path));
</script>

<svelte:head>
  {#if metadata}
    <title>{metadata.title}</title>
    {#if structuredData}{@html `<script type="application/ld+json">${structuredData}</script>`}{/if}
    <meta name="description" content={metadata.description} />
    <meta name="author" content={site.author} />
    <link rel="canonical" href={metadata.canonical} />
    <link rel="alternate" hreflang="en" href={`${site.origin}${languagePath(path, 'en')}`} />
    <link rel="alternate" hreflang="de" href={`${site.origin}${languagePath(path, 'de')}`} />
    <link rel="alternate" hreflang="x-default" href={`${site.origin}${languagePath(path, 'en')}`} />
    {#if !indexable}<meta name="robots" content="noindex, nofollow" />{/if}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={site.name} />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content={metadata.canonical} />
  {/if}
</svelte:head>
