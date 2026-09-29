// Model architecture data for the interpretability lab
export interface ModelInfo {
  id: string;
  name: string;
  family: string;
  params: string;
  layers: number;
  heads: number;
  dModel: number;
  dHead: number;
  dMlp: number;
  vocabSize: number;
  contextLen: number;
  architecture: string;
  year: number;
  organization: string;
  description: string;
  status: 'available' | 'demo' | 'coming-soon';
}

export const models: ModelInfo[] = [
  {
    id: 'gpt2-small',
    name: 'GPT-2 Small',
    family: 'GPT-2',
    params: '124M',
    layers: 12,
    heads: 12,
    dModel: 768,
    dHead: 64,
    dMlp: 3072,
    vocabSize: 50257,
    contextLen: 1024,
    architecture: 'Decoder-only Transformer',
    year: 2019,
    organization: 'OpenAI',
    description: 'The canonical baseline for mechanistic interpretability. 12 layers, 12 attention heads per layer. Well-studied with extensive prior work including IOI circuit, docstring circuit, and greater-than circuit.',
    status: 'available',
  },
  {
    id: 'pythia-70m',
    name: 'Pythia-70M',
    family: 'Pythia',
    params: '70M',
    layers: 6,
    heads: 8,
    dModel: 512,
    dHead: 64,
    dMlp: 2048,
    vocabSize: 50304,
    contextLen: 2048,
    architecture: 'Decoder-only Transformer (GPT-NeoX)',
    year: 2023,
    organization: 'EleutherAI',
    description: 'Part of the Pythia suite designed for reproducibility research. Trained on The Pile with checkpoints saved at multiple scales. Ideal for studying developmental interpretability across training.',
    status: 'available',
  },
  {
    id: 'othello-gpt',
    name: 'Othello-GPT',
    family: 'Othello',
    params: '10M',
    layers: 6,
    heads: 8,
    dModel: 256,
    dHead: 32,
    dMlp: 512,
    vocabSize: 61,
    contextLen: 60,
    architecture: 'Decoder-only Transformer',
    year: 2023,
    organization: 'DeepMind',
    description: 'A small transformer trained to play Othello. Known for developing linear representations of the board state. Key model for studying learned world models and non-linear probes.',
    status: 'available',
  },
  {
    id: 'gemma-2b',
    name: 'Gemma-2B',
    family: 'Gemma',
    params: '2B',
    layers: 18,
    heads: 8,
    dModel: 2048,
    dHead: 256,
    dMlp: 16384,
    vocabSize: 256000,
    contextLen: 8192,
    architecture: 'Decoder-only Transformer (GQA)',
    year: 2024,
    organization: 'Google',
    description: 'Google\'s lightweight open model with modern architecture features including Grouped Query Attention, RoPE, and GeGLU activations. Represents next-gen model interpretability targets.',
    status: 'demo',
  },
  {
    id: 'llama-3.2-1b',
    name: 'Llama-3.2-1B',
    family: 'Llama',
    params: '1B',
    layers: 16,
    heads: 32,
    dModel: 2048,
    dHead: 64,
    dMlp: 8192,
    vocabSize: 128256,
    contextLen: 131072,
    architecture: 'Decoder-only Transformer (GQA)',
    year: 2024,
    organization: 'Meta',
    description: 'Meta\'s compact model with Grouped Query Attention and RoPE. Important target for scaling interpretability insights from small to medium-scale models.',
    status: 'demo',
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3-mini',
    family: 'Phi',
    params: '3.8B',
    layers: 32,
    heads: 32,
    dModel: 3072,
    dHead: 96,
    dMlp: 8192,
    vocabSize: 32064,
    contextLen: 4096,
    architecture: 'Decoder-only Transformer (GQA)',
    year: 2024,
    organization: 'Microsoft',
    description: 'Demonstrates that small, high-quality datasets can produce capable models. Interesting target for studying how data quality shapes internal representations.',
    status: 'coming-soon',
  },
  {
    id: 'qwen-2.5-1.5b',
    name: 'Qwen-2.5-1.5B',
    family: 'Qwen',
    params: '1.5B',
    layers: 28,
    heads: 16,
    dModel: 1536,
    dHead: 96,
    dMlp: 8960,
    vocabSize: 152064,
    contextLen: 32768,
    architecture: 'Decoder-only Transformer (GQA)',
    year: 2024,
    organization: 'Alibaba',
    description: 'Alibaba\'s efficient multilingual model. Features grouped query attention and SwiGLU activations. Useful for cross-lingual interpretability studies.',
    status: 'demo',
  },
  {
    id: 'mistral-7b',
    name: 'Mistral-7B',
    family: 'Mistral',
    params: '7B',
    layers: 32,
    heads: 32,
    dModel: 4096,
    dHead: 128,
    dMlp: 14336,
    vocabSize: 32000,
    contextLen: 32768,
    architecture: 'Decoder-only Transformer (GQA + Sliding Window)',
    year: 2023,
    organization: 'Mistral AI',
    description: 'Pioneering efficient architecture with sliding window attention and GQA. Important for understanding how architectural innovations affect internal representations.',
    status: 'coming-soon',
  },
];

