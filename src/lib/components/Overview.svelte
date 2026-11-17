<script lang="ts">
  import { childrenOf, models, topics, type Topic } from '#lib/content/topics.ts';
  import { ui, text, localPath } from '#lib/i18n/runtime.ts';
  import TopicCard from './TopicCard.svelte';
  import {groupTopicModels} from '#lib/content/model-groups.ts';
  import ModelHost from './ModelHost.svelte';
  import SiteSearch from './SiteSearch.svelte';
  import Disclaimer from './Disclaimer.svelte';
  import About from './About.svelte';
  import CalculatorHelp from './CalculatorHelp.svelte';
  import SiReference from './SiReference.svelte';
  let { topic = null }: { topic?: Topic | null } = $props();
  const children = $derived(childrenOf(topic?.id ?? null));
  const reference = $derived(topic ? undefined : children.find(child => child.id === 'si-reference'));
  const listedChildren = $derived(topic ? children : children.filter(child => child.id !== 'si-reference'));
  const topicModels = $derived(groupTopicModels(models.filter(model => model.topicId === topic?.id)));
  const parent = $derived(topics.find(item => item.id === topic?.parentId));
</script>

<nav class="breadcrumbs" aria-label={text('Breadcrumb')}>
  <ol><li>{#if topic}<a href={localPath("/")}>{ui.home}</a>{:else}<span aria-current="page">{ui.home}</span>{/if}</li>
  {#if parent}<li><a href={localPath(parent.path)}>{text(parent.title)}</a></li>{/if}
  {#if topic}<li><span aria-current="page">{text(topic.title)}</span></li>{/if}</ol>
</nav>
<section class="intro" aria-labelledby="page-title">
  {#if topic && !topic.kind}<p class="eyebrow">{ui.subjectLabel}</p>{/if}
  <h1 id="page-title">{topic ? text(topic.title) : ui.homeTitle}</h1>
  <p class="lead">{topic ? text(topic.description) : ui.homeDescription}</p>
  {#each topic?.references ?? [] as reference}<p><a href={reference.url}>{text(reference.title)}</a></p>{/each}
</section>
{#if !topic}
  <p class="guide-link"><a class="primary-link" href={localPath("/calculator-help")}>{text("How does it work?")}</a></p>
  <SiteSearch />
{/if}
{#if topic?.id === 'disclaimer'}
  <Disclaimer />
{:else if topic?.id === 'about'}
  <About />
{:else if topic?.id === 'calculator-help'}
  <CalculatorHelp />
{:else if topic?.id === 'si-reference'}
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
    <div class="section-heading"><h2 id="topics-title">{topic ? ui.subtopics : ui.subjects}</h2><span>{String(listedChildren.length).padStart(2, '0')} {topic ? text(listedChildren.length === 1 ? 'SUBTOPIC' : 'SUBTOPICS') : text('SUBJECTS')}</span></div>
    <div class="topic-grid">{#each listedChildren as child}<TopicCard topic={child} />{/each}</div>
  </section>
{/if}

<style>
  .guide-link { margin: 0 0 24px; }
  .guide-link .primary-link { margin-top: 0; min-height: 44px; }
</style>
