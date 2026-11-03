<script lang="ts">
  import Formula from './Formula.svelte';
  import { baseUnits, namedUnits, commonUnits, physicalConstants } from '#lib/content/si-reference.ts';
</script>

<div class="si-reference">
  <nav aria-label="On this page">
    <a href="#base-units">Base units</a>
    <a href="#derived-units">Named derived units</a>
    <a href="#unit-relationships">Unit relationships</a>
    <a href="#constants">Constants</a>
  </nav>
  <p>The International System of Units (SI) uses seven base units. Products and powers of these units describe other physical quantities. There are infinitely many possible combinations; the tables below cover all 22 derived units with special names and a selection of common relationships.</p>
  <section id="base-units" aria-labelledby="base-heading">
    <h2 id="base-heading">The seven SI base units</h2>
    <!-- Scrollable tables must be reachable with the keyboard. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="table-scroll" role="region" aria-label="SI base units" tabindex="0">
      <table>
        <thead><tr><th scope="col">Quantity</th><th scope="col">Typical symbol</th><th scope="col">Unit</th><th scope="col">Unit symbol</th></tr></thead>
        <tbody>{#each baseUnits as unit}<tr><th scope="row">{unit.quantity}</th><td><Formula expression={unit.symbol} /></td><td>{unit.name}</td><td><Formula expression={`\\mathrm{${unit.unit}}`} /></td></tr>{/each}</tbody>
      </table>
    </div>
  </section>
  <section id="derived-units" aria-labelledby="derived-heading">
    <h2 id="derived-heading">Derived units with special names</h2>
    <p>Here, [F] means “the SI unit of force”, rather than its numerical value or dimension. Quantity symbols depend on context: F can denote force, while the upright unit symbol F denotes farad.</p>
    <!-- Scrollable tables must be reachable with the keyboard. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="table-scroll" role="region" aria-label="Named SI derived units" tabindex="0">
      <table>
        <thead><tr><th scope="col">Quantity</th><th scope="col">Unit name</th><th scope="col">Unit relationship</th></tr></thead>
        <tbody>{#each namedUnits as unit}<tr><th scope="row">{unit.quantity}</th><td>{unit.name}</td><td><Formula expression={unit.expression} /></td></tr>{/each}</tbody>
      </table>
    </div>
    <p>Radian and steradian have unit one; their names preserve the distinction between plane and solid angle. Lumen and lux retain sr to show that distinction. Hertz and becquerel also share the same base-unit expression but describe different quantities.</p>
    <p>A temperature interval of 1 °C equals an interval of 1 K. Temperature readings have an offset:</p>
    <Formula expression={String.raw`\frac{t}{\mathrm{{}^\circ C}} = \frac{T}{\mathrm{K}} - 273.15`} />
  </section>
  <section id="unit-relationships" aria-labelledby="relationships-heading">
    <h2 id="relationships-heading">Common unit relationships</h2>
    <!-- Scrollable tables must be reachable with the keyboard. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="table-scroll" role="region" aria-label="Common unit relationships" tabindex="0">
      <table>
        <thead><tr><th scope="col">Quantity</th><th scope="col">SI unit</th></tr></thead>
        <tbody>{#each commonUnits as unit}<tr><th scope="row">{unit.quantity}</th><td><Formula expression={unit.expression} /></td></tr>{/each}</tbody>
      </table>
    </div>
    <p>Torque and energy share the same base-unit expression. Torque is conventionally written in N·m rather than J to keep the quantities distinct. Matching units is a necessary check on an equation, but does not by itself prove the physics is correct.</p>
  </section>
  <section id="constants" aria-labelledby="constants-heading">
    <h2 id="constants-heading">Physical constants</h2>
    <p>The first seven constants define the SI through fixed, exact numerical values. Other constants can be measured or derived. Parentheses indicate the standard uncertainty in the final digits: 6.674 30(15) means 6.674 30 ± 0.000 15.</p>
    <!-- Scrollable tables must be reachable with the keyboard. -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="table-scroll" role="region" aria-label="Physical constants" tabindex="0">
      <table>
        <thead><tr><th scope="col">Constant</th><th scope="col">Value in SI units</th><th scope="col">Status</th></tr></thead>
        <tbody>{#each physicalConstants as constant}<tr><th scope="row">{constant.name}</th><td><Formula expression={constant.expression} /></td><td>{constant.note}</td></tr>{/each}</tbody>
      </table>
    </div>
    <p>Gravitational acceleration g depends on location and is not the gravitational constant G. The calculators use 9.81 m/s² as a default approximation for g; it is not an exact SI defining value.</p>
  </section>
  <section aria-labelledby="sources-heading">
    <h2 id="sources-heading">Sources</h2>
    <p>Unit definitions and relationships: <a href="https://www.bipm.org/en/publications/si-brochure">BIPM, SI Brochure, 9th edition, version 4.01 (2026)</a>. Defining values: <a href="https://www.bipm.org/en/measurement-units/si-defining-constants">BIPM defining constants</a>. Measured and derived constants: <a href="https://physics.nist.gov/cuu/pdf/wallet_2022.pdf">NIST, CODATA 2022 recommended values</a>.</p>
  </section>
</div>

<style>
  .si-reference { max-width: 68rem; }
  nav { display: flex; flex-wrap: wrap; gap: 12px 24px; margin-bottom: 24px; }
  section { margin-top: 36px; scroll-margin-top: 24px; }
  h2 { font-size: 1.25rem; letter-spacing: -.025em; }
  p { max-width: 80ch; line-height: 1.7; color: var(--color-text-muted); }
  .table-scroll { overflow-x: auto; background: var(--color-surface); border-radius: var(--radius); }
  table { width: 100%; border-collapse: collapse; text-align: left; font-size: .875rem; }
  th, td { padding: 12px 16px; vertical-align: middle; }
  thead { background: var(--color-surface-raised); }
  tbody tr + tr { border-top: 1px solid var(--color-background); }
  tbody th { font-weight: 500; }
  td :global(.formula) { background: transparent; padding: 0; margin: 0; overflow: visible; }
  td :global(.katex-display) { text-align: left; }
</style>