// Sample tokens for demonstrations
export const samplePrompts = [
  {
    id: 'ioi',
    name: 'IOI (Indirect Object Identification)',
    text: 'When John and Mary went to the store, John gave a bottle of wine to',
    expectedCompletion: ' Mary',
    circuit: 'IOI Circuit',
  },
  {
    id: 'docstring',
    name: 'Docstring Pattern',
    text: 'def foobarbaz(foobar):\n    """This function does',
    expectedCompletion: ' foobarbaz',
    circuit: 'Docstring Circuit',
  },
  {
    id: 'greater-than',
    name: 'Greater-Than',
    text: 'The war lasted from the year 1703 to the year 17',
    expectedCompletion: '07',
    circuit: 'Greater-Than Circuit',
  },
  {
    id: 'custom',
    name: 'Custom Prompt',
    text: 'The quick brown fox jumps over the lazy',
    expectedCompletion: ' dog',
    circuit: 'Custom',
  },
];

// Deterministic pseudo-random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Generate synthetic attention patterns
export function generateAttentionPattern(
  seqLen: number,
  layer: number,
  head: number,
  pattern: 'diagonal' | 'uniform' | 'first-token' | 'previous' | 'inductive' | 'duplicate' | 'random' = 'random'
): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < seqLen; i++) {
    const row: number[] = [];
    let sum = 0;
    for (let j = 0; j < seqLen; j++) {
      const r = seededRandom(layer * 1000 + head * 100 + i * 10 + j);
      let val: number;
      switch (pattern) {
        case 'diagonal':
          val = j === i ? 0.7 : r * 0.1;
          break;
        case 'uniform':
          val = 1 / seqLen + (r - 0.5) * 0.05;
          break;
        case 'first-token':
          val = j === 0 ? 0.6 + r * 0.2 : r * 0.08;
          break;
        case 'previous':
          val = j === i - 1 ? 0.5 + r * 0.2 : r * 0.08;
          break;
        case 'inductive':
          if (j === i - 1) val = 0.35 + r * 0.15;
          else if (j === 0) val = 0.2 + r * 0.1;
          else val = r * 0.06;
          break;
        case 'duplicate':
          if (j <= i && i > seqLen / 2 && j === i - Math.floor(seqLen / 2)) val = 0.4 + r * 0.2;
          else val = r * 0.06;
          break;
        default:
          val = r;
      }
      val = Math.max(0, val);
      row.push(val);
      sum += val;
    }
    // Normalize row
    matrix.push(row.map(v => v / sum));
  }
  return matrix;
}

// Generate synthetic activation values
export function generateActivations(
  layers: number,
  positions: number,
  dModel: number = 768
): number[][] {
  const activations: number[][] = [];
  for (let l = 0; l < layers; l++) {
    const layerActs: number[] = [];
    for (let p = 0; p < positions; p++) {
      // Create interesting patterns
      const base = Math.sin((l / layers) * Math.PI * 2 + (p / positions) * Math.PI) * 0.5;
      const noise = (seededRandom(l * 100 + p) - 0.5) * 0.3;
      layerActs.push(Math.max(0, Math.min(1, base + noise + 0.5)));
    }
    activations.push(layerActs);
  }
  return activations;
}

// Generate SAE features
export interface SAEFeature {
  id: number;
  name: string;
  category: string;
  frequency: number;
  maxActivation: number;
  topTokens: { token: string; weight: number }[];
  description: string;
  layer: number;
}

