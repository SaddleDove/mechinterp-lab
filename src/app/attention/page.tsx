'use client';

import { useState, useMemo, useCallback } from 'react';
import { models, samplePrompts, generateAttentionPattern } from '@/lib/data';

const headColors = [
  '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4',
  '#8b5cf6', '#f97316', '#14b8a6', '#e11d48', '#84cc16',
  '#a78bfa', '#fb923c',
];

const patternTypes = ['diagonal', 'uniform', 'first-token', 'previous', 'inductive', 'duplicate', 'random'] as const;

function viridisColor(value: number): string {
  const v = Math.max(0, Math.min(1, value));
  const colors = [
    [68, 1, 84], [72, 40, 120], [62, 73, 137], [49, 104, 142],
    [38, 130, 142], [31, 158, 137], [53, 183, 121], [110, 206, 88],
    [181, 222, 43], [253, 231, 37],
  ];
  const idx = v * (colors.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, colors.length - 1);
  const t = idx - lo;
  const r = Math.round(colors[lo][0] + t * (colors[hi][0] - colors[lo][0]));
  const g = Math.round(colors[lo][1] + t * (colors[hi][1] - colors[lo][1]));
  const b = Math.round(colors[lo][2] + t * (colors[hi][2] - colors[lo][2]));
  return `rgb(${r},${g},${b})`;
}

