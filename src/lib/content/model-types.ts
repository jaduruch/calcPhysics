export interface ModelDefinition {
  id: string;
  topicId: string;
  title: string;
  calculator: 'uniform-motion' | 'inclined-plane' | 'electrical';
  variables: readonly { name: string; symbol: string; subscript?: string; unit: string; unitName: string }[];
  formulas: readonly { label: string; expression: string }[];
  references?: readonly { title: string; url: string }[];
  notes?: readonly { text: string; expression?: string }[];
}
