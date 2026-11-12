export interface ModelDefinition {
  id: string;
  topicId: string;
  variants?: readonly { model: ModelDefinition; label: string }[];
  title: string;
  calculator: 'kinematics' | 'resource' | 'total-reflection' | 'doppler' | 'qubit' | 'ideal-gas' | 'uniform-motion' | 'inclined-plane' | 'electrical';
  variables: readonly { name: string; symbol: string; subscript?: string; unit: string; unitName: string }[];
  formulas: readonly { label: string; expression: string }[];
  references?: readonly { title: string; url: string }[];
  notes?: readonly { text: string; expression?: string }[];
}