export default function AttentionPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedPrompt, setSelectedPrompt] = useState(samplePrompts[0]);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [selectedHead, setSelectedHead] = useState(0);
  const [patternType, setPatternType] = useState<typeof patternTypes[number]>('inductive');
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const tokens = useMemo(() => {
    const text = selectedPrompt.text;
    return text.split(/(\s+|[.,;:!?])/g).filter(t => t.trim().length > 0);
  }, [selectedPrompt]);

  const attentionMatrix = useMemo(() => {
    return generateAttentionPattern(tokens.length, selectedLayer, selectedHead, patternType);
  }, [tokens.length, selectedLayer, selectedHead, patternType]);

  const aggregatedAttention = useMemo(() => {
    const matrix: number[][] = [];
    for (let i = 0; i < tokens.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < tokens.length; j++) {
        let sum = 0;
        for (let h = 0; h < selectedModel.heads; h++) {
          const pat = generateAttentionPattern(tokens.length, selectedLayer, h, patternType);
          sum += pat[i][j];
        }
        row.push(sum / selectedModel.heads);
      }
      matrix.push(row);
    }
    return matrix;
  }, [tokens.length, selectedLayer, selectedModel.heads, patternType]);

  const handleCellHover = useCallback((row: number, col: number) => {
    setHoveredCell({ row, col });
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Attention Pattern Visualization</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Multi-head attention weight analysis across transformer layers</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const next = models.find(m => m.id === e.target.value) || models[0];
                  setSelectedModel(next);
                  // Smaller models have fewer layers/heads — clamp the selection.
                  setSelectedLayer(l => Math.min(l, next.layers - 1));
                  setSelectedHead(h => Math.min(h, next.heads - 1));
                }}
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
          {/* Left panel - Controls */}
          <div className="col-span-3 space-y-4">
            {/* Token Display */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Input Tokens</h3>
              <div className="flex flex-wrap gap-1">
                {tokens.map((token, i) => (
                  <span
                    key={i}
                    className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono border transition-smooth ${
                      hoveredCell && (hoveredCell.row === i || hoveredCell.col === i)
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-400'
                    }`}
                  >
                    {token}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-zinc-600 mt-2 font-mono">{tokens.length} tokens</p>
            </div>

            {/* Layer Selection */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Layer</h3>
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: selectedModel.layers }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedLayer(i)}
                    className={`py-1.5 rounded text-[10px] font-mono transition-smooth ${
                      selectedLayer === i
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-zinc-800/30 text-zinc-500 border border-zinc-700/20 hover:bg-zinc-800/60'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Head Selection */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Attention Head <span className="text-indigo-400">H{selectedHead}</span>
              </h3>
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: selectedModel.heads }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHead(i)}
                    className={`py-1.5 rounded text-[10px] font-mono transition-smooth ${
                      selectedHead === i
                        ? 'border-2'
                        : 'border border-zinc-700/20 hover:bg-zinc-800/60'
                    }`}
                    style={{
                      backgroundColor: selectedHead === i ? `${headColors[i % headColors.length]}20` : 'transparent',
                      borderColor: selectedHead === i ? headColors[i % headColors.length] : undefined,
                      color: selectedHead === i ? headColors[i % headColors.length] : '#71717a',
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Type */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Pattern Type</h3>
              <div className="space-y-1">
                {patternTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setPatternType(type)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] font-mono transition-smooth ${
                      patternType === type
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Attention Info</h3>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Model</span>
                  <span className="text-zinc-300 font-mono">{selectedModel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Layer</span>
                  <span className="text-zinc-300 font-mono">{selectedLayer} / {selectedModel.layers - 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Head</span>
                  <span className="text-zinc-300 font-mono">{selectedHead} / {selectedModel.heads - 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">d_head</span>
                  <span className="text-zinc-300 font-mono">{selectedModel.dHead}</span>
                </div>
                {hoveredCell && (
                  <>
                    <div className="border-t border-zinc-800/60 pt-1.5 mt-1.5">
                      <span className="text-zinc-500">Query</span>
                      <span className="text-zinc-300 font-mono ml-2">&quot;{tokens[hoveredCell.row]}&quot;</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Key</span>
                      <span className="text-zinc-300 font-mono">&quot;{tokens[hoveredCell.col]}&quot;</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Weight</span>
                      <span className="text-indigo-400 font-mono">
                        {attentionMatrix[hoveredCell.row][hoveredCell.col].toFixed(4)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main visualization */}
          <div className="col-span-9 space-y-6">
            {/* Single Head Heatmap */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Attention Pattern — Layer {selectedLayer}, Head {selectedHead}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-600">low</span>
                  <div className="flex h-3 rounded overflow-hidden">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        className="w-2 h-full"
                        style={{ backgroundColor: viridisColor(i / 19) }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">high</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  {/* Column headers */}
                  <div className="flex ml-16 mb-1">
                    {tokens.map((token, i) => (
                      <div
                        key={i}
                        className={`w-10 text-center text-[9px] font-mono truncate transition-smooth ${
                          hoveredCell?.col === i ? 'text-indigo-400' : 'text-zinc-600'
                        }`}
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '48px' }}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                  {/* Matrix */}
                  {attentionMatrix.map((row, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`w-14 text-right pr-2 text-[10px] font-mono truncate transition-smooth ${
                        hoveredCell?.row === i ? 'text-indigo-400' : 'text-zinc-500'
                      }`}>
                        {tokens[i]}
                      </div>
                      <div className="flex">
                        {row.map((val, j) => (
                          <div
                            key={j}
                            className="w-10 h-8 border-r border-b border-zinc-900/50 transition-smooth cursor-crosshair"
                            style={{
                              backgroundColor: viridisColor(val),
                              opacity: hoveredCell && (hoveredCell.row !== i && hoveredCell.col !== j) ? 0.4 : 1,
                            }}
                            onMouseEnter={() => handleCellHover(i, j)}
                            onMouseLeave={() => setHoveredCell(null)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Head Comparison Grid */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-4">
                All Heads — Layer {selectedLayer}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: Math.min(selectedModel.heads, 12) }, (_, h) => {
                  const mat = generateAttentionPattern(Math.min(tokens.length, 8), selectedLayer, h, patternType);
                  return (
                    <div
                      key={h}
                      className={`rounded-md border p-2 cursor-pointer transition-smooth ${
                        selectedHead === h
                          ? 'border-indigo-500/40 bg-indigo-500/5'
                          : 'border-zinc-800/40 hover:border-zinc-700/60'
                      }`}
                      onClick={() => setSelectedHead(h)}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: headColors[h % headColors.length] }} />
                        <span className="text-[10px] font-mono text-zinc-400">Head {h}</span>
                      </div>
                      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${Math.min(tokens.length, 8)}, 1fr)` }}>
                        {mat.slice(0, 8).map((row, i) =>
                          row.slice(0, 8).map((val, j) => (
                            <div
                              key={`${i}-${j}`}
                              className="aspect-square rounded-[1px]"
                              style={{ backgroundColor: viridisColor(val) }}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aggregated Attention */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">
                Head-Averaged Attention — Layer {selectedLayer}
              </h3>
              <p className="text-[11px] text-zinc-500 mb-4">Mean attention across all {selectedModel.heads} heads</p>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  <div className="flex ml-16 mb-1">
                    {tokens.map((token, i) => (
                      <div key={i} className="w-10 text-center text-[9px] font-mono text-zinc-600 truncate"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '40px' }}>
                        {token}
                      </div>
                    ))}
                  </div>
                  {aggregatedAttention.map((row, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-14 text-right pr-2 text-[10px] font-mono text-zinc-500 truncate">
                        {tokens[i]}
                      </div>
                      <div className="flex">
                        {row.map((val, j) => (
                          <div
                            key={j}
                            className="w-10 h-7 border-r border-b border-zinc-900/50"
                            style={{ backgroundColor: viridisColor(val) }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
