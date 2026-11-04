import type { ModelDefinition } from './model-types.ts';
import { dopplerUi } from '../i18n/en.ts';
export const dopplerModel: ModelDefinition = {
  id: 'acoustic-doppler', topicId: 'doppler-effect', calculator: 'doppler', title: 'Acoustic Doppler Effect',
  variables: [
    { name: 'emitted frequency', symbol: 'f', subscript: 's', unit: 'Hz', unitName: 'hertz' },
    { name: 'observed frequency', symbol: 'f', subscript: 'o', unit: 'Hz', unitName: 'hertz' },
    { name: 'source velocity toward observer', symbol: 'v', subscript: 's', unit: 'm/s', unitName: 'meters per second' },
    { name: 'observer velocity toward source', symbol: 'v', subscript: 'o', unit: 'm/s', unitName: 'meters per second' },
    { name: 'sound speed in the medium', symbol: 'c', unit: 'm/s', unitName: 'meters per second' },
    { name: 'wavelength toward observer', symbol: 'λ', unit: 'm', unitName: 'meter' }
  ],
  formulas: [
    { label: 'Observed frequency', expression: String.raw`f_o=f_s\cdot\frac{c+v_o}{c-v_s}` },
    { label: 'Source period', expression: String.raw`T_s=\frac{1}{f_s}` },
    { label: 'Wavefront spacing', expression: String.raw`\lambda=(c-v_s)T_s=\frac{c-v_s}{f_s}` },
    { label: 'Encounter rate', expression: String.raw`f_o=\frac{c+v_o}{\lambda}` },
    { label: 'Frequency shift', expression: String.raw`\Delta f=f_o-f_s` }
  ],
  notes: [
    { text: 'Requires algebra and the relation between frequency, period and wavelength. Successive wavefronts are emitted one source period apart. During that period the wave travels cTₛ and the source advances vₛTₛ, so the wavefront spacing toward the observer is (c − vₛ)Tₛ. The observer encounters those fronts at relative speed c + vₒ.' },
    { text: dopplerUi.signConvention },
    { text: dopplerUi.assumptions },
    { text: 'The sound speed is a medium parameter, not a missing target quantity. The default 343 m/s is an approximate value for air near 20 °C; enter the appropriate value for your medium. This model supports inverse solutions for either frequency or either velocity. Three of those four inputs are required, including explicit zeroes for stationary objects.' }
  ],
  references: [{ title: 'OpenStax — University Physics 1, The Doppler Effect', url: 'https://openstax.org/books/university-physics-volume-1/pages/17-7-the-doppler-effect' }]
};
