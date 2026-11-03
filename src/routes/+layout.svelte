<script lang="ts">
  import '#lib/styles/app.css';
  import '#lib/styles/calculator.css';
  import 'katex/dist/katex.min.css';
  import { ui } from '#lib/i18n/en.ts';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import ThemeToggle from '#lib/components/ThemeToggle.svelte';
  import { page } from '$app/state';
  import { childrenOf } from '#lib/content/topics.ts';
  const mainTopics = childrenOf(null).filter(topic => topic.published);
  let { children } = $props();
</script>
<SeoHead path={page.url.pathname} />
<a class="skip-link" href="#main">{ui.skip}</a>
<header class="site-header"><div class="header-inner">
  <a class="brand" href="/" aria-label="calcPhysics home"><span class="brand-mark" aria-hidden="true"></span>calc<span>Physics</span></a>
  <nav aria-label="Main navigation">
    <a href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>{ui.home}</a>
    {#each mainTopics as topic}
      {@const exact = page.url.pathname === topic.path}
      {@const active = exact || page.url.pathname.startsWith(`${topic.path}/`)}
      <a href={topic.path} aria-current={active ? (exact ? 'page' : 'location') : undefined}>{topic.title}</a>
    {/each}
  </nav>
  <ThemeToggle />
</div></header>
<main id="main" tabindex="-1">{@render children()}</main>
<footer><a class="brand footer-brand" href="/">calc<span>Physics</span></a><p>{ui.footer} <span>{ui.footerDetail}</span></p><span class="footer-language">English</span></footer>
