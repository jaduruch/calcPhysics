import { test } from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import { electricalDefinitions } from '../src/lib/content/electricity.ts';
import { electricalPhysics, solveElectrical, inDomain, pwmVoltage, EPS0 } from '../src/lib/physics/electricity.ts';
import { electricalEquations, electricalQuantity } from '../src/lib/calculators/electrical-equations.ts';
import { electricalCurves, generatorVectors } from '../src/lib/visualization/electrical.ts';
import { topics, models } from '../src/lib/content/topics.ts';
import { parseQuantityInUnit } from '../src/lib/calculators/quantities.ts';
const near = (a,b) => assert.ok(Math.abs(a-b) <= 1e-12 * Math.max(1,Math.abs(b)), `${a} != ${b}`);
const solve = (id, input) => { const r = solveElectrical(id,input); assert.equal(r.status,'success',JSON.stringify(r)); return r.outputs; };
const typical = { R: 100, R1: 1000, R2: 2000, RL: 1000, U: 12, U1: 230, Uin: 12, Up: 10, I: .1, I2: 1, Ip: 2, N: 100, N1: 100, N2: 10, eta: .9, n: 10, C1: 1e-6, C2: 1e-6, C: 1e-6, L: .01, L1: .01, L2: .02, f: 1000, t: .001, phi: .3, a: 2, b: 3, c: 4, A: .001, l: .1, mu: 100, er: 2, d: .002, dt: .01, dPhi: .002, dI: .2, P: 3, Q: .001, E: 500, B: .2, v: 4 };
test('all nine subtopics have real models and valid formulas', () => {
  const children = topics.filter(t => t.parentId === 'electromagnetism');
  assert.equal(children.length,9);
  assert.ok(!children.some(topic => topic.id === 'transformers'));
  const transformerModel = models.find(model => model.id === 'transformer');
  assert.equal(transformerModel.topicId, 'inductors');
  assert.ok(transformerModel.notes.some(note => note.text.includes('core flux')));
  for(const topic of children) assert.ok(topic.published && models.some(m => m.topicId === topic.id));
  for(const d of electricalDefinitions) {
    let values=Object.fromEntries(d.inputs.map(field=>[field.id, typical[field.id]]));
    if(d.id==='pwm') values.d=.4;
    if(d.id==='voltage-divider') values={Uin:12,R1:1000,R2:1000};
    if(d.id==='loaded-divider') values={Uin:12,R1:1000,R2:1000,RL:1000};
    if(d.id==='ohms-law') values={U:12,R:100};
    if(d.id==='inductor') values={N:100,A:.001,l:.1,mu:100,I:.1};
    if(d.id==='transformer') values={U1:230,N1:100,N2:10,I2:1,eta:.9};
    if(d.id==='rc-series-ac' || d.id==='rc-parallel-ac') values={R:100,C:1e-6,f:1000,U:12};
    if(d.id==='rc-charge' || d.id==='rc-discharge') values={R:10,C:.1,U:10,t:.5};
    if(d.id==='capacitor') values={C:1e-6,U:10};
    if(d.id==='rl-series-ac' || d.id==='rl-parallel-ac') values={R:100,L:100/(2*Math.PI),f:1,U:10};
    if(d.id==='rl-charge' || d.id==='rl-discharge') values={R:10,L:10,U:10,t:.5};
    if(d.id.startsWith('rc-')&&d.id.endsWith('-pass')) values={R:1000,C:1e-6,f:1000,Uin:10};
    if(d.id.startsWith('rl-')&&d.id.endsWith('-pass')) values={R:100,L:.1,f:1000,Uin:10};
    if(d.id==='series-rlc' || d.id==='parallel-rlc') values={R:100,L:.01,C:1e-6,f:1000,U:10};
    if(d.id==='voltage-gain') values={U1:10,U2:20};
    if(['sine-rms','square-rms','triangle-rms'].includes(d.id)) values={Up:10};
    if(d.id==='sine-signal') values={Up:10,f:50,t:.001,phi:0};
    if(d.id==='pwm') values={Up:10,f:1000,d:.4};
    const r=solveElectrical(d.id,values);
    assert.equal(r.status,'success',d.id+JSON.stringify(r));
    assert.ok(Object.keys(r.outputs).every(key=>d.outputs.some(o=>o.id===key)),d.id);
    if(!r.steps)assert.deepEqual(Object.keys(r.outputs),d.outputs.map(o=>o.id),d.id);
    const before=JSON.stringify(r);
    for(const eq of electricalEquations(d,r,{})) {
      assert.doesNotThrow(()=>katex.renderToString(eq,{throwOnError:true,strict:'error'}), d.id+': '+eq);
      assert.ok(!eq.includes('undefined') && !eq.includes('NaN'),eq);
    }
    const cardId=d.id==='loaded-divider'?'voltage-divider':d.id==='resistance-parallel'?'resistance-series':d.id==='capacitance-parallel'?'capacitance-series':d.id==='inductance-parallel'?'inductance-series':d.id==='star-delta'?'delta-star':d.id==='sine-rms'?'sine-signal':d.id==='rc-parallel-ac'?'rc-series-ac':d.id==='rl-parallel-ac'?'rl-series-ac':d.id==='rc-discharge'?'rc-charge':d.id==='rl-discharge'?'rl-charge':['plate-capacitor','charge-flow','circular-plate'].includes(d.id)?'capacitor':d.id;
    const card=models.find(m=>m.id===cardId);
    assert.equal(Boolean(card),!['ac-power','power-gain'].includes(d.id),d.id);
    for(const eq of card?.formulas ?? []) assert.doesNotThrow(()=>katex.renderToString(eq.expression,{throwOnError:true}),d.id);
    for(const note of card?.notes ?? []) if(note.expression) assert.doesNotThrow(()=>katex.renderToString(note.expression,{throwOnError:true}),d.id);
    assert.equal(JSON.stringify(r),before);
  }
});
test('DC, loaded divider, component combinations and star-delta reference values',()=>{
  assert.deepEqual(solve('ohms-law',{U:12,R:100}),{I:.12,P:1.44});
  const loaded=solve('loaded-divider',{Uin:12,R1:1000,R2:1000,RL:1000}); near(loaded.Uout,4); near(loaded.I,.008);
  near(solve('capacitance-series',{C1:1e-6,C2:1e-6}).C,5e-7);
  near(solve('resistance-parallel',{R1:100,R2:100}).R,50);
  const star=solve('delta-star',{a:30,b:30,c:30}); assert.deepEqual(star,{R1:10,R2:10,R3:10});
  assert.deepEqual(solve('star-delta',{a:10,b:10,c:10}),{R1:30,R2:30,R3:30});
  const conversionCards=models.filter(model=>['delta-star','star-delta'].includes(model.id));
  assert.equal(conversionCards.length,1);assert.equal(conversionCards[0].title,'Delta–Star Resistance Conversion');
  assert.ok(conversionCards[0].formulas.some(formula=>formula.label==='delta → star'));
  assert.ok(conversionCards[0].formulas.some(formula=>formula.label==='star → delta'));
});
test('capacitor calculations combine charge, field, geometry and energy with the reference inputs',()=>{
  const cards=models.filter(model=>['capacitor','plate-capacitor','charge-flow','circular-plate'].includes(model.id));
  assert.equal(cards.length,1);assert.equal(cards[0].id,'capacitor');assert.equal(cards[0].title,'Capacitor Calculations');
  const fields=['I','F','E','er','A','d','s','C','U','W','Q','t'];
  assert.deepEqual(electricalDefinitions.find(d=>d.id==='capacitor').inputs.map(field=>field.id),fields);
  const electrical=solve('capacitor',{C:1e-6,U:10});near(electrical.Q,1e-5);near(electrical.W,5e-5);
  near(solve('capacitor',{Q:6,t:3}).I,2);
  near(solve('capacitor',{Q:2,E:4}).F,8);
  near(solve('capacitor',{E:5,s:.2}).U,1);
  near(solve('capacitor',{er:2,A:.01,s:.001}).C,EPS0*2*.01/.001);
  near(solve('capacitor',{d:.2}).A,Math.PI*.01);
});
test('RMS and PWM distinguish bipolar and unipolar signals',()=>{
  near(solve('sine-rms',{Up:Math.SQRT2}).Urms,1);
  near(solve('triangle-rms',{Up:Math.sqrt(3)}).Urms,1);
  near(solve('square-rms',{Up:2}).Urms,2);
  const pwm=solve('pwm',{Up:10,f:1000,d:.25}); near(pwm.Urms,5);near(pwm.ton,.00025);
  near(solve('pwm',{Up:10,f:1000,d:0}).Urms,0);
  near(solve('pwm',{Up:10,f:1000,d:1}).Urms,10);
});
test('AC waveform page exposes exactly sine, triangle, rectangle and PWM with generated diagrams',()=>{
  const ids=['sine-signal','triangle-rms','square-rms','pwm'];
  const cards=models.filter(model=>model.topicId==='alternating-current');
  assert.deepEqual(cards.map(card=>card.title),['Sine','Triangle','Rectangle','PWM']);
  assert.ok(!models.some(model=>model.id==='sine-rms'));
  const expectedFields={
    'sine-signal':['u','Up','Upp','Urms','f','t','T','phi'],
    'triangle-rms':['Up','Upp','Urms'],
    'square-rms':['Up','Upp','Urms'],
    pwm:['Up','Urms','f','ton','T','d']
  };
  for(const id of ids){
    const definition=electricalDefinitions.find(item=>item.id===id);
    assert.deepEqual(definition.inputs.map(field=>field.id),expectedFields[id]);
    assert.ok(electricalCurves(definition,{status:'incomplete',fields:[]}).every(curve=>curve.schematic));
  }
  const sine=electricalCurves(electricalDefinitions.find(item=>item.id==='sine-signal'),solveElectrical('sine-signal',{Up:10,f:50,t:.005,phi:0}));
  assert.equal(sine.length,1);near(sine[0].marker.time,.005);near(sine[0].marker.value,10);
  const pwm=electricalCurves(electricalDefinitions.find(item=>item.id==='pwm'),solveElectrical('pwm',{Up:10,f:1000,d:.25}));
  assert.ok(pwm[0].values.includes(10) && pwm[0].values.includes(0));
});
test('transients use correct initial values, discharge polarity and stable tiny times',()=>{
  const cards=models.filter(model=>['rc-charge','rc-discharge'].includes(model.id));
  assert.equal(cards.length,1);assert.equal(cards[0].id,'rc-charge');assert.equal(cards[0].title,'RC: Charging & Discharging');
  assert.ok(cards[0].formulas.some(formula=>formula.label==='charging'));
  assert.ok(cards[0].formulas.some(formula=>formula.label==='discharging'));
  assert.deepEqual(electricalDefinitions.find(d=>d.id==='rc-charge').inputs.map(field=>field.id),['I','it','tau','R','C','U','ut','t']);
  assert.deepEqual(electricalDefinitions.find(d=>d.id==='rc-discharge').inputs.map(field=>field.id),['I','it','tau','R','C','U','ut','t']);
  assert.deepEqual(solve('rc-charge',{R:10,C:.1,U:10,t:0}),{tau:1,I:1,ut:0,it:1});
  assert.deepEqual(solve('rc-discharge',{R:10,C:.1,U:10,t:0}),{tau:1,I:1,ut:10,it:-1});
  assert.deepEqual(solve('rl-charge',{R:10,L:10,U:10,t:0}),{tau:1,I:1,ut:10,it:0});
  assert.deepEqual(solve('rl-discharge',{R:10,L:10,U:10,t:0}),{tau:1,I:1,ut:-10,it:1});
  near(solve('rc-charge',{R:10,C:.1,U:10,t:1}).ut,10*(1-1/Math.E));
  assert.ok(solve('rc-charge',{R:1,C:1,U:1,t:1e-18}).ut>0);
  near(solve('rc-charge',{I:1,it:1/Math.E,t:1}).tau,1);
  near(solve('rc-discharge',{U:10,ut:10/Math.E,t:1}).tau,1);
  const definition=electricalDefinitions.find(d=>d.id==='rc-charge');
  const curves=electricalCurves(definition,solveElectrical('rc-charge',{R:10,C:.1,U:10,t:0}));
  assert.equal(curves.find(curve=>curve.yLabel==='i [A]').color,'current');
  assert.equal(curves.find(curve=>curve.yLabel==='u [V]').color,undefined);
  const currentOnly=electricalCurves(definition,solveElectrical('rc-charge',{I:2,it:2/Math.E,tau:3}));
  assert.equal(currentOnly.length,2);
  const currentCurve=currentOnly.find(curve=>curve.yLabel==='i [A]');
  const voltageCurve=currentOnly.find(curve=>curve.yLabel==='u [V]');
  assert.equal(currentCurve.schematic,false);assert.equal(voltageCurve.schematic,true);
  near(currentCurve.marker.time,3);near(currentCurve.marker.value,2/Math.E);
  assert.ok(currentCurve.times.length>2 && currentCurve.values.every(Number.isFinite));
  assert.ok(electricalCurves(definition,{status:'incomplete',fields:[]}).every(curve=>curve.schematic));
});
test('RL step response and discharging share one card with inverse transient fields',()=>{
  const cards=models.filter(model=>['rl-charge','rl-discharge'].includes(model.id));
  assert.equal(cards.length,1);assert.equal(cards[0].title,'RL: Step Response & Discharging');
  const fields=['I','it','tau','R','L','U','ut','t'];
  for(const id of ['rl-charge','rl-discharge'])assert.deepEqual(electricalDefinitions.find(d=>d.id===id).inputs.map(field=>field.id),fields);
  near(solve('rl-charge',{I:2,it:2*(1-1/Math.E),tau:3}).t,3);
  near(solve('rl-discharge',{I:2,it:2/Math.E,tau:3}).t,3);
});
test('capacitive and inductive phase/reactive power have opposite signs',()=>{
  for(const topology of ['series','parallel']) {
    const rc=solve(`rc-${topology}-ac`,{R:100,C:1/(200*Math.PI),f:1,U:10});
    const rl=solve(`rl-${topology}-ac`,{R:100,L:100/(2*Math.PI),f:1,U:10});
    near(rc.phi,-Math.PI/4);near(rl.phi,Math.PI/4);
    assert.ok(rc.Qc<0 && rl.Ql>0);near(rc.Z,rl.Z);
  }
});
test('series and parallel RL calculations share one card and switch partial quantities',()=>{
  const cards=models.filter(model=>['rl-series-ac','rl-parallel-ac'].includes(model.id));
  assert.equal(cards.length,1);assert.equal(cards[0].title,'RL at AC: Series & Parallel');
  const series=solve('rl-series-ac',{R:100,L:100/(2*Math.PI),f:1,U:10});
  const parallel=solve('rl-parallel-ac',{R:100,L:100/(2*Math.PI),f:1,U:10});
  near(series.Xl,100);near(series.phi,Math.PI/4);near(series.UR,10/Math.SQRT2);near(series.UL,10/Math.SQRT2);
  near(parallel.Xl,100);near(parallel.phi,Math.PI/4);near(parallel.IR,.1);near(parallel.IL,.1);
  assert.ok(series.Ql>0 && parallel.Ql>0);
});
test('series and parallel RC calculations share one card while retaining both physical models',()=>{
  const cards=models.filter(model=>['rc-series-ac','rc-parallel-ac'].includes(model.id));
  assert.equal(cards.length,1);
  assert.equal(cards[0].id,'rc-series-ac');
  assert.equal(cards[0].title,'RC at AC: Series & Parallel');
  assert.ok(cards[0].formulas.some(formula=>formula.label.startsWith('series ')));
  assert.ok(cards[0].formulas.some(formula=>formula.label.startsWith('parallel ')));
  const fields=['phi','I','R','Xc','Z','C','P','Qc','S','UR','UC','U','f','cosPhi','sinPhi'];
  assert.deepEqual(electricalDefinitions.find(d=>d.id==='rc-series-ac').inputs.map(field=>field.id),fields);
  assert.deepEqual(electricalDefinitions.find(d=>d.id==='rc-parallel-ac').inputs.map(field=>field.id),fields.map(id=>id==='UR'?'IR':id==='UC'?'IC':id));
  const values={R:100,C:1/(200*Math.PI),f:1,U:10};
  const series=solve('rc-series-ac',values);
  const parallel=solve('rc-parallel-ac',values);
  near(series.Xc,100);near(series.Z,100*Math.SQRT2);near(series.I,1/Math.SQRT2/10);
  near(parallel.Xc,100);near(parallel.Z,100/Math.SQRT2);near(parallel.I,Math.SQRT2/10);
  near(series.phi,-Math.PI/4);near(parallel.phi,-Math.PI/4);
  near(series.UR,10/Math.SQRT2);near(series.UC,10/Math.SQRT2);
  near(parallel.IR,.1);near(parallel.IC,.1);
  near(series.cosPhi,1/Math.SQRT2);near(series.sinPhi,-1/Math.SQRT2);
  near(series.S,10*series.I);near(series.Qc,-series.P);
  const power=solve('rc-series-ac',{P:.5,Qc:-.5});
  near(power.S,1/Math.SQRT2);near(power.phi,-Math.PI/4);
  assert.equal(solveElectrical('rc-series-ac',{Qc:1}).status,'invalid');
  assert.equal(solveElectrical('rc-parallel-ac',{sinPhi:.2}).status,'invalid');
  assert.deepEqual(values,{R:100,C:1/(200*Math.PI),f:1,U:10});
});
test('all four filters are −3.0103 dB and ±45 degrees at cutoff',()=>{
  const fields={
    'rc-high-pass':['phi','R','Xc','attenuation','C','Uin','Uc','Uout','fc','f'],
    'rc-low-pass':['phi','R','Xc','attenuation','C','Uin','Uout','fc','f'],
    'rl-high-pass':['phi','R','Xl','attenuation','L','Uin','Uout','fc','f'],
    'rl-low-pass':['phi','R','Xl','attenuation','L','Uin','Uout','fc','f']
  };
  for(const kind of ['rc','rl'])for(const pass of ['high','low']) {
    const id=`${kind}-${pass}-pass`;
    assert.deepEqual(electricalDefinitions.find(definition=>definition.id===id).inputs.map(field=>field.id),fields[id]);
    const values=kind==='rc'?{R:1000,C:1e-6,f:1/(2*Math.PI*.001),Uin:10}:{R:100,L:.1,f:100/(2*Math.PI*.1),Uin:10};
    const r=solve(id,values);near(r.gain,1/Math.SQRT2);near(r.phi,(pass==='high'?1:-1)*Math.PI/4);near(r.attenuation,10*Math.log10(2));
    near(solve(id,{fc:r.fc,f:r.fc,Uin:10}).Uout,10/Math.SQRT2);
  }
});
test('gain and attenuation use one card with all reference input quantities',()=>{
  const cards=models.filter(model=>model.topicId==='gain-and-attenuation');
  assert.equal(cards.length,1);
  const definition=electricalDefinitions.find(model=>model.id==='voltage-gain');
  assert.deepEqual(definition.inputs.map(field=>field.id),['I1','I2','g','a','P1','P2','U1','U2','V','D']);
  const result=solve('voltage-gain',{U1:10,U2:20});
  near(result.V,2);near(result.D,.5);near(result.g,20*Math.log10(2));near(result.a,-20*Math.log10(2));
});
test('RLC resonance, transformer power balance and three-phase identities',()=>{
  const values={R:100,L:.01,C:1e-6,f:1/(2*Math.PI*Math.sqrt(1e-8)),U:10};
  for(const id of ['series-rlc','parallel-rlc'])near(solve(id,values).Z,100);
  const transformer=solve('transformer',{U1:230,N1:100,N2:10,I2:2,eta:.9});near(transformer.U2,23);near(transformer.P2,46);near(transformer.P1*.9,46);
  near(solve('star-system',{Up:230,Ip:2,phi:0}).UL,230*Math.sqrt(3));
  near(solve('delta-system',{Up:230,Ip:2,phi:0}).IL,2*Math.sqrt(3));
  for(const t of [0,.001,.003]) {const r=solve('three-phase-generator',{Up:325,f:50,t});near(r.u1+r.u2+r.u3,0);}
});
test('domain, missing inputs, non-finite values and overflow never yield valid results',()=>{
  for(const [id,model] of Object.entries(electricalPhysics).filter(([id])=>!['ohms-law','transformer','voltage-divider','loaded-divider','inductor','capacitor','sine-rms','square-rms','triangle-rms','sine-signal','pwm','rc-series-ac','rc-parallel-ac','rl-series-ac','rl-parallel-ac','rc-charge','rc-discharge','rl-charge','rl-discharge','rc-high-pass','rc-low-pass','rl-high-pass','rl-low-pass','series-rlc','parallel-rlc','voltage-gain'].includes(id))) {
    const given=Object.fromEntries(Object.keys(model.inputs).map(k=>[k,typical[k]]));if(id==='pwm')given.d=.4;
    for(const [key,domain] of Object.entries(model.inputs)) {
      assert.equal(solveElectrical(id,{...given,[key]:Infinity}).status,'invalid',id);
      const missing={...given};delete missing[key]; assert.equal(solveElectrical(id,missing).status,'incomplete',id);
      if(!inDomain(-1,domain))assert.equal(solveElectrical(id,{...given,[key]:-1}).status,'invalid',id);
    }
  }
  assert.equal(solveElectrical('ohms-law',{U:1e308,R:1e-308}).status,'out-of-range');
  assert.equal(solveElectrical('transformer',{U1:230,N1:1,N2:1,I2:1,eta:1.01}).status,'invalid');
  assert.equal(solveElectrical('pwm',{Up:10,f:1,d:1.01}).status,'invalid');
});
test('unit conversions and every curve use unrounded SI results; invalid state loses numerical scales',()=>{
  near(parseQuantityInUnit('40','ratio','%').value,.4);
  near(parseQuantityInUnit('100','area','cm²').value,.01);
  assert.doesNotThrow(()=>katex.renderToString(electricalQuantity(40,'%',false),{throwOnError:true}));
  for(const d of electricalDefinitions.filter(d=>d.chart && d.chart!=='pwm')) {
    const given=['rc-charge','rc-discharge'].includes(d.id) ? {R:10,C:.1,U:10,t:.5} : ['rl-charge','rl-discharge'].includes(d.id) ? {R:10,L:10,U:10,t:.5} : d.id.startsWith('rc-')&&d.id.endsWith('-pass')?{R:1000,C:1e-6,f:1000,Uin:10}:d.id.startsWith('rl-')&&d.id.endsWith('-pass')?{R:100,L:.1,f:1000,Uin:10}:['triangle-rms','square-rms'].includes(d.id)?{Up:10}:d.id==='sine-signal'?{Up:10,f:50,t:.001,phi:0}:Object.fromEntries(d.inputs.map(f=>[f.id,typical[f.id]]));
    const r=solveElectrical(d.id,given);const curves=electricalCurves(d,r);
    assert.ok(curves.length>0,d.id);assert.ok(curves.every(c=>!c.schematic && c.values.every(Number.isFinite)));
    assert.ok(electricalCurves(d,{status:'invalid',fields:[]}).every(c=>c.schematic));
    for(const c of curves) {
      if(['triangle-rms','square-rms'].includes(d.id))continue;
      const field=d.outputs.find(o=>o.name===c.title).id;
      for(const i of [0,120,240])near(c.values[i],solve(d.id,{...given,[d.chart==='filter'?'f':'t']:c.times[i]})[field]);
    }
  }
});

