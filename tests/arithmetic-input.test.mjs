import test from 'node:test';
import assert from 'node:assert/strict';
import {parseQuantity,parseQuantityInUnit,changeQuantityUnit,prefixes} from '../src/lib/calculators/quantities.ts';
const value=raw=>{const p=parseQuantity(raw);assert.equal(p.status,'valid',raw);return p.value;};
const near=(a,b)=>assert.ok(Math.abs(a-b)<=1e-14*Math.max(Math.abs(b),Number.MIN_VALUE),`${a} != ${b}`);
test('arithmetic operators, brackets, precedence, right associative powers and signs',()=>{
 for(const [raw,expected] of [['1 + 3',4],['2+3*4',14],['(2+3)*4',20],['8/2/2',2],['8-3-2',3],['2^3^2',512],['-2^2',-4],['(-2)^2',4],['2^-2',.25],['2^-3^2',1/512],['--2',2],['1+-3',-2],['3*(1,5 + .5)',6],['1e-3 + 2E+2',200.001],['(3)',3],['0*(1+2)',0],['(-8)^(1/3)',NaN]]){
 if(Number.isNaN(expected))assert.equal(parseQuantity(raw).status,'invalid');else near(value(raw),expected);
 }
});
test('prefixes stay attached to literals, preserving case, whitespace and micro aliases',()=>{
 for(const prefix of prefixes)near(value(`2${prefix.symbol} + 3${prefix.symbol}`),5*prefix.factor);
 near(value('1k + 1m'),1000.001);near(value('1k + 0.1m'),1000.0001);near(value('(1 k + 2m)/2'),500.001);near(value('2M / 1k'),2000);near(value('1µ + 1μ + 1u'),3e-6);near(value('2k^2'),4e6);
 assert.equal(parseQuantity('1+3','k').value,4000);
 assert.equal(parseQuantity('1k+3').prefix,'');assert.equal(parseQuantity('1k+3').number,'1003');
});
test('legacy numeric metadata remains identical and raw expression is retained',()=>{
 assert.deepEqual(parseQuantity(' 1,5 k '),{status:'valid',value:1500,number:'1.5',prefix:'k'});
 const raw=' (1k + 2m) / 2 ';assert.equal(parseQuantity(raw).expression,raw);assert.equal(parseQuantity('  ').status,'empty');
});
test('selected unit is applied once after scalar arithmetic, including offset units',()=>{
 near(parseQuantityInUnit('18+18','velocity','km/h').value,10);near(parseQuantityInUnit('(1+2)/2','time','h').value,5400);near(parseQuantityInUnit('90+90','angle','°').value,Math.PI);near(parseQuantityInUnit('20+5','temperature','°C').value,298.15);
 for(const unit of ['°C','°F','°Ré'])assert.equal(parseQuantityInUnit('1k-1k+25','temperature',unit).status,'invalid');
 assert.equal(parseQuantityInUnit('1m+1m','powerLevel','dBm').status,'invalid');
 near(parseQuantityInUnit('1k+1m','length','m').value,1000.001);
 assert.equal(changeQuantityUnit('18+18','velocity','km/h','m/s'),'10');
});
test('malformed, unsupported and executable syntax never evaluates',()=>{
 for(const raw of ['1+','(1+2','1+2)','()','1//2','2**3','2(3)','(2+3)k','1 2','1,234.5','2K','2mm','1e','1e-','NaN','Infinity','Math.PI','sqrt(4)','alert(1)','globalThis.x=1','1;2','1/*x*/+2','<script>','2%1','[1+2]'])assert.equal(parseQuantity(raw).status,'invalid',raw);
});
test('singular, nonreal, overflow, underflow and excessive expressions are invalid',()=>{
 for(const raw of ['1/0','0/0','0^0','0^-1','(-1)^.5','1e308*2','2^1024','1e-300*1e-100','1e-300/1e100','1e-200^2','1e-999+1','1e999-1e999','('.repeat(200)+'1'+')'.repeat(200),'1+'.repeat(1000)+'1',' '.repeat(4097)+'1+2'])assert.equal(parseQuantity(raw).status,'invalid',raw.slice(0,50));
});
