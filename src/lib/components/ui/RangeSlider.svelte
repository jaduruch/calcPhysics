<script lang="ts">
  let { id, label, value, min = 0, max = 1, step = 0.001, valueText, onvalue }: {
    id: string; label: string; value: number; min?: number; max?: number; step?: number;
    valueText?: string; onvalue: (value: number) => void;
  } = $props();
  const progress = $derived(max > min ? Math.min(100, Math.max(0, (value - min) / (max - min) * 100)) : 0);
</script>

<span class="range-control" style={`--slider-progress: ${progress}%`}>
  <input class="range-slider" {id} type="range" aria-label={label} aria-valuetext={valueText} {min} {max} {step} {value} style={`--slider-progress: ${progress}%`} oninput={event => onvalue(event.currentTarget.valueAsNumber)} />
  <span class="slider-rail" aria-hidden="true"><span class="slider-fill"></span><span class="slider-thumb"></span></span>
</span>

<style>
  .range-control { display: block; position: relative; width: 100%; min-width: 0; height: var(--control-height); }
  /* Native input handles interaction; ordinary elements provide identical visuals across engines. */
  .range-control .range-slider { position: absolute; inset: 0; z-index: 1; display: block; width: 100%; min-width: 0; height: 100%; margin: 0; padding: 0; border: 0; appearance: none; -webkit-appearance: none; opacity: 0; cursor: pointer; touch-action: pan-y; }
  .range-slider::-webkit-slider-runnable-track { height: 2px; }
  .range-slider::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 16px; height: 16px; margin-top: -7px; }
  .range-slider::-moz-range-track { height: 2px; }
  .range-slider::-moz-range-thumb { width: 16px; height: 16px; border: 0; }
  .slider-rail { position: absolute; top: 50%; inset-inline: 8px; height: 2px; transform: translateY(-50%); border-radius: 2px; background: var(--color-diagram-muted); pointer-events: none; }
  .slider-fill { position: absolute; inset: 0 auto 0 0; width: var(--slider-progress); border-radius: inherit; background: var(--color-accent); }
  .slider-thumb { position: absolute; top: 50%; left: var(--slider-progress); width: 16px; height: 16px; transform: translate(-50%, -50%); border: 1px solid var(--color-diagram-muted); border-radius: 50%; background: var(--color-slider-thumb); box-shadow: 0 0 0 1px var(--color-diagram-muted); }
  .range-slider:focus-visible + .slider-rail .slider-thumb { outline: 2px solid var(--color-accent); outline-offset: 3px; }
</style>
