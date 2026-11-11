<script lang="ts">
  import type { MotionResult } from '#lib/physics/mechanics/uniform-motion.ts';
  import { uniformMotionChartData } from '#lib/visualization/uniform-motion.ts';
  import { chartUi as text } from '#lib/i18n/runtime.ts';
  import MotionChart from './MotionChart.svelte';
  let { result }: { result: MotionResult | null } = $props();
  const data = $derived(result ? uniformMotionChartData(result) : null);
</script>

  <section class="motion-charts" aria-label={text.title}>
    <div class="motion-chart-grid">
      <MotionChart shape="position" title="s(t)" yLabel="s [m]" times={data?.times ?? []} values={data?.positions ?? []} description={text.positionDescription} />
      <MotionChart shape="velocity" title="v(t)" yLabel="v [m/s]" times={data?.times ?? []} values={data?.velocities ?? []} description={text.velocityDescription} />
    </div>

  </section>
