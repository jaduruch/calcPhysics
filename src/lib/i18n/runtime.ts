import { page } from '$app/state';
import * as en from './en.ts';
import * as de from './de.ts';
import { localeFromPath, languagePath } from './locale.ts';
import {translateText} from './translate.ts';
export function isGerman(): boolean { return localeFromPath(page.url.pathname) === 'de'; }
export function localPath(path: string): string { return languagePath(path, localeFromPath(page.url.pathname)); }
export function text(value: string): string { return translateText(value,isGerman()?'de':'en'); }
function dictionary<T extends Record<string, string>>(english: T, german: Partial<Record<keyof T, string>>): { [K in keyof T]: string } {
  return new Proxy(english, { get(target, key: string) { return isGerman() ? german[key] ?? target[key] : target[key]; } });
}
export const ui = dictionary(en.ui, de.ui);
export const calculatorUi = dictionary(en.calculatorUi, de.calculatorUi);
export const chartUi = dictionary(en.chartUi, de.chartUi);
export const inclinedPlaneUi = dictionary(en.inclinedPlaneUi, de.inclinedPlaneUi);
export const idealGasUi = dictionary(en.idealGasUi, de.idealGasUi);
export const resourceUi = dictionary(en.resourceUi, de.resourceUi);
export const kinematicsUi = dictionary(en.kinematicsUi, de.kinematicsUi);
export const electricalUi = dictionary(en.electricalUi, de.electricalUi);
export const qubitUi = dictionary(en.qubitUi, de.qubitUi);
export const dopplerUi = dictionary(en.dopplerUi, de.dopplerUi);
export const reflectionUi = dictionary(en.reflectionUi, de.reflectionUi);
export const opticsDiagramUi = dictionary(en.opticsDiagramUi, de.opticsDiagramUi);
export const pulleyUi = dictionary(en.pulleyUi, de.pulleyUi);
export const keplerUi=dictionary(en.keplerUi,de.keplerUi);

export const searchUi = dictionary(en.searchUi, de.searchUi);

export const obliqueUi = dictionary(en.obliqueUi, de.obliqueUi);
