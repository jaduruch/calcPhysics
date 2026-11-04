<script lang="ts">
  import { projectBloch, sphereGrid, blochLabels, defaultBlochCamera, blochAngleGuides } from '#lib/visualization/bloch.ts';
  import type { Vector3 } from '#lib/physics/quantum/qubit.ts';
  import { qubitUi as text } from '#lib/i18n/en.ts';
  let { vector, trajectory = [] }: { vector: Vector3; trajectory?: readonly Vector3[] } = $props();
  let camera = $state({ ...defaultBlochCamera });
  let drag: { id: number; x: number; y: number } | null = null;
  const tip = $derived(projectBloch(vector, camera));
  const origin = $derived(projectBloch({ x: 0, y: 0, z: 0 }, camera));
  const guides = $derived(blochAngleGuides(vector));
  function projectedPath(points: readonly Vector3[]) {
    return points.map((point, index) => {
      const p = projectBloch(point, camera);
      return `${index ? 'L' : 'M'}${p.x},${p.y}`;
    }).join(' ');
  }
  const grids = $derived(sphereGrid.flatMap(ring => ring.slice(1).map((point, index) => {
    const a = projectBloch(ring[index], camera), b = projectBloch(point, camera);
    return { a, b, back: a.depth + b.depth < 0 };
  })));
  const path = $derived(trajectory.map((point, index) => {
    const p = projectBloch(point, camera);
    return `${index ? 'L' : 'M'}${p.x},${p.y}`;
  }).join(' '));
  function orbit(dx: number, dy: number) {
    camera = { yaw: camera.yaw + dx, elevation: Math.max(-1.35, Math.min(1.35, camera.elevation + dy)) };
  }
  function pointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return;
    orbit((event.clientX - drag.x) * 0.008, (event.clientY - drag.y) * 0.008);
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === 'Home') { event.preventDefault(); camera = { ...defaultBlochCamera }; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    orbit(event.key === 'ArrowLeft' ? -0.12 : event.key === 'ArrowRight' ? 0.12 : 0, event.key === 'ArrowUp' ? -0.12 : event.key === 'ArrowDown' ? 0.12 : 0);
  }
</script>
<figure>
  <!-- A two-axis 3D viewport has custom arrow-key navigation, scoped to this application region. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <div class="orbit" role="application" aria-label={text.orbitLabel} aria-describedby="bloch-help" tabindex="0" onpointerdown={pointerDown} onpointermove={pointerMove} onpointerup={() => drag = null} onpointercancel={() => drag = null} onlostpointercapture={() => drag = null} onkeydown={keydown}>
    <svg viewBox="0 0 480 390" role="img" aria-labelledby="bloch-title bloch-description">
      <title id="bloch-title">{text.sphere}</title>
      <desc id="bloch-description">{text.sphereDescription}</desc>
      <defs>
        <radialGradient id="bloch-shade" cx="35%" cy="25%" r="80%">
          <stop offset="0" stop-color="var(--color-surface-raised)" stop-opacity=".7" />
          <stop offset="1" stop-color="var(--color-diagram-muted)" stop-opacity=".14" />
        </radialGradient>
        <marker id="bloch-state-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="var(--color-accent)" /></marker>
      </defs>
      <circle cx="240" cy="195" r={126 * 4 / Math.sqrt(15)} fill="url(#bloch-shade)" class="silhouette" />
      {#each grids.filter(line => line.back) as line}<line x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} class="grid back" />{/each}
      {#each [{ x: 1.13, y: 0, z: 0 }, { x: 0, y: 1.13, z: 0 }, { x: 0, y: 0, z: 1.13 }] as axis}
        {@const a = projectBloch({ x: -axis.x, y: -axis.y, z: -axis.z }, camera)}
        {@const b = projectBloch(axis, camera)}
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} class="axis" />
      {/each}
      {#each grids.filter(line => !line.back) as line}<line x1={line.a.x} y1={line.a.y} x2={line.b.x} y2={line.b.y} class="grid" />{/each}
      {#if path}<path d={path} class="trajectory" />{/if}
      {#if guides}
        {@const foot = projectBloch(guides.foot, camera)}
        {@const thetaLabel = projectBloch(guides.thetaLabel, camera)}
        <g class="angle-guides">
          <path d={projectedPath(guides.thetaArc)} class="theta-arc" />
          <text x={thetaLabel.x} y={thetaLabel.y} text-anchor="middle" dominant-baseline="middle" class="angle-label">θ</text>
          {#if guides.phiLabel}
            {@const phiLabel = projectBloch(guides.phiLabel, camera)}
            <line x1={tip.x} y1={tip.y} x2={foot.x} y2={foot.y} class="projection" />
            <line x1={origin.x} y1={origin.y} x2={foot.x} y2={foot.y} class="projection" />
            <path d={projectedPath(guides.phiArc)} class="phi-arc" />
            <text x={phiLabel.x} y={phiLabel.y} text-anchor="middle" dominant-baseline="middle" class="angle-label">φ</text>
          {/if}
        </g>
      {/if}
      <line x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} class="state-vector" marker-end="url(#bloch-state-arrow)" />
      <circle cx={tip.x} cy={tip.y} r="4" class="state-tip" />
      {#each blochLabels as label}
        {@const position = projectBloch(label.point, camera)}
        <text x={position.x} y={position.y} text-anchor="middle" dominant-baseline="middle">{label.text}</text>
      {/each}
      <text x={tip.x + 13} y={tip.y - 12} class="state-label">|ψ⟩</text>
    </svg>
  </div>
  <button class="qubit-button" type="button" onclick={() => camera = { ...defaultBlochCamera }}>{text.resetView}</button>
  <figcaption id="bloch-help">{text.orbitHelp}</figcaption>
</figure>
<style>
  figure { margin: 0; min-width: 0; }
  .orbit { touch-action: none; -webkit-user-select: none; user-select: none; cursor: grab; border-radius: var(--control-radius); }
  .orbit:active { cursor: grabbing; }
  svg { display: block; width: 100%; height: auto; overflow: visible; }
  .silhouette { stroke: var(--color-diagram-muted); stroke-width: 1; }
  .grid { stroke: var(--color-diagram-muted); stroke-width: .7; }
  .back { opacity: .3; stroke-dasharray: 2 3; }
  .axis { stroke: var(--color-text-muted); stroke-width: 1; opacity: .6; }
  .trajectory { fill: none; stroke: var(--color-accent); stroke-width: 1.8; stroke-dasharray: 3 4; opacity: .55; }
  .projection { stroke: var(--color-text-muted); stroke-width: 1; stroke-dasharray: 3 3; }
  .theta-arc, .phi-arc { fill: none; stroke: var(--color-text); stroke-width: 1.3; }
  .phi-arc { stroke-dasharray: 3 3; }
  .angle-label { fill: var(--color-text); font-family: Georgia, serif; font-style: italic; font-size: 16px; }
  .state-vector { stroke: var(--color-accent); stroke-width: 3; }
  .state-tip { fill: var(--color-accent); }
  text { fill: var(--color-text-muted); font-size: 12px; }
  .state-label { fill: var(--color-accent); font-size: 17px; }
  figcaption { font-size: .75rem; color: var(--color-text-muted); margin-bottom: 12px; }
</style>
