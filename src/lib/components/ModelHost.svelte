<script lang="ts">
  import type { ModelDefinition } from '#lib/content/model-types.ts';
  import ElectricalCalculator from './calculator/ElectricalCalculator.svelte';
  import type { ElectricalModelId } from '#lib/physics/electricity.ts';
  import ModelCard from './ModelCard.svelte';
  import UniformMotionCalculator from './calculator/UniformMotionCalculator.svelte';
  import InclinedPlaneCalculator from './calculator/InclinedPlaneCalculator.svelte';
  import IdealGasCalculator from './calculator/IdealGasCalculator.svelte';
  import QubitSimulator from './calculator/QubitSimulator.svelte';
  import DopplerCalculator from './calculator/DopplerCalculator.svelte';
  import TotalReflectionCalculator from './calculator/TotalReflectionCalculator.svelte';
  const calculators = { 'total-reflection': TotalReflectionCalculator, doppler: DopplerCalculator, qubit: QubitSimulator, 'ideal-gas': IdealGasCalculator, 'uniform-motion': UniformMotionCalculator, 'inclined-plane': InclinedPlaneCalculator };
  let { model, index }: { model: ModelDefinition; index: number } = $props();
  const Calculator = $derived(model.calculator === 'electrical' ? null : calculators[model.calculator]);
</script>
<ModelCard {model} {index}>
  {#snippet calculator()}{#if model.calculator === 'electrical'}<ElectricalCalculator modelId={model.id as ElectricalModelId} />{:else if Calculator}<Calculator />{/if}{/snippet}
</ModelCard>
