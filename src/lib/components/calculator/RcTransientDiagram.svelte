<script lang="ts">
  import '#lib/styles/circuit-diagram.css';
  import { electricalUi as text } from '#lib/i18n/en.ts';
  let { discharging = false, inductive = false }: { discharging?: boolean; inductive?: boolean } = $props();
  const id = $props.id();
</script>

<figure class="circuit-diagram rc-transient-diagram">
  <svg style:width="calc(560px * var(--graphic-scale))" style:max-width="100%" viewBox="0 0 560 300" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{inductive ? (discharging ? text.rlDischargeDiagram : text.rlStepDiagram) : (discharging ? text.rcDischargeDiagram : text.rcChargeDiagram)}</title>
    <desc id={`${id}-description`}>{inductive ? text.rlTransientDescription : (discharging ? text.rcDischargeDescription : text.rcChargeDescription)}</desc>
    <defs>
      <marker id={`${id}-current`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0L8 4L0 8Z" fill="var(--color-electric-current)" />
      </marker>
      <marker id={`${id}-voltage`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0L8 4L0 8Z" fill="var(--color-accent)" />
      </marker>
    </defs>

    <path class="wire" d={inductive ? 'M80 125V70H151 M80 185V240H400V194 M155 134V240 M224 100H250 M310 100H400V146' : 'M80 125V70H151 M80 185V240H400V176 M155 134V240 M224 100H250 M310 100H400V164'} />
    <circle class="wire" cx="80" cy="155" r="30" />
    <path class="wire" d="M62 155c6-14 12-14 18 0s12 14 18 0" />
    <circle class="wire switch-contact" cx="155" cy="70" r="4" />
    <circle class="wire switch-contact" cx="155" cy="130" r="4" />
    <circle class="wire switch-contact" cx="220" cy="100" r="4" />
    <path class="wire switch-blade" class:discharging d={discharging ? 'M216 102L159 128' : 'M216 98L159 72'} />

    <g class="quantity resistance" data-quantity="R">
      <rect class="resistor" x="250" y="85" width="60" height="30" />
      <text x="280" y="75" text-anchor="middle"><tspan class="symbol">R</tspan><tspan class="unit"> [Ω]</tspan></text>
    </g>
    <g class="quantity resistance" data-quantity={inductive?'L':'C'}>
      {#if inductive}<path class="resistor" d="M400 146a6 6 0 0 1 0 12a6 6 0 0 1 0 12a6 6 0 0 1 0 12a6 6 0 0 1 0 12" />{:else}<path class="resistor" d="M375 164H425 M375 176H425" />{/if}
      <text x="360" y="176" text-anchor="end"><tspan class="symbol">{inductive?'L':'C'}</tspan><tspan class="unit"> [{inductive?'H':'F'}]</tspan></text>
    </g>
    <g class="quantity current" data-quantity="it">
      <path class="arrow" d={discharging && !inductive ? 'M350 100H320' : 'M320 100H350'} marker-end={`url(#${id}-current)`} />
      <text x="335" y="78" text-anchor="middle"><tspan class="symbol">i(t)</tspan><tspan class="unit"> [A]</tspan></text>
    </g>
    <g class="quantity voltage" data-quantity="ut">
      <path class="arrow" d="M455 140V205" marker-end={`url(#${id}-voltage)`} />
      <text x="470" y="179"><tspan class="symbol">u</tspan><tspan baseline-shift="sub" font-size="12">{inductive?'L':'C'}</tspan><tspan class="unit"> [V]</tspan></text>
    </g>
  </svg>
  <figcaption>{inductive?text.automaticRlTransientHint:text.automaticRcTransientHint}</figcaption>
</figure>

<style>
  .switch-blade { transition: d 160ms ease; }
  @media (prefers-reduced-motion: reduce) { .switch-blade { transition: none; } }
</style>
