<script lang="ts">
  import { childrenOf, models, topics, type Topic } from '#lib/content/topics.ts';
  import { ui } from '#lib/i18n/en.ts';
  import TopicCard from './TopicCard.svelte';
  import ModelHost from './ModelHost.svelte';
  import SiReference from './SiReference.svelte';
  let { topic = null }: { topic?: Topic | null } = $props();
  const children = $derived(childrenOf(topic?.id ?? null));
  const reference = $derived(topic ? undefined : children.find(child => child.id === 'si-reference'));
  const listedChildren = $derived(topic ? children : children.filter(child => child.id !== 'si-reference'));
  const topicModels = $derived(models.filter(model => model.topicId === topic?.id));
  const parent = $derived(topics.find(item => item.id === topic?.parentId));
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ol><li>{#if topic}<a href="/">{ui.home}</a>{:else}<span aria-current="page">{ui.home}</span>{/if}</li>
  {#if parent}<li><a href={parent.path}>{parent.title}</a></li>{/if}
  {#if topic}<li><span aria-current="page">{topic.title}</span></li>{/if}</ol>
</nav>
<section class="intro" aria-labelledby="page-title">
  <p class="eyebrow">{topic ? ui.subjectLabel : 'THEORY / CALCULATION / UNDERSTANDING'}</p>
  <h1 id="page-title">{topic?.title ?? ui.homeTitle}</h1>
  <p class="lead">{topic?.description ?? ui.homeDescription}</p>
  {#each topic?.references ?? [] as reference}<p><a href={reference.url}>{reference.title}</a></p>{/each}
</section>
{#if topic?.id === 'si-reference'}
  <SiReference />
{:else if topicModels.length > 0}
  <div>
    <div class="model-list">{#each topicModels as model, index (model.id)}
      <ModelHost {model} {index} />
    {/each}</div>
  </div>
{:else}
  {#if reference}<section class="reference-highlight" aria-labelledby={`${reference.id}-featured-title`}><TopicCard topic={reference} featured /></section>{/if}
  <section aria-labelledby="topics-title">
    <div class="section-heading"><h2 id="topics-title">{topic ? ui.subtopics : ui.subjects}</h2><span>{String(listedChildren.length).padStart(2, '0')} {topic ? (listedChildren.length === 1 ? 'SUBTOPIC' : 'SUBTOPICS') : 'SUBJECTS'}</span></div>
    <div class="topic-grid">{#each listedChildren as child}<TopicCard topic={child} />{/each}</div>
  </section>
{/if}
