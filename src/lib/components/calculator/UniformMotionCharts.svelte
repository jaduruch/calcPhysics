<script lang="ts">
  import type { MotionResult } from '#lib/physics/mechanics/uniform-motion.ts';
  import { uniformMotionChartData } from '#lib/visualization/uniform-motion.ts';
  import { chartUi as text } from '#lib/i18n/en.ts';
  import MotionChart from './MotionChart.svelte';
  let { result }: { result: MotionResult | null } = $props();
  const data = $derived(result ? uniformMotionChartData(result) : null);
</script>

  <section class="charts" aria-label={text.title}>
    <div class="chart-grid">
      <MotionChart shape="position" title="s(t)" yLabel="s [m]" times={data?.times ?? []} values={data?.positions ?? []} description={text.positionDescription} />
      <MotionChart shape="velocity" title="v(t)" yLabel="v [m/s]" times={data?.times ?? []} values={data?.velocities ?? []} description={text.velocityDescription} />
    </div>

  </section>
<style>
  .charts { margin-top: 28px; }
  .chart-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  @media (max-width: 44rem) { .chart-grid { grid-template-columns: 1fr; } }
</style>
