import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { solveElectrical } from '../src/lib/physics/electricity.ts';
import { transformerDefinition } from '../src/lib/content/electricity.ts';
import { electricalEquations } from '../src/lib/calculators/electrical-equations.ts';
const near = (a,b) => assert.ok(Math.abs(a-b) <= 1e-10*Math.max(Math.abs(b),1), `${a} != ${b}`);
const ideal = {U1:100,U2:50,I1:2,I2:4,R1:50,R2:12.5,P1:200,P2:200,N1:200,N2:100,C1:1e-6,C2:4e-6,n:2};

test('ideal transformer uses lossless inverses and simplified equations for every independent pair', () => {
  const keys = Object.keys(ideal);
  for (let a=0;a<keys.length;a++) for (let b=a+1;b<keys.length;b++) {
    const given = {[keys[a]]:ideal[keys[a]],[keys[b]]:ideal[keys[b]]};
    const before = {...given};
    const result = solveElectrical('transformer',given,'ideal');
    assert.deepEqual(given,before);
    assert.ok(['success','underdetermined'].includes(result.status), JSON.stringify({given,result}));
    if(result.status !== 'success') continue;
    assert.equal(result.values.eta,1);
    assert.equal(result.assumedIdeal,true);
    assert.equal(result.outputs.eta,undefined);
    for (const [key,value] of Object.entries(result.outputs)) near(value,ideal[key]);
    assert.ok(result.steps.every(step => !step.formula.includes('eta')));
    for (const equation of electricalEquations(transformerDefinition(false),result,{})) {
      assert.ok(!equation.includes('\\eta'));
      assert.doesNotThrow(()=>katex.renderToString(equation,{throwOnError:true}));
    }
  }
  near(solveElectrical('transformer',{P1:200},'ideal').outputs.P2,200);
  near(solveElectrical('transformer',{P2:200},'ideal').outputs.P1,200);
});

test('real transformer never assumes efficiency and keeps independently determined partial results', () => {
  const result = solveElectrical('transformer',{U1:100,n:2,I2:3.2},'real');
  assert.equal(result.status,'success');
  assert.equal(result.assumedIdeal,false);
  near(result.outputs.U2,50); near(result.outputs.P2,160); near(result.outputs.R2,15.625);
  for(const key of ['eta','P1','I1','R1']) assert.equal(result.values[key],undefined,key);
  const zero = solveElectrical('transformer',{P1:0,P2:0},'real');
  assert.equal(zero.status,'underdetermined');
});

test('real transformer accepts explicit efficiency or infers it from independent power/current/resistance data', () => {
  const result = solveElectrical('transformer',{U1:100,n:2,I2:3.2,eta:.8},'real');
  assert.equal(result.status,'success');
  near(result.outputs.U2,50);near(result.outputs.I1,2);near(result.outputs.P1,200);near(result.outputs.R1,50);
  for (const given of [{P1:200,P2:160},{I1:2,I2:3.2,n:2},{R1:50,R2:15.625,n:2}]) {
    const inferred = solveElectrical('transformer',given,'real');
    assert.equal(inferred.status,'success');near(inferred.outputs.eta,.8);
  }
  const equations=electricalEquations(transformerDefinition(true),result,{});
  assert.ok(equations.some(equation=>equation.includes('\\eta')));
  for (const equation of equations) assert.doesNotThrow(()=>katex.renderToString(equation,{throwOnError:true}));
});

test('explicit modes reject inconsistent ideal losses and invalid or impossible real efficiencies', () => {
  assert.equal(solveElectrical('transformer',{P1:200,P2:160},'ideal').status,'no-solution');
  assert.equal(solveElectrical('transformer',{eta:.8},'ideal').status,'no-solution');
  for(const eta of [0,-.1,1.01,NaN,Infinity]) assert.equal(solveElectrical('transformer',{eta},'real').status,'invalid');
  assert.equal(solveElectrical('transformer',{P1:100,P2:120},'real').status,'no-solution');
  assert.equal(solveElectrical('transformer',{P1:200,P2:160,eta:.9},'real').status,'no-solution');
});
