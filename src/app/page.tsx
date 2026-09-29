import { models, circuits, saeFeatures } from '@/lib/data';

const tools = [
  {
    href: '/attention',
    title: 'Attention Visualization',
    description: 'Multi-head, multi-layer attention pattern analysis with interactive heatmaps',
    icon: 'eye',
    color: 'indigo',
    stats: 'Per-head heatmaps',
  },
  {
    href: '/patching',
    title: 'Activation Patching',
    description: 'Causal tracing through model layers to identify critical computation sites',
    icon: 'branch',
    color: 'amber',
    stats: 'Layer-wise intervention',
  },
  {
    href: '/sae',
    title: 'SAE Feature Browser',
    description: 'Explore sparse autoencoder features — interpretable directions in activation space',
    icon: 'layers',
    color: 'emerald',
    stats: `${saeFeatures.length} features indexed`,
  },
  {
    href: '/logit-lens',
    title: 'Logit Lens',
    description: 'Project residual stream to vocabulary at each layer — watch predictions form',
    icon: 'scan',
    color: 'cyan',
    stats: 'Layer-by-layer decoding',
  },
  {
    href: '/neurons',
    title: 'Neuron Analysis',
    description: 'MLP neuron feature detection — individual neuron activation patterns',
    icon: 'cpu',
    color: 'pink',
    stats: '3072 neurons / layer (GPT-2)',
  },
  {
    href: '/circuits',
    title: 'Circuit Analysis',
    description: 'Visualize computational circuits — the algorithms transformers implement',
    icon: 'network',
    color: 'violet',
    stats: `${circuits.length} circuits mapped`,
  },
  {
    href: '/attribution',
    title: 'Token Attribution',
    description: 'Gradient-based saliency maps showing input token contributions to predictions',
    icon: 'target',
    color: 'orange',
    stats: 'Per-token attribution',
  },
  {
    href: '/models',
    title: 'Model Explorer',
    description: 'Browse available models, architectures, and interpretability resources',
    icon: 'box',
    color: 'teal',
    stats: `${models.length} models`,
  },
];

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    eye: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    branch: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
    layers: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    scan: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" />
      </svg>
    ),
    cpu: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
    network: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="6" height="6" rx="1" /><rect x="17" y="4" width="6" height="6" rx="1" /><rect x="9" y="14" width="6" height="6" rx="1" /><path d="M7 7h10" /><path d="M12 10v4" />
      </svg>
    ),
    target: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
    box: (
      <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  };
  return <>{icons[name]}</>;
}

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  indigo: { bg: 'bg-indigo-500/5', border: 'border-indigo-500/20', text: 'text-indigo-400', glow: 'group-hover:shadow-indigo-500/10' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/10' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/10' },
  cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'group-hover:shadow-cyan-500/10' },
  pink: { bg: 'bg-pink-500/5', border: 'border-pink-500/20', text: 'text-pink-400', glow: 'group-hover:shadow-pink-500/10' },
  violet: { bg: 'bg-violet-500/5', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'group-hover:shadow-violet-500/10' },
  orange: { bg: 'bg-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400', glow: 'group-hover:shadow-orange-500/10' },
  teal: { bg: 'bg-teal-500/5', border: 'border-teal-500/20', text: 'text-teal-400', glow: 'group-hover:shadow-teal-500/10' },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                Mechanistic Interpretability Lab
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Browser-based tools for understanding transformer internals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-mono text-amber-300">SIMULATED DATA · DEMO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Techniques</p>
            <p className="text-2xl font-semibold text-zinc-100 mt-1">{tools.length}</p>
            <p className="text-xs text-zinc-600 mt-1">Interactive visualizations</p>
          </div>
          <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Models</p>
            <p className="text-2xl font-semibold text-zinc-100 mt-1">{models.length}</p>
            <p className="text-xs text-zinc-600 mt-1">GPT-2, Pythia, Othello + more</p>
          </div>
          <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Circuits</p>
            <p className="text-2xl font-semibold text-zinc-100 mt-1">{circuits.length}</p>
            <p className="text-xs text-zinc-600 mt-1">IOI, Greater-Than, Docstring</p>
          </div>
          <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">SAE Features</p>
            <p className="text-2xl font-semibold text-zinc-100 mt-1">{saeFeatures.length}</p>
            <p className="text-xs text-zinc-600 mt-1">Interpretable directions</p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Analysis Tools</h2>
          <div className="grid grid-cols-2 gap-4">
            {tools.map((tool) => {
              const colors = colorMap[tool.color];
              return (
                <a
                  key={tool.href}
                  href={tool.href}
                  className={`group relative rounded-lg border ${colors.border} ${colors.bg} p-5 transition-smooth panel-hover hover:shadow-lg ${colors.glow}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text}`}>
                      <ToolIcon name={tool.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-smooth">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {tool.description}
                      </p>
                      <p className={`text-[10px] font-mono ${colors.text} mt-2 opacity-70`}>
                        {tool.stats}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Research Context */}
        <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Research Context</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="text-xs font-semibold text-zinc-300 mb-2">Key Papers</h3>
              <ul className="space-y-1.5">
                <li className="text-xs text-zinc-500 hover:text-zinc-300 transition-smooth cursor-pointer">
                  Elhage et al. (2021) — A Mathematical Framework for Transformer Circuits
                </li>
                <li className="text-xs text-zinc-500 hover:text-zinc-300 transition-smooth cursor-pointer">
                  Olsson et al. (2022) — In-context Learning and Induction Heads
                </li>
                <li className="text-xs text-zinc-500 hover:text-zinc-300 transition-smooth cursor-pointer">
                  Cunningham et al. (2023) — Sparse Autoencoders Find Highly Interpretable Features in Language Models
                </li>
                <li className="text-xs text-zinc-500 hover:text-zinc-300 transition-smooth cursor-pointer">
                  Bricken et al. (2023) — Towards Monosemanticity
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-300 mb-2">Open Problems</h3>
              <ul className="space-y-1.5">
                <li className="text-xs text-zinc-500">Scaling interpretability to frontier models</li>
                <li className="text-xs text-zinc-500">Automated circuit discovery at scale</li>
                <li className="text-xs text-zinc-500">Understanding superposition in SAE features</li>
                <li className="text-xs text-zinc-500">Causal abstraction and alignment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-300 mb-2">Tools & Libraries</h3>
              <ul className="space-y-1.5">
                <li className="text-xs text-zinc-500">TransformerLens — Circuit analysis in PyTorch</li>
                <li className="text-xs text-zinc-500">CircuitsVis — Interactive visualizations</li>
                <li className="text-xs text-zinc-500">SAELens — Sparse autoencoder training</li>
                <li className="text-xs text-zinc-500">pyvene — Intervention-based causal analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