export const saeFeatures: SAEFeature[] = [
  {
    id: 0,
    name: 'is_code',
    category: 'Domain',
    frequency: 0.12,
    maxActivation: 8.4,
    topTokens: [
      { token: 'def', weight: 0.92 }, { token: 'import', weight: 0.88 },
      { token: 'class', weight: 0.85 }, { token: 'return', weight: 0.82 },
      { token: 'function', weight: 0.79 }, { token: 'const', weight: 0.76 },
    ],
    description: 'Activates strongly on programming code tokens. Detects Python, JavaScript, and other programming language syntax.',
    layer: 7,
  },
  {
    id: 1,
    name: 'is_whitespace',
    category: 'Formatting',
    frequency: 0.35,
    maxActivation: 5.2,
    topTokens: [
      { token: '\\n', weight: 0.95 }, { token: '    ', weight: 0.89 },
      { token: '\\t', weight: 0.84 }, { token: '  ', weight: 0.78 },
    ],
    description: 'Detects whitespace and indentation patterns. Strongest on newlines and tab characters.',
    layer: 3,
  },
  {
    id: 2,
    name: 'is_number',
    category: 'Token Type',
    frequency: 0.08,
    maxActivation: 7.1,
    topTokens: [
      { token: '0', weight: 0.91 }, { token: '1', weight: 0.87 },
      { token: '42', weight: 0.83 }, { token: '100', weight: 0.79 },
      { token: '3.14', weight: 0.75 },
    ],
    description: 'Activates on numeric tokens regardless of context. Encodes the concept of "this is a number".',
    layer: 5,
  },
  {
    id: 3,
    name: 'sentiment_positive',
    category: 'Semantics',
    frequency: 0.15,
    maxActivation: 6.8,
    topTokens: [
      { token: 'excellent', weight: 0.94 }, { token: 'wonderful', weight: 0.91 },
      { token: 'great', weight: 0.87 }, { token: 'beautiful', weight: 0.84 },
      { token: 'amazing', weight: 0.81 },
    ],
    description: 'Encodes positive sentiment. Activates on words expressing approval, praise, or positive emotions.',
    layer: 9,
  },
  {
    id: 4,
    name: 'temporal_past',
    category: 'Grammar',
    frequency: 0.11,
    maxActivation: 6.3,
    topTokens: [
      { token: 'was', weight: 0.93 }, { token: 'had', weight: 0.89 },
      { token: 'did', weight: 0.85 }, { token: 'went', weight: 0.82 },
      { token: 'previously', weight: 0.78 },
    ],
    description: 'Encodes past tense temporal references. Activates on past tense verbs and temporal markers.',
    layer: 8,
  },
  {
    id: 5,
    name: 'is_quoted',
    category: 'Formatting',
    frequency: 0.06,
    maxActivation: 9.1,
    topTokens: [
      { token: '"', weight: 0.96 }, { token: '\'', weight: 0.93 },
      { token: '`', weight: 0.87 }, { token: '"""', weight: 0.82 },
    ],
    description: 'Detects quotation marks and quoted content. Strong activation at quote boundaries.',
    layer: 4,
  },
  {
    id: 6,
    name: 'scientific_terms',
    category: 'Domain',
    frequency: 0.04,
    maxActivation: 7.8,
    topTokens: [
      { token: 'hypothesis', weight: 0.91 }, { token: 'experiment', weight: 0.88 },
      { token: 'neuron', weight: 0.85 }, { token: 'synthesis', weight: 0.82 },
      { token: 'molecule', weight: 0.79 },
    ],
    description: 'Activates on scientific terminology across physics, chemistry, biology, and neuroscience.',
    layer: 10,
  },
  {
    id: 7,
    name: 'question_marker',
    category: 'Grammar',
    frequency: 0.09,
    maxActivation: 5.9,
    topTokens: [
      { token: '?', weight: 0.95 }, { token: 'what', weight: 0.88 },
      { token: 'how', weight: 0.85 }, { token: 'why', weight: 0.82 },
      { token: 'whether', weight: 0.78 },
    ],
    description: 'Detects interrogative constructions. Activates on question words and sentence-final question marks.',
    layer: 6,
  },
  {
    id: 8,
    name: 'entity_person',
    category: 'NER',
    frequency: 0.07,
    maxActivation: 8.2,
    topTokens: [
      { token: 'John', weight: 0.93 }, { token: 'Mary', weight: 0.90 },
      { token: 'Dr.', weight: 0.86 }, { token: 'Mr.', weight: 0.83 },
      { token: 'Einstein', weight: 0.79 },
    ],
    description: 'Named entity recognition feature for person names. Activates on proper nouns referring to people.',
    layer: 11,
  },
  {
    id: 9,
    name: 'logical_connector',
    category: 'Discourse',
    frequency: 0.05,
    maxActivation: 6.5,
    topTokens: [
      { token: 'therefore', weight: 0.94 }, { token: 'however', weight: 0.91 },
      { token: 'because', weight: 0.87 }, { token: 'moreover', weight: 0.83 },
      { token: 'consequently', weight: 0.80 },
    ],
    description: 'Encodes logical and discourse connectives. Activates on words that signal argumentative structure.',
    layer: 9,
  },
  {
    id: 10,
    name: 'in_degree_2_relation',
    category: 'Circuit',
    frequency: 0.03,
    maxActivation: 10.2,
    topTokens: [
      { token: ' to', weight: 0.95 }, { token: ' gave', weight: 0.88 },
      { token: ' sent', weight: 0.84 }, { token: ' brought', weight: 0.80 },
    ],
    description: 'Encodes the "X gave Y to Z" syntactic pattern. Key feature in the IOI circuit for identifying indirect objects.',
    layer: 10,
  },
  {
    id: 11,
    name: 'prev_token_copy',
    category: 'Algorithm',
    frequency: 0.18,
    maxActivation: 11.3,
    topTokens: [
      { token: 'the', weight: 0.72 }, { token: 'a', weight: 0.68 },
      { token: 'is', weight: 0.65 }, { token: 'of', weight: 0.62 },
    ],
    description: 'Implements previous-token copy behavior. This feature is part of the induction head circuit, enabling in-context learning.',
    layer: 7,
  },
];

