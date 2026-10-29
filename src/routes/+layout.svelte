<script lang="ts">
  import '#lib/styles/app.css';
  import 'katex/dist/katex.min.css';
  import { ui } from '#lib/i18n/en.ts';
  import ThemeSelect from '#lib/components/ThemeSelect.svelte';
  let { children } = $props();
</script>
<a class="skip-link" href="#main">{ui.skip}</a>
<header class="site-header"><div class="header-inner">
  <a class="brand" href="/" aria-label="calcPhysics home"><span class="brand-mark" aria-hidden="true">φ</span>calc<span>Physics</span></a>
  <nav aria-label="Main navigation"><a href="/">{ui.home}</a><a href="/mechanics">Mechanics</a></nav>
  <ThemeSelect />
</div></header>
<main id="main" tabindex="-1">{@render children()}</main>
<footer><a class="brand footer-brand" href="/">calc<span>Physics</span></a><p>{ui.footer} <span>{ui.footerDetail}</span></p><span class="footer-language">English</span></footer>
