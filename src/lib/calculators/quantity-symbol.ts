/** Normalize existing display notation to inline TeX without changing field IDs or solver symbols. */
const subscripts: Record<string,string> = {
 '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9',
 '₊':'+','₋':'-','₌':'=','₍':'(','₎':')','ₐ':'a','ₑ':'e','ₕ':'h','ᵢ':'i','ⱼ':'j',
 'ₖ':'k','ₗ':'l','ₘ':'m','ₙ':'n','ₒ':'o','ₚ':'p','ᵣ':'r','ₛ':'s','ₜ':'t','ᵤ':'u','ᵥ':'v','ₓ':'x',
 'ᵦ':'β','ᵧ':'y','ᵨ':'ρ','ᵩ':'φ','ᵪ':'χ','ᵍ':'G'
};
const subscriptPattern = new RegExp(`[${Object.keys(subscripts).join('')}]+`,'gu');
export function quantitySymbolLatex(symbol:string,subscript?:string):string {
 const complete=symbol+(subscript?`_{${subscript}}`:'');
 return complete.replace(subscriptPattern,run=>`_{${[...run].map(character=>subscripts[character]).join('')}}`)
  .replace(/_([\p{L}\p{N}]+)/gu,'_{$1}')
  .replace(/([\p{L}])\u0307/gu,String.raw`\dot{$1}`)
  .replaceAll('⊥',String.raw`\perp `).replaceAll('∥',String.raw`\parallel `);
}
