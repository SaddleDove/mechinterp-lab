'use client';

import { useState, useMemo } from 'react';
import { models, samplePrompts } from '@/lib/data';

function attributionColor(value: number): string {
  if (value > 0) {
    const intensity = Math.min(1, value * 3);
    return `rgba(99, 102, 241, ${0.1 + intensity * 0.6})`;
  } else {
    const intensity = Math.min(1, Math.abs(value) * 3);
    return `rgba(239, 68, 68, ${0.1 + intensity * 0.6})`;
  }
}

export default function AttributionPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedPrompt, setSelectedPrompt] = useState(samplePrompts[0]);
  const [method, setMethod] = useState<'gradient' | 'integrated-gradients' | 'attention-x-input' | 'lrp'>('integrated-gradients');
  const [targetTokenIdx, setTargetTokenIdx] = useState<number | null>(null);

  const tokens = useMemo(() => {
    return selectedPrompt.text.split(/(\s+|[.,;:!?])/g).filter(t => t.trim().length > 0);
  }, [selectedPrompt]);

  // Deterministic pseudo-random based on seed
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  // Generate attribution scores
  const attributions = useMemo(() => {
    return tokens.map((token, i) => {
      const posProgress = i / (tokens.length - 1);
      let score: number;
      const r = seededRandom(i * 137 + selectedPrompt.id.length * 31 + selectedModel.id.length * 7);
      const r2 = seededRandom(i * 271 + selectedPrompt.id.length * 53 + selectedModel.id.length * 13);

      // Create realistic attribution patterns
      switch (selectedPrompt.id) {
        case 'ioi':
          // IOI: early names and the verb matter most
          if (i <= 2) score = 0.15 + r * 0.1;
          else if (i <= 5) score = 0.05 + r * 0.05;
          else if (i === 6) score = 0.25 + r * 0.1;
          else if (i <= 9) score = 0.1 + r * 0.08;
          else if (i <= 12) score = 0.2 + r * 0.1;
          else score = 0.15 + r * 0.1;
          // Add some negative attributions
          if (i === 3 || i === 5) score = -(0.05 + r2 * 0.05);
          break;
        case 'greater-than':
          // Greater-than: the numbers matter most
          if (token.match(/^\d/)) score = 0.3 + r * 0.2;
          else if (i > tokens.length - 4) score = 0.15 + r * 0.1;
          else score = r * 0.08;
          break;
        default:
          score = Math.sin(posProgress * Math.PI) * 0.2 + (r - 0.5) * 0.1;
      }

      // Scale by method
      switch (method) {
        case 'gradient':
          score *= 0.8;
          break;
        case 'integrated-gradients':
          score *= 1.0;
          break;
        case 'attention-x-input':
          score *= 0.6;
          break;
        case 'lrp':
          score *= 1.2;
          break;
      }

      return { token, score, absScore: Math.abs(score) };
    });
  }, [tokens, selectedPrompt, method, selectedModel.id]);

  const maxAbsScore = Math.max(...attributions.map(a => a.absScore));
  const sortedAttributions = useMemo(() => {
    return [...attributions].sort((a, b) => b.absScore - a.absScore);
  }, [attributions]);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Token Attribution</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Gradient-based saliency maps — which input tokens drive the prediction</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedModel.id}
                onChange={(e) => setSelectedModel(models.find(m => m.id === e.target.value) || models[0])}
                className="text-xs bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-1.5 text-zinc-300 font-mono"
              >
                {models.filter(m => m.status === 'available').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <select
                value={selectedPrompt.id}
                onChange={(e) => setSelectedPrompt(samplePrompts.find(p => p.id === e.target.value) || samplePrompts[0])}
                className="text-xs bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-1.5 text-zinc-300"
              >
                {samplePrompts.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as typeof method)}
                className="text-xs bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-1.5 text-zinc-300"
              >
                <option value="integrated-gradients">Integrated Gradients</option>
                <option value="gradient">Gradient × Input</option>
                <option value="attention-x-input">Attention × Input</option>
                <option value="lrp">Layer-wise Relevance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel */}
          <div className="col-span-3 space-y-4">
            {/* Method Info */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Method</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {method === 'gradient' && 'Computes ∂output/∂input for each token embedding. Fast but can be noisy.'}
                {method === 'integrated-gradients' && 'Integrates gradients along a path from baseline to input. More stable attribution scores.'}
                {method === 'attention-x-input' && 'Multiplies attention weights by input embeddings. Fast approximation of gradient methods.'}
                {method === 'lrp' && 'Propagates relevance backward through layers. Preserves conservation property.'}
              </p>
            </div>

            {/* Target Selection */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Target Token</h3>
              <p className="text-[10px] text-zinc-500 mb-2">Select which output token to attribute:</p>
              <div className="flex flex-wrap gap-1">
                {tokens.map((token, i) => (
                  <button
                    key={i}
                    onClick={() => setTargetTokenIdx(i)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-mono border transition-smooth ${
                      targetTokenIdx === i
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                        : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {token}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-600 mt-2">
                Default: <span className="text-orange-400 font-mono">&quot;{selectedPrompt.expectedCompletion.trim()}&quot;</span>
              </p>
            </div>

            {/* Summary Stats */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total tokens</span>
                  <span className="text-zinc-300 font-mono">{tokens.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Max attribution</span>
                  <span className="text-indigo-400 font-mono">{maxAbsScore.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mean |attr|</span>
                  <span className="text-zinc-300 font-mono">
                    {(attributions.reduce((s, a) => s + a.absScore, 0) / attributions.length).toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Positive tokens</span>
                  <span className="text-emerald-400 font-mono">
                    {attributions.filter(a => a.score > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Negative tokens</span>
                  <span className="text-red-400 font-mono">
                    {attributions.filter(a => a.score < 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main visualization */}
          <div className="col-span-9 space-y-6">
            {/* Highlighted Text */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Attribution Highlighting</h3>
              <p className="text-[11px] text-zinc-500 mb-4">
                Token background intensity proportional to attribution magnitude. Blue = positive, Red = negative.
              </p>
              <div className="text-base leading-loose font-mono">
                {attributions.map((attr, i) => (
                  <span
                    key={i}
                    className="inline-block px-1 py-0.5 rounded mx-px transition-smooth cursor-default"
                    style={{
                      backgroundColor: attributionColor(attr.score),
                      borderBottom: `2px solid ${attr.score > 0 ? '#6366f1' : '#ef4444'}`,
                      borderBottomWidth: `${Math.min(3, attr.absScore / maxAbsScore * 3)}px`,
                    }}
                    title={`${attr.token}: ${attr.score.toFixed(4)}`}
                  >
                    {attr.token}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-800/40">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(99, 102, 241, 0.5)' }} />
                  <span className="text-[10px] text-zinc-500">Positive attribution (supports prediction)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.5)' }} />
                  <span className="text-[10px] text-zinc-500">Negative attribution (suppresses prediction)</span>
                </div>
              </div>
            </div>

            {/* Attribution Bar Chart */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Attribution Scores</h3>
              <p className="text-[11px] text-zinc-500 mb-4">Per-token attribution values (sorted by magnitude)</p>
              <div className="space-y-1.5">
                {sortedAttributions.map((attr, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <code className="text-[11px] font-mono text-zinc-300 w-20 text-right truncate">
                      {attr.token}
                    </code>
                    <div className="flex-1 flex items-center h-5">
                      <div className="w-1/2 flex justify-end">
                        {attr.score < 0 && (
                          <div
                            className="h-full rounded-l transition-smooth"
                            style={{
                              width: `${(attr.absScore / maxAbsScore) * 50}%`,
                              backgroundColor: '#ef4444',
                              opacity: 0.6,
                            }}
                          />
                        )}
                      </div>
                      <div className="w-px h-full bg-zinc-700/50" />
                      <div className="w-1/2">
                        {attr.score > 0 && (
                          <div
                            className="h-full rounded-r transition-smooth"
                            style={{
                              width: `${(attr.absScore / maxAbsScore) * 50}%`,
                              backgroundColor: '#6366f1',
                              opacity: 0.6,
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono w-16 text-right ${
                      attr.score > 0 ? 'text-indigo-400' : 'text-red-400'
                    }`}>
                      {attr.score > 0 ? '+' : ''}{attr.score.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cumulative Attribution */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Cumulative Attribution</h3>
              <p className="text-[11px] text-zinc-500 mb-4">How much of the total attribution is captured by the top-k tokens</p>
              <div className="relative h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid */}
                  {[25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={100 - y} x2="100" y2={100 - y} stroke="#27272a" strokeWidth="0.3" />
                  ))}
                  {/* Cumulative curve */}
                  <polyline
                    points={sortedAttributions.reduce<{ points: string; cumSum: number }>((acc, attr, i) => {
                      const cumSum = acc.cumSum + attr.absScore;
                      const totalSum = sortedAttributions.reduce((s, a) => s + a.absScore, 0);
                      const x = ((i + 1) / sortedAttributions.length) * 100;
                      const y = 100 - (cumSum / totalSum) * 100;
                      return { points: `${acc.points} ${x},${y}`, cumSum };
                    }, { points: '0,100', cumSum: 0 }).points}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* 80% line */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f97316" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                  <text x="95" y="18" textAnchor="end" className="text-[6px] fill-orange-400/60">80%</text>
                </svg>
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] font-mono text-zinc-600 pointer-events-none">
                  <span>100%</span>
                  <span>50%</span>
                  <span>0%</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-[9px] font-mono text-zinc-600 pointer-events-none">
                  <span>Top 1</span>
                  <span>Top {Math.ceil(tokens.length / 2)}</span>
                  <span>Top {tokens.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