// Circuit definitions
export interface CircuitNode {
  id: string;
  label: string;
  type: 'attention' | 'mlp' | 'residual' | 'embedding' | 'output';
  layer: number;
  head?: number;
  importance: number;
  description: string;
}

export interface CircuitEdge {
  source: string;
  target: string;
  strength: number;
  type: 'q' | 'k' | 'v' | 'residual';
}

export interface Circuit {
  id: string;
  name: string;
  description: string;
  model: string;
  task: string;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  references: string[];
}

export const circuits: Circuit[] = [
  {
    id: 'ioi',
    name: 'IOI Circuit',
    description: 'Indirect Object Identification circuit. Detects when a name mentioned earlier in the sentence is the indirect object of a verb. One of the most well-studied circuits in mechanistic interpretability.',
    model: 'gpt2-small',
    task: 'Predict the indirect object in sentences like "When John and Mary went to the store, John gave a bottle of wine to ___"',
    nodes: [
      { id: 'embed', label: 'Token Embedding', type: 'embedding', layer: 0, importance: 0.3, description: 'Initial token representations' },
      { id: 'h9H', label: 'Duplicate Token Head', type: 'attention', layer: 0, head: 7, importance: 0.85, description: 'Detects duplicate tokens (S2 = S1)' },
      { id: 'h10H', label: 'Previous Head', type: 'attention', layer: 2, head: 7, importance: 0.72, description: 'Attends to previous token, part of induction mechanism' },
      { id: 'h7H', label: 'Name Mover Head', type: 'attention', layer: 9, head: 9, importance: 0.95, description: 'Moves name information to the final position. Primary contributor to correct prediction.' },
      { id: 'h10N', label: 'Induction Head', type: 'attention', layer: 5, head: 1, importance: 0.88, description: 'Key induction head that copies patterns from earlier in the sequence' },
      { id: 'h11H', label: 'Negative Name Mover', type: 'attention', layer: 11, head: 10, importance: 0.65, description: 'Suppresses incorrect name predictions' },
      { id: 'mlp6', label: 'MLP Layer 6', type: 'mlp', layer: 6, importance: 0.55, description: 'Non-linear transformation that combines name and position information' },
      { id: 'mlp9', label: 'MLP Layer 9', type: 'mlp', layer: 9, importance: 0.48, description: 'Further processes the combined information for output' },
      { id: 'unembed', label: 'Unembedding', type: 'output', layer: 12, importance: 0.4, description: 'Projects final residual stream to vocabulary logits' },
    ],
    edges: [
      { source: 'embed', target: 'h9H', strength: 0.6, type: 'residual' },
      { source: 'h9H', target: 'h10H', strength: 0.7, type: 'residual' },
      { source: 'h10H', target: 'h10N', strength: 0.8, type: 'v' },
      { source: 'h10N', target: 'h7H', strength: 0.9, type: 'v' },
      { source: 'h10N', target: 'mlp6', strength: 0.5, type: 'residual' },
      { source: 'mlp6', target: 'h7H', strength: 0.6, type: 'residual' },
      { source: 'h7H', target: 'h11H', strength: 0.7, type: 'residual' },
      { source: 'h7H', target: 'mlp9', strength: 0.5, type: 'residual' },
      { source: 'h11H', target: 'unembed', strength: 0.6, type: 'residual' },
      { source: 'mlp9', target: 'unembed', strength: 0.5, type: 'residual' },
    ],
    references: [
      'Elhage et al. (2021) "A Mathematical Framework for Transformer Circuits"',
      'Olsson et al. (2022) "In-context Learning and Induction Heads"',
      'Wang et al. (2022) "Interpretability in the Wild: a Circuit for Indirect Object Identification in GPT-2 Small" (ICLR 2023, arXiv:2211.00593)',
      'Merullo, Eickhoff & Pavlick (2024) "Circuit Component Reuse Across Tasks in Transformer Language Models" (ICLR 2024, arXiv:2310.08744)',
    ],
  },
  {
    id: 'greater-than',
    name: 'Greater-Than Circuit',
    description: 'Detects when a year number is greater than a previous year. The model needs to compare two numbers and predict a larger one.',
    model: 'gpt2-small',
    task: 'Complete "The war lasted from the year 1703 to the year 17___" with a number > 03',
    nodes: [
      { id: 'embed_gt', label: 'Token Embedding', type: 'embedding', layer: 0, importance: 0.2, description: 'Encodes the year tokens' },
      { id: 'gt_head_l10', label: 'Greater-Than Head (L10H7)', type: 'attention', layer: 10, head: 7, importance: 0.92, description: 'Core comparison head. Writes a signal proportional to whether the second year > first year.' },
      { id: 'gt_head_l11', label: 'Greater-Than Head (L11H10)', type: 'attention', layer: 11, head: 10, importance: 0.78, description: 'Secondary comparison head reinforcing the signal' },
      { id: 'gt_mlp_l6', label: 'MLP L6 (Year Encoder)', type: 'mlp', layer: 6, importance: 0.7, description: 'Encodes the numerical value of the year token' },
      { id: 'gt_mlp_l11', label: 'MLP L11 (Comparator)', type: 'mlp', layer: 11, importance: 0.65, description: 'Non-linear comparison operation' },
      { id: 'unembed_gt', label: 'Unembedding', type: 'output', layer: 12, importance: 0.3, description: 'Maps comparison result to number predictions' },
    ],
    edges: [
      { source: 'embed_gt', target: 'gt_mlp_l6', strength: 0.7, type: 'residual' },
      { source: 'gt_mlp_l6', target: 'gt_head_l10', strength: 0.85, type: 'residual' },
      { source: 'gt_head_l10', target: 'gt_head_l11', strength: 0.75, type: 'v' },
      { source: 'gt_head_l10', target: 'gt_mlp_l11', strength: 0.6, type: 'residual' },
      { source: 'gt_mlp_l11', target: 'unembed_gt', strength: 0.65, type: 'residual' },
      { source: 'gt_head_l11', target: 'unembed_gt', strength: 0.7, type: 'residual' },
    ],
    references: [
      'Hanna, Liu & Variengien (2023) "How does GPT-2 compute greater-than?: Interpreting mathematical abilities in a pre-trained language model" (NeurIPS 2023, arXiv:2305.00586)',
    ],
  },
  {
    id: 'docstring',
    name: 'Docstring Circuit',
    description: 'Predicts function names in docstrings. When the model sees a docstring reference to a function, it predicts that function name.',
    model: 'gpt2-small',
    task: 'Complete "def foobarbaz(foobar):\\n    """This function does foobarbaz" with the function name',
    nodes: [
      { id: 'embed_doc', label: 'Token Embedding', type: 'embedding', layer: 0, importance: 0.2, description: 'Encodes function name and docstring tokens' },
      { id: 'doc_prev_l2', label: 'Previous Token Head (L2)', type: 'attention', layer: 2, head: 7, importance: 0.6, description: 'Attends to the previous token in the docstring' },
      { id: 'doc_induct_l5', label: 'Induction Head (L5)', type: 'attention', layer: 5, head: 1, importance: 0.82, description: 'Core induction mechanism for docstring pattern' },
      { id: 'doc_neg_l7', label: 'Negative Head (L7)', type: 'attention', layer: 7, head: 3, importance: 0.55, description: 'Suppresses incorrect function name predictions' },
      { id: 'doc_mlp_l8', label: 'MLP L8 (Formatter)', type: 'mlp', layer: 8, importance: 0.5, description: 'Processes docstring formatting patterns' },
      { id: 'doc_output_l10', label: 'Output Head (L10)', type: 'attention', layer: 10, head: 8, importance: 0.88, description: 'Final prediction head for function name' },
      { id: 'unembed_doc', label: 'Unembedding', type: 'output', layer: 12, importance: 0.3, description: 'Projects to vocabulary' },
    ],
    edges: [
      { source: 'embed_doc', target: 'doc_prev_l2', strength: 0.5, type: 'residual' },
      { source: 'doc_prev_l2', target: 'doc_induct_l5', strength: 0.8, type: 'v' },
      { source: 'doc_induct_l5', target: 'doc_neg_l7', strength: 0.6, type: 'residual' },
      { source: 'doc_induct_l5', target: 'doc_mlp_l8', strength: 0.55, type: 'residual' },
      { source: 'doc_neg_l7', target: 'doc_output_l10', strength: 0.65, type: 'residual' },
      { source: 'doc_mlp_l8', target: 'doc_output_l10', strength: 0.6, type: 'residual' },
      { source: 'doc_output_l10', target: 'unembed_doc', strength: 0.8, type: 'residual' },
    ],
    references: [
      'Elhage et al. (2021) "A Mathematical Framework for Transformer Circuits"',
      'Heimersheim & Janiak (2023) "A circuit for Python docstrings in a 4-layer attention-only transformer"',
    ],
  },
];

