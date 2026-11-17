<script lang="ts">
  import '#lib/styles/app.css';
  import '#lib/styles/calculator.css';
  import 'katex/dist/katex.min.css';
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { ui, text, localPath, isGerman } from '#lib/i18n/runtime.ts';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import ThemeToggle from '#lib/components/ThemeToggle.svelte';
  import { page } from '$app/state';
  import { childrenOf } from '#lib/content/topics.ts';
  import SiteFooter from '#lib/components/SiteFooter.svelte';
  import { basePath } from '#lib/i18n/locale.ts';
  const currentPath = $derived(basePath(page.url.pathname));
  $effect(() => { document.documentElement.lang = isGerman() ? 'de' : 'en'; });
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
  <a href={localPath("/")} onclick={() => closeMenu()} aria-current={currentPath === '/' ? 'page' : undefined}>{ui.home}</a>
  {#each mainTopics as topic}
    {@const exact = currentPath === topic.path}
    {@const active = exact || currentPath.startsWith(`${topic.path}/`)}
    <a href={localPath(topic.path)} onclick={() => closeMenu()} aria-current={active ? (exact ? 'page' : 'location') : undefined}>{text(topic.navigationTitle ?? topic.title)}</a>
  {/each}
{/snippet}
<header class="site-header"><div class="header-inner">
  <a class="brand" href={localPath("/")} aria-label={text('calcPhysics home')}><span class="brand-mark" aria-hidden="true"></span>calc<span>Physics</span></a>
  <nav class="desktop-navigation" aria-label={ui.mainNavigation}>{@render navigationLinks()}</nav>
  <ThemeToggle />
  <details class="mobile-menu" bind:this={mobileMenu} onfocusout={menuFocusOut}>
    <summary aria-label={ui.menu} title={ui.menu}>
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
        <path class="menu-line menu-line-top" d="M4 6h16" />
        <path class="menu-line menu-line-middle" d="M4 12h16" />
        <path class="menu-line menu-line-bottom" d="M4 18h16" />
      </svg>
    </summary>
    <nav aria-label={ui.mainNavigation}>{@render navigationLinks()}</nav>
  </details>
</div></header>
<main id="main" tabindex="-1">{@render children()}</main>
<SiteFooter />
