<script lang="ts">
  import katex from 'katex';
  let { expression }: { expression: string } = $props();
  const markup = $derived(katex.renderToString(expression, { displayMode: true, output: 'htmlAndMathml', trust: false, throwOnError: true }));
</script>
<div class="formula">{@html markup}</div>
