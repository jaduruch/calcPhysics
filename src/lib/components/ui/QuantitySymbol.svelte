<script lang="ts">
 import katex from 'katex';
 import { quantitySymbolLatex } from '#lib/calculators/quantity-symbol.ts';
 let { symbol, subscript }: { symbol:string; subscript?:string }=$props();
 const markup=$derived(katex.renderToString(quantitySymbolLatex(symbol,subscript),{displayMode:false,output:'htmlAndMathml',trust:false,throwOnError:true}));
</script>
<span class="quantity-symbol">{@html markup}</span>
<style>
 .quantity-symbol { display:inline-block; white-space:nowrap; }
 .quantity-symbol :global(.katex) { font-size:1em; }
</style>