// Logit lens data
export interface LogitLensData {
  layer: number;
  topTokens: { token: string; logit: number; prob: number }[];
}

export function generateLogitLensData(layers: number, tokens: string[], target?: string): LogitLensData[] {
  const data: LogitLensData[] = [];
  const targetToken = (target?.trim() || tokens[tokens.length - 1] || '').trim();

  for (let l = 0; l < layers; l++) {
    const progress = l / (layers - 1);
    const topTokens: { token: string; logit: number; prob: number }[] = [];

    // Generate realistic-looking logit progression
    const candidates = [
      targetToken, 'the', 'a', 'is', 'to', 'of', 'and', 'in', 'that', 'it',
      'was', 'for', 'on', 'with', 'as', 'at', 'by', 'from', 'this', 'not',
    ];

    for (let ci = 0; ci < candidates.length; ci++) {
      const token = candidates[ci];
      const r = seededRandom(l * 100 + ci * 7 + tokens.length);
      const isTarget = token === targetToken;
      const baseLogit = isTarget
        ? -2 + progress * 8 + r * 0.5
        : r * 3 - 1 + (1 - progress) * 2;
      topTokens.push({
        token,
        logit: baseLogit,
        prob: 0, // will be computed after softmax
      });
    }

    // Softmax
    const maxLogit = Math.max(...topTokens.map(t => t.logit));
    const expSum = topTokens.reduce((sum, t) => sum + Math.exp(t.logit - maxLogit), 0);
    topTokens.forEach(t => {
      t.prob = Math.exp(t.logit - maxLogit) / expSum;
    });

    topTokens.sort((a, b) => b.prob - a.prob);
    data.push({ layer: l, topTokens: topTokens.slice(0, 10) });
  }

  return data;
}

