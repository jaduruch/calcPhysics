<script lang="ts">
  import katex from 'katex';
  let { expression, wrap = false }: { expression: string; wrap?: boolean } = $props();
  const renderExpression = $derived(wrap ? expression.replace(/(=|\\approx\b)/g, String.raw`\allowbreak $1\nobreak `) : expression);
  const markup = $derived(katex.renderToString(wrap ? `\\displaystyle ${renderExpression}` : renderExpression, { displayMode: !wrap, output: 'htmlAndMathml', trust: false, throwOnError: true }));
</script>
<div class="formula" class:wrappable={wrap}>{@html markup}</div>

<style>
  .wrappable { line-height: 2.6; }
  .wrappable :global(.katex), .wrappable :global(.katex-html) { white-space: normal; }
</style>