test('electrical formulas use engineering prefixes and three significant figures without rounding solver values',()=>{
  assert.equal(electricalQuantity(12345.678,'Ω'),String.raw`12.3\,\mathrm{k\Omega}`);
  assert.equal(electricalQuantity(4.56789e-6,'F'),String.raw`4.57\,\mathrm{\mu F}`);
  const definition=electricalDefinitions.find(d=>d.id==='ohms-law');
  const result=solveElectrical('ohms-law',{U:12.3456,R:12345.678});
  assert.equal(result.status,'success');
  near(result.outputs.I,12.3456/12345.678);
  const currentEquation=electricalEquations(definition,result,{}).find(equation=>equation.startsWith('I ='));
  assert.ok(currentEquation.includes(String.raw`12.3\,\mathrm{V}`),currentEquation);
  assert.ok(currentEquation.includes(String.raw`12.3\,\mathrm{k\Omega}`),currentEquation);
  assert.ok(currentEquation.includes(String.raw`1.00\,\mathrm{mA}`),currentEquation);
  assert.ok(!currentEquation.includes(String.raw`\left(12.3\,\mathrm{V}\right)`),currentEquation);
  const powerEquation=electricalEquations(definition,solveElectrical('ohms-law',{U:12,R:3000}),{}).find(equation=>equation.startsWith('P ='));
  assert.ok(powerEquation.includes(String.raw`12.0\,\mathrm{V} \cdot 4.00\,\mathrm{mA}`),powerEquation);
  const acPower=electricalDefinitions.find(d=>d.id==='ac-power');
  const signedEquation=electricalEquations(acPower,solveElectrical('ac-power',{U:230,I:2,phi:-.5}),{}).find(equation=>equation.startsWith('P ='));
  assert.ok(signedEquation.includes(String.raw`\cos\left(-0.500\,\mathrm{rad}\right)`),signedEquation);
});

test('PWM curves use the physical pulse function and generator vectors have equal scales',()=>{
  assert.equal(pwmVoltage(10,1000,0,0),0);
  assert.equal(pwmVoltage(10,1000,1,.0009),10);
  assert.equal(pwmVoltage(10,1000,.4,.0002),10);
  assert.equal(pwmVoltage(10,1000,.4,.0006),0);
  const d=electricalDefinitions.find(d=>d.id==='pwm');
  const r=solveElectrical('pwm',{Up:10,f:1000,d:.4});
  for(const c of electricalCurves(d,r)) for(let i=0;i<c.times.length;i++)assert.equal(c.values[i],pwmVoltage(10,1000,.4,c.times[i]));
  for(const t of [0,.001,.003]) {
    const r=solveElectrical('three-phase-generator',{Up:325,f:50,t});
    const diagram=generatorVectors(r);assert.equal(diagram.schematic,false);
    diagram.vectors.forEach((v,i)=>{near(Math.hypot(v.x,v.y),1);near(-v.y*325,r.outputs['u'+(i+1)]);});
  }
});
