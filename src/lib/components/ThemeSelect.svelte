<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '#lib/i18n/en.ts';
  let theme = $state('system');
  onMount(() => { try { const saved = localStorage.getItem('calcphysics-theme'); if (saved === 'dark' || saved === 'light') theme = saved; } catch {} });
  function apply() {
    if (theme === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('calcphysics-theme', theme); } catch {}
  }
</script>
<label class="theme-select"><span>{ui.theme}</span><select aria-label={ui.theme} bind:value={theme} onchange={apply}><option value="system">{ui.system}</option><option value="light">{ui.light}</option><option value="dark">{ui.dark}</option></select></label>
