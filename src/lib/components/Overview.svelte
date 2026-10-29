<script lang="ts">
  import { childrenOf, models, topics, type Topic } from '#lib/content/topics.ts';
  import { ui } from '#lib/i18n/en.ts';
  import TopicCard from './TopicCard.svelte';
  import ModelCard from './ModelCard.svelte';
  let { topic = null }: { topic?: Topic | null } = $props();
  const children = $derived(childrenOf(topic?.id ?? null));
  const parent = $derived(topics.find(item => item.id === topic?.parentId));
</script>
<svelte:head>
  <title>{topic ? `${topic.title} — calcPhysics` : 'calcPhysics — Physics theory & calculations'}</title>
  <meta name="description" content={topic?.description ?? 'Explore physics theory and calculation models. A clear reference for learning and everyday engineering.'} />
</svelte:head>
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol><li>{#if topic}<a href="/">{ui.home}</a>{:else}<span aria-current="page">{ui.home}</span>{/if}</li>
  {#if parent}<li><a href={parent.path}>{parent.title}</a></li>{/if}
  {#if topic}<li><span aria-current="page">{topic.title}</span></li>{/if}</ol>
</nav>
<section class="intro" aria-labelledby="page-title">
  <p class="eyebrow">{topic ? ui.subjectLabel : 'THEORY / CALCULATION / UNDERSTANDING'}</p>
  <h1 id="page-title">{topic?.title ?? 'Physics. From principles to practice.'}</h1>
  <p class="lead">{topic?.description ?? 'Understand the theory. Find the right model. Calculate with confidence — from the classroom to everyday engineering.'}</p>
  {#if !topic}<a class="primary-link" href="/mechanics">Start with Mechanics <span aria-hidden="true">↗</span></a>{/if}
</section>
{#if topic?.id === 'kinematics'}
  <div>
    <div class="model-list">{#each models as model, index}
      <ModelCard {model} {index} />
    {/each}</div>
  </div>
{:else}
  <section aria-labelledby="topics-title">
    <div class="section-heading"><h2 id="topics-title">{topic ? ui.subtopics : ui.subjects}</h2><span>{topic ? '01 SUBTOPIC' : '06 SUBJECTS'}</span></div>
    <div class="topic-grid">{#each children as child}<TopicCard topic={child} />{/each}</div>
  </section>
{/if}
