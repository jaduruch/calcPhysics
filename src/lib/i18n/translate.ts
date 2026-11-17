import {germanText} from './text-de.ts';
import type {Locale} from './locale.ts';
/** Only known component-list labels are composed; arbitrary prose is never machine-translated. */
export function germanTranslation(value:string):string|undefined {
 const exact=germanText[value]??germanText[value.toLowerCase()];
 if(exact!==undefined)return exact;
 const numbered=/^(resistance|capacitance|inductance) ([1-9]\d*)$/.exec(value);
 if(numbered){const name=germanText[numbered[1]];if(name)return `${name} ${numbered[2]}`;}
 return undefined;
}
export function translateText(value:string,locale:Locale):string {
 return locale==='de'?germanTranslation(value)??value:value;
}