// Neuron data
export interface NeuronFeature {
  neuronId: number;
  layer: number;
  label: string;
  description: string;
  maxActivation: number;
  topActivatingTokens: { token: string; activation: number }[];
  category: 'syntax' | 'semantics' | 'factual' | 'algorithm' | 'format';
}

export const neuronFeatures: NeuronFeature[] = [
  {
    neuronId: 7632,
    layer: 9,
    label: 'is_indent_start',
    description: 'Fires at the beginning of indented code blocks. Detects Python-style indentation patterns.',
    maxActivation: 12.4,
    topActivatingTokens: [
      { token: '    def', activation: 12.4 }, { token: '    class', activation: 11.8 },
      { token: '    return', activation: 10.2 }, { token: '    if', activation: 9.5 },
      { token: '        ', activation: 8.9 },
    ],
    category: 'format',
  },
  {
    neuronId: 14205,
    layer: 11,
    label: 'wikipedia_citation',
    description: 'Activates on Wikipedia-style citation markers and reference formatting.',
    maxActivation: 15.7,
    topActivatingTokens: [
      { token: '[1]', activation: 15.7 }, { token: '[2]', activation: 14.9 },
      { token: '[citation', activation: 13.2 }, { token: '[3]', activation: 12.8 },
      { token: '[edit]', activation: 11.5 },
    ],
    category: 'format',
  },
  {
    neuronId: 3891,
    layer: 7,
    label: 'negation_detector',
    description: 'Detects negation patterns and inverts sentiment predictions accordingly.',
    maxActivation: 9.8,
    topActivatingTokens: [
      { token: 'not', activation: 9.8 }, { token: "n't", activation: 9.2 },
      { token: 'never', activation: 8.5 }, { token: 'no', activation: 7.9 },
      { token: 'neither', activation: 7.1 },
    ],
    category: 'syntax',
  },
  {
    neuronId: 22048,
    layer: 10,
    label: 'us_state_name',
    description: 'Fires on US state names, encoding geographical entity recognition.',
    maxActivation: 11.2,
    topActivatingTokens: [
      { token: 'California', activation: 11.2 }, { token: 'Texas', activation: 10.8 },
      { token: 'New York', activation: 10.1 }, { token: 'Florida', activation: 9.7 },
      { token: 'Illinois', activation: 9.2 },
    ],
    category: 'factual',
  },
  {
    neuronId: 5617,
    layer: 8,
    label: 'comparison_operator',
    description: 'Detects comparison operations (>, <, >=, <=) and encodes directional comparison.',
    maxActivation: 8.9,
    topActivatingTokens: [
      { token: '>', activation: 8.9 }, { token: '>=', activation: 8.5 },
      { token: 'less than', activation: 7.8 }, { token: 'greater than', activation: 7.5 },
      { token: '<', activation: 7.2 },
    ],
    category: 'algorithm',
  },
  {
    neuronId: 41023,
    layer: 11,
    label: 'emotional_intensity',
    description: 'Encodes the emotional intensity of text, regardless of valence.',
    maxActivation: 13.5,
    topActivatingTokens: [
      { token: '!!!', activation: 13.5 }, { token: 'devastating', activation: 12.1 },
      { token: 'incredible', activation: 11.8 }, { token: 'horrible', activation: 11.2 },
      { token: 'amazing', activation: 10.9 },
    ],
    category: 'semantics',
  },
  {
    neuronId: 8934,
    layer: 6,
    label: 'json_key',
    description: 'Activates on JSON object keys (tokens followed by colons in JSON context).',
    maxActivation: 10.6,
    topActivatingTokens: [
      { token: '"name":', activation: 10.6 }, { token: '"value":', activation: 10.1 },
      { token: '"type":', activation: 9.5 }, { token: '"id":', activation: 9.0 },
      { token: '"status":', activation: 8.7 },
    ],
    category: 'format',
  },
  {
    neuronId: 16789,
    layer: 9,
    label: 'sentence_boundary',
    description: 'Fires at sentence boundaries, particularly after periods followed by capitals.',
    maxActivation: 7.8,
    topActivatingTokens: [
      { token: '. The', activation: 7.8 }, { token: '. A', activation: 7.3 },
      { token: '. In', activation: 6.9 }, { token: '. He', activation: 6.5 },
      { token: '. It', activation: 6.2 },
    ],
    category: 'syntax',
  },
];
