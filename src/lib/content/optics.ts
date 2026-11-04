import type { ModelDefinition } from './model-types.ts';
import { reflectionUi } from '../i18n/en.ts';
export const totalReflectionModel: ModelDefinition = {
  id: 'total-internal-reflection', topicId: 'total-internal-reflection', calculator: 'total-reflection', title: 'Total Internal Reflection',
  variables: [
    { name: 'refractive index of incident medium', symbol: 'n', subscript: '1', unit: '1', unitName: 'dimensionless' },
    { name: 'refractive index of second medium', symbol: 'n', subscript: '2', unit: '1', unitName: 'dimensionless' },
    { name: 'angle of incidence', symbol: 'θ', subscript: '1', unit: 'rad', unitName: 'radian' },
    { name: 'angle of refraction', symbol: 'θ', subscript: '2', unit: 'rad', unitName: 'radian' },
    { name: 'critical angle', symbol: 'θ', subscript: 'c', unit: 'rad', unitName: 'radian' }
  ],
  formulas: [
    { label: 'Snell’s law', expression: String.raw`n_1\sin\theta_1=n_2\sin\theta_2` },
    { label: 'Critical angle (n₁ > n₂)', expression: String.raw`\theta_c=\arcsin\!\left(\frac{n_2}{n_1}\right)` },
    { label: 'Total internal reflection', expression: String.raw`n_1>n_2,\quad \theta_1>\theta_c` },
    { label: 'Reflection', expression: String.raw`\theta_r=\theta_1` },
    { label: 'Refraction (when allowed)', expression: String.raw`\theta_2=\arcsin\!\left(\frac{n_1}{n_2}\sin\theta_1\right)` }
  ],
  notes: [
    { text: 'Requires trigonometry and inverse sine. As the incidence angle increases from a higher-index medium into a lower-index medium, the refracted ray bends farther from the normal. At the critical angle its limiting angle is π/2; substituting sin(π/2) = 1 into Snell’s law gives sin θc = n₂/n₁.' },
    { text: 'Above the critical angle there is no real propagating refraction angle. For n₁ ≤ n₂, total internal reflection cannot occur in this direction. At equal indices the interface does not bend or reflect the ray in this ideal model.' },
    { text: reflectionUi.convention },
    { text: reflectionUi.assumptions }
  ],
  references: [{ title: 'OpenStax — University Physics 3, Total Internal Reflection', url: 'https://openstax.org/books/university-physics-volume-3/pages/1-4-total-internal-reflection' }]
};
