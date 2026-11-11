import {formatDuration} from './duration.ts';
import type {KinematicsModelId} from '../content/kinematics.ts';
import {kinematicsUi as text} from '../i18n/en.ts';
import {quantityLatex} from './quantities.ts';
import {fromSI,getUnit,unitGroups,type QuantityKind} from '../physics/units.ts';
import {kinematicFields} from '../content/kinematics.ts';
import type {KinematicsResult} from '../physics/mechanics/accelerated-motion.ts';
export function kinematicsEquations(id:KinematicsModelId,result:Extract<KinematicsResult,{status:'success'}>,units:Record<string,string>) {
 const fields=kinematicFields[id];
 const kind=(key:string):QuantityKind=>fields.find(field=>field.id===key)?.kind??(key==='flight'||key==='peakTime'?'time':key==='vx'||key==='vy0'||key==='v'||key==='impactVelocity'||key==='vyImpact'||key==='speedImpact'?'velocity':'length');
 const symbol:Record<string,string>={s0:'s_0',s:'s',v0:'v_0',a:'a',t:'t',y0:'y_0',h:'h',vx:'v_x',g:'g',alpha:'\\alpha'};
 const conversions=fields.flatMap(field=>{
  const unit=units[field.id];if(!unit||unit===unitGroups[field.kind].si||result.assumed.includes(field.id)||result.target===field.id)return [];
  const si=unitGroups[field.kind].si;
  const v=result.scenarios[0].values[field.id],definition=getUnit(field.kind,unit);
  const factor='factorLatex' in definition?definition.factorLatex:definition.factor.toString();
  return [`${symbol[field.id]}=${quantityLatex(fromSI(v,field.kind,unit),unit,false)}\\cdot\\frac{${factor}\\,\\mathrm{${si}}}{1\\,\\mathrm{${unit}}}\\approx ${quantityLatex(v,si,field.kind!=='angle')}`];
 });
 const scenarios=result.scenarios.map(scenario=>{
  const v=scenario.values;
  const q=(key:string)=>{const value=v[key];const unit=unitGroups[kind(key)].si;const latex=quantityLatex(value,unit,kind(key)!=='angle');return value<0?`\\left(${latex}\\right)`:latex;};
  const square=(key:string)=>`\\left(${q(key)}\\right)^2`;
  const output=(key:string,formula:string,numeric:string,label:string,targetSymbol:string,unit:string)=>{
   const selected=units[key]??unit;
   const clock=key==='t'?formatDuration(v[key]):'';
   return {key,label,expression:`${targetSymbol}=${formula}=${numeric}\\approx ${quantityLatex(fromSI(v[key],kind(key),selected),selected,selected===unit)}${clock?`=\\text{${clock}}`: ''}`};
  };
  const equations:{key:string;label:string;expression:string}[]=[];
  if(id==='accelerated-motion'){
   const templates={s:[String.raw`s_0+v_0\cdot t+\frac12a\cdot t^2`,`${q('s0')}+${q('v0')}\\cdot${q('t')}+\\frac12\\cdot${q('a')}\\cdot${square('t')}`],s0:[String.raw`s-v_0\cdot t-\frac12a\cdot t^2`,`${q('s')}-${q('v0')}\\cdot${q('t')}-\\frac12\\cdot${q('a')}\\cdot${square('t')}`],v0:[String.raw`\frac{s-s_0}{t}-\frac12a\cdot t`,`\\frac{${q('s')}-${q('s0')}}{${q('t')}}-\\frac12\\cdot${q('a')}\\cdot${q('t')}`],a:[String.raw`\frac{2(s-s_0-v_0t)}{t^2}`,`\\frac{2\\cdot\\left(${q('s')}-${q('s0')}-${q('v0')}\\cdot${q('t')}\\right)}{${square('t')}}`],t:v.a===0?[String.raw`\frac{s-s_0}{v_0}`,`\\frac{${q('s')}-${q('s0')}}{${q('v0')}}`]:[String.raw`\frac{-v_0\pm\sqrt{v_0^2+2a(s-s_0)}}{a}`,`\\frac{-${q('v0')}\\pm\\sqrt{${square('v0')}+2\\cdot${q('a')}\\cdot\\left(${q('s')}-${q('s0')}\\right)}}{${q('a')}}`]};
   const key=result.target!;const [formula,numeric]=templates[key];
   equations.push(output(key,formula,numeric,fields.find(field=>field.id===key)!.name,symbol[key],key==='t'?'s':key==='a'?'m/s²':key==='v0'?'m/s':'m'));
   equations.push(output('v',String.raw`v_0+a\cdot t`,`${q('v0')}+${q('a')}\\cdot${q('t')}`,text.velocity,'v','m/s'));
   equations.push(output('ds',String.raw`s-s_0`,`${q('s')}-${q('s0')}`,text.displacement,String.raw`\Delta s`,'m'));
  }else if(id==='vertical-throw'){
   equations.push(output('flight',String.raw`\frac{v_0+\sqrt{v_0^2+2gy_0}}{g}`,`\\frac{${q('v0')}+\\sqrt{${square('v0')}+2\\cdot${q('g')}\\cdot${q('y0')}}}{${q('g')}}`,text.flight,'t_f','s'));
   equations.push(output('peakTime',String.raw`\max(0,v_0/g)`,`\\max\\left(0\\,\\mathrm{s},\\frac{${q('v0')}}{${q('g')}}\\right)`,text.peakTime,'t_{peak}','s'));
   equations.push(output('peakHeight',String.raw`y_0+v_0t_{peak}-\frac12gt_{peak}^2`,`${q('y0')}+${q('v0')}\\cdot${q('peakTime')}-\\frac12\\cdot${q('g')}\\cdot${square('peakTime')}`,text.peakHeight,'y_{peak}','m'));
   equations.push(output('impactVelocity',String.raw`-\sqrt{v_0^2+2gy_0}`,`-\\sqrt{${square('v0')}+2\\cdot${q('g')}\\cdot${q('y0')}}`,text.impactVelocity,'v_{impact}','m/s'));
  }else if(id==='oblique-throw'){
   equations.push(output('vx',String.raw`v_0\cdot\cos\alpha`,`${q('v0')}\\cdot\\cos\\left(${q('alpha')}\\right)`,text.horizontalVelocity,'v_x','m/s'));
   equations.push(output('vy0',String.raw`v_0\cdot\sin\alpha`,`${q('v0')}\\cdot\\sin\\left(${q('alpha')}\\right)`,text.initialVerticalVelocity,'v_{y0}','m/s'));
   equations.push(output('flight',String.raw`\frac{v_{y0}+\sqrt{v_{y0}^2+2gy_0}}{g}`,`\\frac{${q('vy0')}+\\sqrt{${square('vy0')}+2\\cdot${q('g')}\\cdot${q('y0')}}}{${q('g')}}`,text.flight,'t_f','s'));
   equations.push(output('peakTime',String.raw`\max(0,v_{y0}/g)`,`\\max\\left(0\\,\\mathrm{s},\\frac{${q('vy0')}}{${q('g')}}\\right)`,text.peakTime,'t_{peak}','s'));
   equations.push(output('peakHeight',String.raw`y_0+v_{y0}\cdot t_{peak}-\frac12g\cdot t_{peak}^2`,`${q('y0')}+${q('vy0')}\\cdot${q('peakTime')}-\\frac12\\cdot${q('g')}\\cdot${square('peakTime')}`,text.peakHeight,'y_{peak}','m'));
   equations.push(output('range',String.raw`v_x\cdot t_f`,`${q('vx')}\\cdot${q('flight')}`,text.range,'R','m'));
   equations.push(output('vyImpact',String.raw`-\sqrt{v_{y0}^2+2gy_0}`,`-\\sqrt{${square('vy0')}+2\\cdot${q('g')}\\cdot${q('y0')}}`,text.vyImpact,'v_{y,impact}','m/s'));
   equations.push(output('speedImpact',String.raw`\sqrt{v_x^2+v_{y,impact}^2}`,`\\sqrt{${square('vx')}+${square('vyImpact')}}`,text.speedImpact,'v_{impact}','m/s'));
  }else{
   equations.push(output('flight',String.raw`\sqrt{2h/g}`,`\\sqrt{\\frac{2\\cdot${q('h')}}{${q('g')}}}`,text.flight,'t_f','s'));
   equations.push(output('range',String.raw`v_x\cdot t_f`,`${q('vx')}\\cdot${q('flight')}`,text.range,'R','m'));
   equations.push(output('vyImpact',String.raw`-g\cdot t_f`,`-${q('g')}\\cdot${q('flight')}`,text.vyImpact,'v_{y,impact}','m/s'));
   equations.push(output('speedImpact',String.raw`\sqrt{v_x^2+v_{y,impact}^2}`,`\\sqrt{${square('vx')}+${square('vyImpact')}}`,text.speedImpact,'v_{impact}','m/s'));
  }
  return equations;
 });
 return {conversions,scenarios};
}
