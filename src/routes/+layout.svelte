<script lang="ts">
  import '#lib/styles/app.css';
  import '#lib/styles/calculator.css';
  import 'katex/dist/katex.min.css';
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { ui } from '#lib/i18n/en.ts';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import ThemeToggle from '#lib/components/ThemeToggle.svelte';
  import { page } from '$app/state';
  import { childrenOf } from '#lib/content/topics.ts';
  const mainTopics = childrenOf(null).filter(topic => topic.published);
  let { children } = $props();
  let mobileMenu: HTMLDetailsElement;
  function closeMenu(restoreFocus = false) {
    if (!mobileMenu?.open) return;
    mobileMenu.open = false;
    if (restoreFocus) mobileMenu.querySelector('summary')?.focus();
  }
  function outsidePointer(event: PointerEvent) {
    if (event.target instanceof Node && !mobileMenu?.contains(event.target)) closeMenu();
  }
  function menuFocusOut(event: FocusEvent) {
    if (event.relatedTarget instanceof Node && !mobileMenu.contains(event.relatedTarget)) closeMenu();
  }
  afterNavigate(() => closeMenu());
  onMount(() => {
    const desktop = matchMedia('(min-width: 80rem)');
    const resize = () => { if (desktop.matches) closeMenu(); };
    desktop.addEventListener('change', resize);
    return () => desktop.removeEventListener('change', resize);
  });
</script>
<SeoHead path={page.url.pathname} />
<a class="skip-link" href="#main">{ui.skip}</a>
<svelte:window onpointerdown={outsidePointer} onkeydown={event => { if (event.key === 'Escape' && mobileMenu?.open) { event.preventDefault(); closeMenu(true); } }} />
{#snippet navigationLinks()}
  <a href="/" onclick={() => closeMenu()} aria-current={page.url.pathname === '/' ? 'page' : undefined}>{ui.home}</a>
  {#each mainTopics as topic}
    {@const exact = page.url.pathname === topic.path}
    {@const active = exact || page.url.pathname.startsWith(`${topic.path}/`)}
    <a href={topic.path} onclick={() => closeMenu()} aria-current={active ? (exact ? 'page' : 'location') : undefined}>{topic.navigationTitle ?? topic.title}</a>
  {/each}
{/snippet}
<header class="site-header"><div class="header-inner">
  <a class="brand" href="/" aria-label="calcPhysics home"><span class="brand-mark" aria-hidden="true"></span>calc<span>Physics</span></a>
  <nav class="desktop-navigation" aria-label={ui.mainNavigation}>{@render navigationLinks()}</nav>
  <ThemeToggle />
  <details class="mobile-menu" bind:this={mobileMenu} onfocusout={menuFocusOut}>
    <summary aria-label={ui.menu} title={ui.menu}>
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
        <path class="menu-bars" d="M4 6h16M4 12h16M4 18h16" />
        <path class="menu-close" d="m6 6 12 12M18 6 6 18" />
      </svg>
    </summary>
    <nav aria-label={ui.mainNavigation}>{@render navigationLinks()}</nav>
  </details>
</div></header>
<main id="main" tabindex="-1">{@render children()}</main>
<footer><a class="brand footer-brand" href="/">calc<span>Physics</span></a><p>{ui.footer} <span>{ui.footerDetail}</span></p><span class="footer-language">English</span></footer>
