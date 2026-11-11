import {formatDuration} from './duration.ts';
import type {KinematicsModelId} from '../content/kinematics.ts';
import {kinematicsUi as text} from '../i18n/en.ts';
import {quantityLatex} from './quantities.ts';
import {fromSI,getUnit,unitGroups,type QuantityKind} from '../physics/units.ts';
import {kinematicFields} from '../content/kinematics.ts';
import type {KinematicsResult,AcceleratedField} from '../physics/mechanics/accelerated-motion.ts';
export function kinematicsEquations(id:KinematicsModelId,result:Extract<KinematicsResult,{status:'success'}>,units:Record<string,string>) {
 const fields=kinematicFields[id];
 const kind=(key:string):QuantityKind=>fields.find(field=>field.id===key)?.kind??(key==='flight'||key==='peakTime'?'time':key==='vx'||key==='vy0'||key==='v'||key==='impactVelocity'||key==='vyImpact'||key==='speedImpact'?'velocity':'length');
 const symbol:Record<string,string>={s0:'s_0',s:'s',v0:'v_0',a:'a',t:'t',y0:'y_0',h:'h',vx:'v_x',g:'g',alpha:'\\alpha',v:'v_1'};
 const conversions=fields.flatMap(field=>{
  const unit=units[field.id];if(!unit||unit===unitGroups[field.kind].si||result.assumed.includes(field.id)||result.target===field.id||result.scenarios[0].steps?.some(step=>step.field===field.id))return [];
  const si=unitGroups[field.kind].si;
  const v=result.scenarios[0].values[field.id],definition=getUnit(field.kind,unit);
  const factor='factorLatex' in definition?definition.factorLatex:definition.factor.toString();
  return [`${symbol[field.id]}=${quantityLatex(fromSI(v,field.kind,unit),unit,false)}\\cdot\\frac{${factor}\\,\\mathrm{${si}}}{1\\,\\mathrm{${unit}}}\\approx ${quantityLatex(v,si,field.kind!=='angle')}`];
 });
 const scenarios=result.scenarios.map(scenario=>{
  const v=scenario.values;
  const q=(key:string)=>{const value=v[key];const unit=unitGroups[kind(key)].si;const latex=quantityLatex(value,unit,kind(key)!=='angle');return value<0?`\\left(${latex}\\right)`:latex;};
  const assumedOrigin = result.assumed.includes('s0') && v.s0 === 0;
  const assumedRest = result.assumed.includes('v0') && v.v0 === 0;
  const assumedHeight = result.assumed.includes('y0') && v.y0 === 0;
  const displacementFormula = assumedOrigin ? 's' : 's-s_0';
  const displacementNumeric = id !== 'accelerated-motion' ? '' : assumedOrigin ? q('s') : `${q('s')}-${q('s0')}`;
  const square=(key:string)=>`\\left(${q(key)}\\right)^2`;
  const output=(key:string,formula:string,numeric:string,label:string,targetSymbol:string,unit:string)=>{
   // Explicit model reductions: omit only origins assumed to be zero.
   // Manually entered zeros remain part of the displayed substitution.
   if(assumedHeight && (id==='vertical-throw'||id==='oblique-throw')){
    const verticalKey=id==='vertical-throw'?'v0':'vy0';
    const verticalSymbol=id==='vertical-throw'?'v_0':'v_{y0}';
    if(key==='flight'){
     formula=`\\frac{${verticalSymbol}+\\sqrt{${verticalSymbol}^2}}{g}`;
     numeric=`\\frac{${q(verticalKey)}+\\sqrt{${square(verticalKey)}}}{${q('g')}}`;
    }else if(key==='peakHeight'){
     formula=`${verticalSymbol}\\cdot t_{peak}-\\frac12g\\cdot t_{peak}^2`;
     numeric=`${q(verticalKey)}\\cdot${q('peakTime')}-\\frac12\\cdot${q('g')}\\cdot${square('peakTime')}`;
    }else if(key==='impactVelocity'||key==='vyImpact'){
     formula=`-\\sqrt{${verticalSymbol}^2}`;
     numeric=`-\\sqrt{${square(verticalKey)}}`;
    }
   }
   const selected=units[key]??unit;
   const clock=key==='t'?formatDuration(v[key]):'';
   return {key,label,expression:`${targetSymbol}=${formula}=${numeric}\\approx ${quantityLatex(fromSI(v[key],kind(key),selected),selected,selected===unit)}${clock?`=\\text{${clock}}`: ''}`};
  };
  const equations:{key:string;label:string;expression:string}[]=[];
  if(id==='accelerated-motion'){
   type Pair=[string,string];
   const d:Pair=[displacementFormula,displacementNumeric];
   const sum:Pair=assumedRest?['v_1',q('v')]:['v_0+v_1',`${q('v0')}+${q('v')}`];
   const difference:Pair=assumedRest?['v_1',q('v')]:['v_1-v_0',`${q('v')}-${q('v0')}`];
   const energyDifference:Pair=assumedRest?['v_1^2',square('v')]:['v_1^2-v_0^2',`${square('v')}-${square('v0')}`];
   const offset=assumedOrigin?'':'s_0+';
   const offsetNumber=assumedOrigin?'':`${q('s0')}+`;
   const sign=v.v>=0?'+':'-';
   const position:Partial<Record<AcceleratedField,Pair>>={
    s:[`${offset}${assumedRest?'':String.raw`v_0\cdot t+`}\\frac12a\\cdot t^2`,`${offsetNumber}${assumedRest?'':`${q('v0')}\\cdot${q('t')}+`}\\frac12\\cdot${q('a')}\\cdot${square('t')}`],
    s0:[String.raw`s-v_0\cdot t-\frac12a\cdot t^2`,`${q('s')}-${q('v0')}\\cdot${q('t')}-\\frac12\\cdot${q('a')}\\cdot${square('t')}`],
    v0:[`\\frac{${d[0]}}{t}-\\frac12a\\cdot t`,`\\frac{${d[1]}}{${q('t')}}-\\frac12\\cdot${q('a')}\\cdot${q('t')}`],
    a:assumedRest?[`\\frac{2${assumedOrigin?'s':`(${d[0]})`}}{t^2}`,`\\frac{2\\cdot${d[1]}}{${square('t')}}`]:[`\\frac{2(${d[0]}-v_0t)}{t^2}`,`\\frac{2\\cdot\\left(${d[1]}-${q('v0')}\\cdot${q('t')}\\right)}{${square('t')}}`],
    t:assumedRest?[`\\sqrt{\\frac{2${assumedOrigin?'s':`(${d[0]})`}}{a}}`,`\\sqrt{\\frac{2\\cdot${d[1]}}{${q('a')}}}`]:v.a===0?[`\\frac{${d[0]}}{v_0}`,`\\frac{${d[1]}}{${q('v0')}}`]:[`\\frac{-v_0${sign}\\sqrt{v_0^2+2a(${d[0]})}}{a}`,`\\frac{-${q('v0')}${sign}\\sqrt{${square('v0')}+2\\cdot${q('a')}\\cdot\\left(${d[1]}\\right)}}{${q('a')}}`]
   };
   const velocity:Partial<Record<AcceleratedField,Pair>>={
    v:assumedRest?[String.raw`a\cdot t`,`${q('a')}\\cdot${q('t')}`]:[String.raw`v_0+a\cdot t`,`${q('v0')}+${q('a')}\\cdot${q('t')}`],
    v0:[String.raw`v_1-a\cdot t`,`${q('v')}-${q('a')}\\cdot${q('t')}`],
    a:[`\\frac{${difference[0]}}{t}`,`\\frac{${difference[1]}}{${q('t')}}`],
    t:[`\\frac{${difference[0]}}{a}`,`\\frac{${difference[1]}}{${q('a')}}`]
   };
   const average:Partial<Record<AcceleratedField,Pair>>={
    s:[`${offset}\\frac{${sum[0]}}{2}\\cdot t`,`${offsetNumber}\\frac{${sum[1]}}{2}\\cdot${q('t')}`],
    s0:[String.raw`s-\frac{v_0+v_1}{2}\cdot t`,`${q('s')}-\\frac{${sum[1]}}{2}\\cdot${q('t')}`],
    v:assumedRest?[`\\frac{2${assumedOrigin?'s':`(${d[0]})`}}{t}`,`\\frac{2\\cdot${d[1]}}{${q('t')}}`]:[`\\frac{2${assumedOrigin?'s':`(${d[0]})`}}{t}-v_0`,`\\frac{2\\cdot${d[1]}}{${q('t')}}-${q('v0')}`],
    v0:[`\\frac{2${assumedOrigin?'s':`(${d[0]})`}}{t}-v_1`,`\\frac{2\\cdot${d[1]}}{${q('t')}}-${q('v')}`],
    t:[`\\frac{2${assumedOrigin?'s':`(${d[0]})`}}{${sum[0]}}`,`\\frac{2\\cdot${d[1]}}{${sum[1]}}`]
   };
   const energy:Partial<Record<AcceleratedField,Pair>>={
    s:[`${offset}\\frac{${energyDifference[0]}}{2a}`,`${offsetNumber}\\frac{${energyDifference[1]}}{2\\cdot${q('a')}}`],
    s0:[String.raw`s-\frac{v_1^2-v_0^2}{2a}`,`${q('s')}-\\frac{${energyDifference[1]}}{2\\cdot${q('a')}}`],
    a:[`\\frac{${energyDifference[0]}}{2${assumedOrigin?'s':`(${d[0]})`}}`,`\\frac{${energyDifference[1]}}{2\\cdot\\left(${d[1]}\\right)}`],
    v:[`${v.v<0?'-':''}\\sqrt{${assumedRest?'':'v_0^2+'}2a(${d[0]})}`,`${v.v<0?'-':''}\\sqrt{${assumedRest?'':`${square('v0')}+`}2\\cdot${q('a')}\\cdot\\left(${d[1]}\\right)}`],
    v0:[`${v.v0<0?'-':''}\\sqrt{v_1^2-2a(${d[0]})}`,`${v.v0<0?'-':''}\\sqrt{${square('v')}-2\\cdot${q('a')}\\cdot\\left(${d[1]}\\right)}`]
   };
   const templates={position,velocity,average,energy};
   const steps=[...(scenario.steps??[])].sort((a,b)=>(a.field==='v'?99:fields.findIndex(field=>field.id===a.field))-(b.field==='v'?99:fields.findIndex(field=>field.id===b.field)));
   for(const step of steps){
    const [formula,numeric]=templates[step.method][step.field]!;
    const field=fields.find(field=>field.id===step.field)!;
    equations.push(output(step.field,formula,numeric,field.name,symbol[step.field],unitGroups[field.kind].si));
   }
   equations.push(output('ds',d[0],d[1],text.displacement,String.raw`\Delta s`,'m'));
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
