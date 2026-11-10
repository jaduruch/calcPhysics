<script lang="ts">
  import type { Topic } from '#lib/content/topics.ts';
  import { ui } from '#lib/i18n/en.ts';
  let { topic, featured = false }: { topic: Topic; featured?: boolean } = $props();
</script>
{#snippet contents()}
  <span class="card-top"><span class="topic-number">{topic.symbol}</span><span class="badge">{topic.published ? ui.open : ui.planned}</span></span>
  {#if featured}<h2 id={`${topic.id}-featured-title`}>{topic.title}</h2>{:else}<h3>{topic.title}</h3>{/if}<p>{topic.description}</p>
  <span class="card-bottom">{topic.published ? (topic.id === 'si-reference' ? ui.openReference : ui.subtopics) : ui.planned}<span aria-hidden="true">{topic.published ? '↗' : '—'}</span></span>
{/snippet}
{#if topic.published}
  <a class="topic-card available" class:reference-card={featured} href={topic.path}>{@render contents()}</a>
{:else}
  <button class="topic-card" type="button" disabled>{@render contents()}</button>
{/if}
