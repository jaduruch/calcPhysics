import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { quantitySymbolLatex } from '../src/lib/calculators/quantity-symbol.ts';
import { resourceDisplaySymbol } from '../src/lib/calculators/resource-equations.ts';
import { electricalDefinitions, electricalDisplaySymbol } from '../src/lib/content/electricity.ts';
import { resourceDefinitions } from '../src/lib/content/resource-catalog.ts';
import { models } from '../src/lib/content/topics.ts';

test('word, numeric, Unicode and compound indices remain grouped in mathematical notation',()=>{
 for(const [symbol,expected] of [['t_peak','t_{peak}'],['y_peak','y_{peak}'],['v_impact','v_{impact}'],['v_{y,impact}','v_{y,impact}'],['R_12','R_{12}'],['vᵧ₀','v_{y0}'],['θ₁','θ_{1}'],['vᵧ(t)','v_{y}(t)']])assert.equal(quantitySymbolLatex(symbol),expected);
 assert.equal(quantitySymbolLatex('f','s'),'f_{s}');
});

test('display adapters retain complete indices instead of stripping or converting only their first letter',()=>{
 assert.equal(resourceDisplaySymbol('t_{peak}'),'t_{peak}');
 assert.equal(resourceDisplaySymbol('t_peak'),'t_peak');
 assert.equal(resourceDisplaySymbol('v_{y,impact}'),'v_{y,impact}');
 assert.equal(electricalDisplaySymbol('R12'),'R_{12}');
 assert.equal(electricalDisplaySymbol('I1'),'I_1');
});

test('all model and calculator symbols render valid inline KaTeX, including theory subscripts',()=>{
 const symbols=[...models.flatMap(model=>model.variables.map(variable=>[variable.symbol,variable.subscript])),...resourceDefinitions.flatMap(definition=>definition.fields.map(field=>[resourceDisplaySymbol(field.symbol)])),...electricalDefinitions.flatMap(definition=>definition.inputs.map(field=>[electricalDisplaySymbol(field.id)]))];
 for(const [symbol,subscript] of symbols)assert.doesNotThrow(()=>katex.renderToString(quantitySymbolLatex(symbol,subscript),{displayMode:false,throwOnError:true,strict:'error',trust:false}),symbol);
});
