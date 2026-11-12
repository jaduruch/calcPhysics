<script lang="ts">
  import type { ModelDefinition } from '#lib/content/model-types.ts';
  import ElectricalCalculator from './calculator/ElectricalCalculator.svelte';
  import type { ElectricalModelId } from '#lib/physics/electricity.ts';
  import DynamicsCalculator from './calculator/DynamicsCalculator.svelte';
  import ModelCard from './ModelCard.svelte';
  import UniformMotionCalculator from './calculator/UniformMotionCalculator.svelte';
  import InclinedPlaneCalculator from './calculator/InclinedPlaneCalculator.svelte';
  import IdealGasCalculator from './calculator/IdealGasCalculator.svelte';
  import QubitSimulator from './calculator/QubitSimulator.svelte';
  import DopplerCalculator from './calculator/DopplerCalculator.svelte';
  import TotalReflectionCalculator from './calculator/TotalReflectionCalculator.svelte';
  import ResourceCalculator from './calculator/ResourceCalculator.svelte';
  import KinematicsCalculator from './calculator/KinematicsCalculator.svelte';
  import type { KinematicsModelId } from '#lib/content/kinematics.ts';
  const calculators = { 'total-reflection': TotalReflectionCalculator, doppler: DopplerCalculator, qubit: QubitSimulator, 'ideal-gas': IdealGasCalculator, 'uniform-motion': UniformMotionCalculator, 'inclined-plane': InclinedPlaneCalculator };
  let { model, index }: { model: ModelDefinition; index: number } = $props();
  const Calculator = $derived(model.calculator === 'dynamics' || model.calculator === 'kinematics' || model.calculator === 'electrical' || model.calculator === 'resource' ? null : calculators[model.calculator]);
</script>
<ModelCard {model} {index}>
  {#snippet calculator()}{#if model.calculator === 'dynamics'}<DynamicsCalculator modelId={model.id}/>{:else if model.calculator === 'kinematics'}<KinematicsCalculator modelId={model.id as KinematicsModelId}/>{:else if model.calculator === 'resource'}<ResourceCalculator modelId={model.id}/>{:else if model.calculator === 'electrical'}<ElectricalCalculator modelId={model.id as ElectricalModelId} />{:else if Calculator}<Calculator />{/if}{/snippet}
</ModelCard>
