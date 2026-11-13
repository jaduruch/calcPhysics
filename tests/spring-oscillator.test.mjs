import test from 'node:test';
import assert from 'node:assert/strict';
import {solveSpringOscillator} from '../src/lib/physics/mechanics/spring-models.ts';
import {springOscillatorFields} from '../src/lib/content/spring-models.ts';
import {resourceFormula} from '../src/lib/calculators/resource-equations.ts';
import katex from 'katex';
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(b)),`${a} != ${b}`);
test('spring oscillator: all minimal pairs and all inverse quantities',()=>{const expected={m:2,k:200,omega:10,T:Math.PI/5,f:5/Math.PI};for(const input of [{m:2,k:200},...['omega','T','f'].flatMap(timing=>['m','k'].map(mechanical=>({[timing]:expected[timing],[mechanical]:expected[mechanical]})))]){const snapshot={...input},r=solveSpringOscillator(input);assert.deepEqual(r.conflicts,[]);assert.deepEqual(input,snapshot);for(const key of Object.keys(expected))near(r.values[key],expected[key]);for(const step of r.steps)katex.renderToString(resourceFormula(step.formula,springOscillatorFields,r.values),{throwOnError:true});}});
test('timing alone yields partial values without inventing mass or stiffness',()=>{const r=solveSpringOscillator({T:2});near(r.values.f,.5);near(r.values.omega,Math.PI);assert.equal(r.values.m,undefined);assert.equal(r.values.k,undefined);});
test('invalid, blocked and inconsistent inputs discard dependent results',()=>{assert.deepEqual(solveSpringOscillator({m:-1,k:200}).invalid,['m']);assert.equal(solveSpringOscillator({m:2,k:200},['k']).values.T,undefined);const r=solveSpringOscillator({m:2,k:200,T:99});assert.ok(r.conflicts.includes('T'));assert.equal(r.values.f,undefined);const partial=solveSpringOscillator({m:NaN,T:2});near(partial.values.f,.5);});

import {solveCircularSpring,circularSpringRules} from '../src/lib/physics/mechanics/spring-models.ts';
import {circularSpringFields} from '../src/lib/content/spring-models.ts';
test('circular spring reproduces task 1 and validates every displayed inverse',()=>{const r=solveCircularSpring({m:.1,k:2,l:.5,L:2.5});assert.equal(r.noOrbit,false);assert.deepEqual(r.conflicts,[]);near(r.values.omega,4);near(r.values.Fs,4);near(r.values.Fg,.981);near(r.values.alpha,Math.acos(.981/4));near(r.values.R,2.5*Math.sin(r.values.alpha));for(const rule of circularSpringRules){const expected=rule.calculate(r.values);near(expected,r.values[rule.target]);}for(const step of r.steps)katex.renderToString(resourceFormula(step.formula,circularSpringFields,r.values),{throwOnError:true});});
test('circular spring: each field reconstructs from other known quantities',()=>{const full=solveCircularSpring({m:.1,k:2,l:.5,L:2.5}).values;for(const key of Object.keys(full)){const input={...full};delete input[key];const r=solveCircularSpring(input);assert.deepEqual(r.conflicts,[],key);near(r.values[key],full[key]);}});
test('circular spring: speed sets length, gravity inference precedes default, and mass independent tension',()=>{const r=solveCircularSpring({m:.1,k:2,l:.5,omega:4});near(r.values.L,2.5);const g=solveCircularSpring({L:2.5,omega:4,alpha:Math.acos(1.6/40)});near(g.values.g,1.6);assert.equal(g.assumed,false);const partial=solveCircularSpring({k:2,l:.5,L:2.5},['g']);near(partial.values.Fs,4);assert.equal(partial.values.omega,undefined);});
test('circular spring excludes static or impossible circles and invalid inputs',()=>{const r=solveCircularSpring({m:1,k:2,l:.5,L:1});assert.equal(r.noOrbit,true);assert.equal(r.values.omega,undefined);assert.ok(solveCircularSpring({alpha:0}).invalid.includes('alpha'));assert.ok(solveCircularSpring({m:0}).invalid.includes('m'));});

import {models} from '../src/lib/content/topics.ts';
test('both spring calculators are registered on the Hooke page',()=>{for(const id of ['spring-oscillator','circular-spring-oscillator'])assert.ok(models.some(m=>m.id===id&&m.topicId==='hookes-law'));});
