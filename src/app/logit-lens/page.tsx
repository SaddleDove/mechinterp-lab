'use client';

import { useState, useMemo } from 'react';
import { models, samplePrompts, generateLogitLensData } from '@/lib/data';

function probToColor(prob: number): string {
  const v = Math.max(0, Math.min(1, prob * 5)); // scale up for visibility
  const r = Math.round(99 + v * 156);
  const g = Math.round(102 - v * 50);
  const b = Math.round(241 - v * 200);
  return `rgb(${r},${g},${b})`;
}

export default function LogitLensPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedPrompt, setSelectedPrompt] = useState(samplePrompts[0]);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  const tokens = useMemo(() => {
    return selectedPrompt.text.split(/(\s+|[.,;:!?])/g).filter(t => t.trim().length > 0);
  }, [selectedPrompt]);

  // The target is the completion the prompt probes for, not the last input token.
  const targetToken = selectedPrompt.expectedCompletion.trim();

  const logitData = useMemo(() => {
    return generateLogitLensData(selectedModel.layers, tokens, targetToken);
  }, [selectedModel.layers, tokens, targetToken]);

  // Track how target token probability evolves across layers
  const targetProgression = useMemo(() => {
    return logitData.map(d => {
      const target = d.topTokens.find(t => t.token === targetToken);
      return {
        layer: d.layer,
        prob: target?.prob || 0,
        rank: d.topTokens.findIndex(t => t.token === targetToken) + 1,
      };
    });
  }, [logitData, targetToken]);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Logit Lens</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Project residual stream to vocabulary at each layer — watch predictions emerge</p>
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
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel */}
          <div className="col-span-3 space-y-4">
            {/* Tokens */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Input Sequence</h3>
              <div className="flex flex-wrap gap-1">
                {tokens.map((token, i) => (
                  <span
                    key={i}
                    className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono border ${
                      i === tokens.length - 1
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-400'
                    }`}
                  >
                    {token}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-zinc-600 mt-2">
                Target: <span className="text-cyan-400 font-mono">&quot;{targetToken}&quot;</span>
              </p>
            </div>

            {/* Target Progression */}
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                Target Token Progression
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Final Prob</span>
                  <span className="text-cyan-400 font-mono">
                    {(targetProgression[targetProgression.length - 1]?.prob * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Final Rank</span>
                  <span className="text-cyan-400 font-mono">
                    #{targetProgression[targetProgression.length - 1]?.rank || '-'}
                  </span>
                </div>
              </div>
              {/* Mini sparkline */}
              <div className="mt-3 h-16 flex items-end gap-px">
                {targetProgression.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-smooth"
                    style={{
                      height: `${Math.max(2, d.prob * 100)}%`,
                      backgroundColor: d.prob > 0.3 ? '#06b6d4' : '#27272a',
                      opacity: hoveredLayer === d.layer ? 1 : 0.6,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] font-mono text-zinc-600">L0</span>
                <span className="text-[9px] font-mono text-zinc-600">L{selectedModel.layers - 1}</span>
              </div>
            </div>

            {/* Method Info */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">How it works</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                The logit lens applies the unembedding matrix to the residual stream at each layer,
                producing &quot;what the model would predict if we stopped here.&quot;
                This reveals how predictions form layer by layer.
              </p>
            </div>
          </div>

          {/* Main visualization */}
          <div className="col-span-9 space-y-6">
            {/* Layer-by-layer Top Predictions */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Top Predictions per Layer</h3>
              <p className="text-[11px] text-zinc-500 mb-4">
                Top-5 token predictions at each layer (via unembedding projection)
              </p>
              <div className="space-y-0.5">
                {logitData.map((layerData) => (
                  <div
                    key={layerData.layer}
                    className={`flex items-center gap-2 py-1 px-2 rounded transition-smooth ${
                      hoveredLayer === layerData.layer ? 'bg-zinc-800/40' : ''
                    }`}
                    onMouseEnter={() => setHoveredLayer(layerData.layer)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    <span className={`text-[10px] font-mono w-8 text-right ${
                      hoveredLayer === layerData.layer ? 'text-cyan-400' : 'text-zinc-500'
                    }`}>
                      L{layerData.layer}
                    </span>
                    <div className="flex gap-1.5 flex-1">
                      {layerData.topTokens.slice(0, 5).map((token, i) => {
                        const isTarget = token.token === targetToken;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono ${
                              isTarget
                                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                                : 'bg-zinc-800/30 text-zinc-400'
                            }`}
                          >
                            <span>{token.token}</span>
                            <span className={`text-[9px] ${isTarget ? 'text-cyan-500' : 'text-zinc-600'}`}>
                              {(token.prob * 100).toFixed(1)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Probability Heatmap */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Probability Evolution Heatmap</h3>
              <p className="text-[11px] text-zinc-500 mb-4">How top token probabilities change across layers</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-[10px] font-mono text-zinc-500 text-left pb-2 w-20">Token</th>
                      {logitData.filter((_, i) => i % 2 === 0 || i === logitData.length - 1).map(d => (
                        <th key={d.layer} className="text-[9px] font-mono text-zinc-600 text-center pb-2">
                          L{d.layer}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Get unique top tokens across all layers */}
                    {Array.from(new Set(logitData.flatMap(d => d.topTokens.slice(0, 5).map(t => t.token)))).slice(0, 8).map(token => (
                      <tr key={token} className="border-t border-zinc-800/30">
                        <td className={`text-[11px] font-mono py-1 pr-2 ${
                          token === targetToken ? 'text-cyan-400' : 'text-zinc-400'
                        }`}>
                          {token}
                        </td>
                        {logitData.filter((_, i) => i % 2 === 0 || i === logitData.length - 1).map(d => {
                          const tokenData = d.topTokens.find(t => t.token === token);
                          const prob = tokenData?.prob || 0;
                          return (
                            <td key={d.layer} className="text-center py-1 px-0.5">
                              <div
                                className="h-6 rounded-sm flex items-center justify-center"
                                style={{ backgroundColor: prob > 0.01 ? probToColor(prob) : '#18181b' }}
                              >
                                {prob > 0.05 && (
                                  <span className="text-[9px] font-mono text-white/80">{(prob * 100).toFixed(0)}%</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rank Evolution */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Target Token Rank Across Layers</h3>
              <p className="text-[11px] text-zinc-500 mb-4">When does the correct answer become the top prediction?</p>
              <div className="relative h-40">
                <svg className="w-full h-full" viewBox={`0 0 ${selectedModel.layers} 100`} preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[1, 5, 10].map(rank => (
                    <line
                      key={rank}
                      x1="0" y1={((rank - 1) / 9) * 100}
                      x2={selectedModel.layers} y2={((rank - 1) / 9) * 100}
                      stroke="#27272a" strokeWidth="0.5"
                    />
                  ))}
                  {/* Rank line — rank #1 at the top, #10 at the bottom */}
                  <polyline
                    points={targetProgression.map((d, i) => `${i},${((Math.min(Math.max(d.rank, 1), 10) - 1) / 9) * 100}`).join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Points */}
                  {targetProgression.map((d, i) => (
                    <circle
                      key={i}
                      cx={i}
                      cy={((Math.min(Math.max(d.rank, 1), 10) - 1) / 9) * 100}
                      r="1.5"
                      fill="#06b6d4"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[9px] font-mono text-zinc-600">
                  <span>#1</span>
                  <span>#5</span>
                  <span>#10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
