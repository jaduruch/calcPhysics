<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '#lib/i18n/runtime.ts';
  const componentId = $props.id();
  const maskId = `${componentId}-disc-mask`;
  let dark = $state(false);
  let ready = $state(false);
  onMount(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const saved = document.documentElement.dataset.theme;
      dark = saved === 'dark' || (saved !== 'light' && system.matches);
    };
    update();
    ready = true;
    system.addEventListener('change', update);
    return () => system.removeEventListener('change', update);
  });
  function toggle() {
    dark = !dark;
    const theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('calcphysics-theme', theme); } catch {}
  }
</script>
<button data-ready={ready} class="theme-toggle" type="button" aria-label={ui.toggleDarkMode} aria-pressed={dark} title={ready ? (dark ? ui.switchToLight : ui.switchToDark) : ui.toggleDarkMode} disabled={!ready} onclick={toggle}>
  <svg viewBox="0 0 30 30" width="30" height="30" fill="none" aria-hidden="true">
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30" style="mask-type: luminance">
        <rect width="30" height="30" fill="white" />
        <circle class="disc-cutout" cx="15" cy="15" r="6" fill="black" />
      </mask>
    </defs>
    <g class="theme-disc">
      <circle cx="15" cy="15" r="6" fill="currentColor" mask={`url(#${maskId})`} />
    </g>
    <g class="sun-rays" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      {#each [0, 45, 90, 135, 180, 225, 270, 315] as angle}
        <path d="M15 1v3" transform={`rotate(${angle} 15 15)`} />
      {/each}
    </g>
  </svg>
</button>
