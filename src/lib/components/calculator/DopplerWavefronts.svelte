<script lang="ts">
  import { onMount } from 'svelte';
  import type { DopplerResult } from '#lib/physics/waves/doppler.ts';
  import { dopplerScene } from '#lib/visualization/doppler.ts';
  import { dopplerUi as text } from '#lib/i18n/runtime.ts';
  let { result }: { result: Extract<DopplerResult, { status: 'success' }> | null } = $props();
  let root: HTMLElement;
  let phase = $state(2);
  let playing = $state(false);
  let reducedMotion = $state(false);
  let ready = $state(false);
  let raf = 0;
  let previous: number | null = null;
  const scene = $derived(dopplerScene(result?.values ?? { fs: 1, fo: 1, vs: 0, vo: 0, c: 1 }, phase));
  const id = $props.id();
  function pause() { cancelAnimationFrame(raf); playing = false; previous = null; }
  $effect(() => { pause(); phase = result ? Math.min(2, dopplerScene(result.values, 0).duration / 2) : 2; });
  function frame(time: number) {
    if (!playing) return;
    if (document.hidden || !root.closest('details')?.open || reducedMotion) { pause(); return; }
    if (previous !== null) phase = (phase + Math.min(0.1, (time - previous) / 1000) * 1.2) % scene.duration;
    previous = time;
    raf = requestAnimationFrame(frame);
  }
  function toggle() {
    if (playing) { pause(); return; }
    if (!result || reducedMotion) return;
    playing = true; previous = null; raf = requestAnimationFrame(frame);
  }
  onMount(() => {
    ready = true;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => { reducedMotion = preference.matches; if (reducedMotion) pause(); };
    motion(); preference.addEventListener('change', motion);
    const visibility = () => { if (document.hidden) pause(); };
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pause(); });
    observer.observe(root);
    return () => { pause(); observer.disconnect(); preference.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  });
</script>
<figure bind:this={root} class="doppler-wavefronts">
  <svg viewBox="0 0 640 300" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{text.diagramTitle}</title>
    <desc id={`${id}-description`}>{text.diagramDescription} {result ? text.scaled : text.schematic}</desc>
    <defs>
      <clipPath id={`${id}-clip`}><rect x="12" y="12" width="616" height="260" rx="8" /></clipPath>
      <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="var(--color-text)" /></marker>
    </defs>
    <rect x="12" y="12" width="616" height="260" rx="8" class="diagram-background" />
    <g clip-path={`url(#${id}-clip)`}>
      {#each scene.fronts as front}<circle cx={front.cx} cy="145" r={front.r} class="wavefront" />{/each}
      <line x1="24" y1="145" x2="616" y2="145" class="motion-line" />
      <circle cx={scene.source} cy="145" r="7" class="source" />
      <circle cx={scene.observer} cy="145" r="6" class="observer" />
      <text x={scene.source} y="125" text-anchor="middle">{text.source}</text>
      <text x={scene.observer} y="125" text-anchor="middle">{text.observer}</text>
      {#if result && scene.sourceArrow !== 0}
        <line x1={scene.source} y1="180" x2={scene.source + scene.sourceArrow} y2="180" class="velocity" marker-end={`url(#${id}-arrow)`} />
        <text x={scene.source} y="204" text-anchor="middle">vₛ</text>
      {/if}
      {#if result && scene.observerArrow !== 0}
        <line x1={scene.observer} y1="180" x2={scene.observer + scene.observerArrow} y2="180" class="velocity" marker-end={`url(#${id}-arrow)`} />
        <text x={scene.observer} y="204" text-anchor="middle">vₒ</text>
      {/if}
      <line x1="520" y1="38" x2="580" y2="38" class="velocity" marker-end={`url(#${id}-arrow)`} />
      <text x="550" y="62" text-anchor="middle">c</text>
    </g>
  </svg>
  <div class="animation-tools"><button type="button" disabled={!ready || !result || reducedMotion} aria-pressed={playing} onclick={toggle}>{playing ? text.pause : text.play}</button>{#if reducedMotion}<p class="status">{text.reducedMotion}</p>{/if}</div>
  <figcaption>{result ? text.scaled : text.schematic}</figcaption>
</figure>
<style>
  figure { margin: 24px 0 0; min-width: 0; }
  svg { display: block; width: 100%; height: auto; }
  .diagram-background { fill: var(--color-surface); }
  .wavefront { fill: none; stroke: var(--color-accent); stroke-width: 1.2; opacity: .5; }
  .motion-line { stroke: var(--color-diagram-muted); stroke-width: 1; stroke-dasharray: 4 4; }
  .source { fill: var(--color-accent); }
  .observer { fill: var(--color-text); }
  .velocity { stroke: var(--color-text); stroke-width: 1.5; }
  text { fill: var(--color-text); font-size: 13px; paint-order: stroke; stroke: var(--color-surface); stroke-width: 4px; stroke-linejoin: round; }
  figcaption { margin-top: 8px; font-size: .75rem; color: var(--color-text-muted); }
  .animation-tools { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
  button { border: none; border-radius: var(--control-radius); background: var(--color-control); color: var(--color-text); min-height: var(--control-height); padding: 8px 16px; font-size: .8125rem; }
  button:disabled { opacity: .5; }
</style>
