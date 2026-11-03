<script lang="ts">
  import type { ModelDefinition } from '#lib/content/model-types.ts';
  import ModelCard from './ModelCard.svelte';
  import UniformMotionCalculator from './calculator/UniformMotionCalculator.svelte';
  import InclinedPlaneCalculator from './calculator/InclinedPlaneCalculator.svelte';
  const calculators = { 'uniform-motion': UniformMotionCalculator, 'inclined-plane': InclinedPlaneCalculator };
  let { model, index }: { model: ModelDefinition; index: number } = $props();
  const Calculator = $derived(calculators[model.calculator]);
</script>
<ModelCard {model} {index}>
  {#snippet calculator()}<Calculator />{/snippet}
</ModelCard>
