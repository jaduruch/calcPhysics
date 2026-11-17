<script lang="ts">
  import {text} from '#lib/i18n/runtime.ts';
  import katex from 'katex';
  let { expression, wrap = false }: { expression: string; wrap?: boolean } = $props();
  const localizedExpression=$derived(expression.replace(/\\(text|mathrm)\{constant\}/g,(_,command:string)=>`\\${command}{${text('constant')}}`));
  const renderExpression = $derived(wrap ? localizedExpression.replace(/(=|\\approx\b)/g, String.raw`\allowbreak $1\nobreak `) : localizedExpression);
  const markup = $derived(katex.renderToString(wrap ? `\\displaystyle ${renderExpression}` : renderExpression, { displayMode: !wrap, output: 'htmlAndMathml', trust: false, throwOnError: true }));
</script>
<div class="formula" class:wrappable={wrap}>{@html markup}</div>

<style>
  /* Let KaTeX's full strut height participate in layout, including the depth
     of display-style fractions. A bare inline span can overflow its line box
     vertically and create a scrollbar as soon as overflow-x is auto. */
  .formula :global(.katex-html) { display: inline-block; max-width: 100%; padding-block: .4em; }
  .wrappable { line-height: 2.6; }
  .wrappable :global(.katex), .wrappable :global(.katex-html) { white-space: normal; }
</style>
