<script lang="ts">
  import { pageMetadata, structuredDataJson, indexable, site } from '#lib/seo.ts';
  let { path }: { path: string } = $props();
  const metadata = $derived(pageMetadata(path));
  const structuredData = $derived(structuredDataJson(path));
</script>

<svelte:head>
  {#if metadata}
    <title>{metadata.title}</title>
    {#if structuredData}{@html `<script type="application/ld+json">${structuredData}</script>`}{/if}
    <meta name="description" content={metadata.description} />
    <link rel="canonical" href={metadata.canonical} />
    {#if !indexable}<meta name="robots" content="noindex, nofollow" />{/if}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={site.name} />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content={metadata.canonical} />
  {/if}
</svelte:head>
