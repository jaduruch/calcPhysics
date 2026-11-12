import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {toSI,fromSI} from '../src/lib/physics/units.ts';
import {parseQuantityInUnit} from '../src/lib/calculators/quantities.ts';
import {solveResourceModel} from '../src/lib/physics/resources/solver.ts';
import {resourcePhysics} from '../src/lib/physics/resources/models.ts';
import {resourceDefinitions} from '../src/lib/content/resource-catalog.ts';
import {resourceEquations} from '../src/lib/calculators/resource-equations.ts';
test('all five source temperature scales, all 25 conversion directions and absolute zero',()=>{
 const units=['K','°C','°F','°Ra','°Ré'];
 for(const kelvin of [0,273.15,293.15,373.15])for(const input of units)for(const output of units){
  const raw=fromSI(kelvin,'temperature',input),si=toSI(raw,'temperature',input);
  assert.ok(Math.abs(si-kelvin)<1e-10);
  assert.ok(Math.abs(toSI(fromSI(si,'temperature',output),'temperature',output)-kelvin)<1e-10);
 }
 assert.ok(Math.abs(fromSI(293.15,'temperature','°Ra')-527.67)<1e-10);
 assert.ok(Math.abs(fromSI(293.15,'temperature','°Ré')-16)<1e-10);
 assert.equal(parseQuantityInUnit('1k','temperature','°Ré').status,'invalid');
 const d=resourceDefinitions.find(d=>d.id==='temperature-scales');
 const r=solveResourceModel(resourcePhysics[d.id],{T:293.15});assert.equal(r.status,'success');
 for(const input of ['°Ra','°Ré'])for(const eq of [...resourceEquations(d,r,{T:input}).conversions,...resourceEquations(d,r,{T:input}).equations.map(e=>e.expression)])katex.renderToString(eq,{throwOnError:true});
});
