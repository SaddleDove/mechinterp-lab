'use client';

import { useState, useMemo } from 'react';
import { models, samplePrompts } from '@/lib/data';

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

export default function PatchingPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedPrompt, setSelectedPrompt] = useState(samplePrompts[0]);
  const [corruptionType, setCorruptionType] = useState<'zero-ablate' | 'mean-ablate' | 'resample'>('mean-ablate');
  const [hoveredCell, setHoveredCell] = useState<{ layer: number; pos: number } | null>(null);

  const tokens = useMemo(() => {
    return selectedPrompt.text.split(/(\s+|[.,;:!?])/g).filter(t => t.trim().length > 0);
  }, [selectedPrompt]);

  // Deterministic pseudo-random
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  // Generate causal tracing matrix (layer x position)
  const causalMatrix = useMemo(() => {
    const layers = selectedModel.layers;
    const positions = tokens.length;
    const matrix: number[][] = [];

    for (let l = 0; l < layers; l++) {
      const row: number[] = [];
      for (let p = 0; p < positions; p++) {
        // Simulate causal importance
        let val = 0;
        const layerProgress = l / (layers - 1);
        const posProgress = p / (positions - 1);
        const r = seededRandom(l * 100 + p + selectedPrompt.id.length * 17 + corruptionType.length * 971);

        // Create interesting patterns based on the circuit
        if (selectedPrompt.id === 'ioi') {
          // IOI circuit: important at specific layers and positions
          if (l >= 8 && l <= 10 && p >= 1 && p <= 3) val = 0.7 + r * 0.3;
          else if (l >= 5 && l <= 7 && p >= 4) val = 0.4 + r * 0.3;
          else if (l >= 2 && l <= 4 && p >= 3) val = 0.3 + r * 0.2;
          else val = r * 0.15;
        } else if (selectedPrompt.id === 'greater-than') {
          if (l >= 9 && l <= 11 && p >= positions - 3) val = 0.8 + r * 0.2;
          else if (l >= 5 && l <= 8 && p >= positions - 4) val = 0.4 + r * 0.3;
          else val = r * 0.12;
        } else {
          // Generic pattern
          val = Math.sin(layerProgress * Math.PI) * Math.cos(posProgress * Math.PI * 0.5) * 0.5 + r * 0.2;
          val = Math.max(0, val);
        }
        row.push(Math.min(1, val));
      }
      matrix.push(row);
    }
    return matrix;
  }, [selectedModel.layers, tokens.length, selectedPrompt, corruptionType]);

  // Layer importance (aggregated)
  const layerImportance = useMemo(() => {
    return causalMatrix.map(row => row.reduce((sum, v) => sum + v, 0) / row.length);
  }, [causalMatrix]);

  // Position importance (aggregated)
  const positionImportance = useMemo(() => {
    const result: number[] = [];
    for (let p = 0; p < tokens.length; p++) {
      let sum = 0;
      for (let l = 0; l < selectedModel.layers; l++) {
        sum += causalMatrix[l][p];
      }
      result.push(sum / selectedModel.layers);
    }
    return result;
  }, [causalMatrix, tokens.length, selectedModel.layers]);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Activation Patching</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Causal tracing — identify which layers and positions drive model behavior</p>
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
                value={corruptionType}
                onChange={(e) => setCorruptionType(e.target.value as typeof corruptionType)}
                className="text-xs bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-1.5 text-zinc-300"
              >
                <option value="mean-ablate">Mean Ablation</option>
                <option value="zero-ablate">Zero Ablation</option>
                <option value="resample">Resample Ablation</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel */}
          <div className="col-span-3 space-y-4">
            {/* Prompt */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Prompt</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {tokens.map((token, i) => (
                  <span
                    key={i}
                    className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono border transition-smooth ${
                      hoveredCell?.pos === i
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-400'
                    }`}
                  >
                    {token}
                  </span>
                ))}
              </div>
              <div className="text-[10px] text-zinc-600 space-y-1">
                <p>Expected: <span className="text-emerald-400 font-mono">{selectedPrompt.expectedCompletion}</span></p>
                <p>Circuit: <span className="text-indigo-400">{selectedPrompt.circuit}</span></p>
              </div>
            </div>

            {/* Method Explanation */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Method</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Activation patching measures the causal effect of each (layer, position) on the model output.
                High values indicate that restoring the clean activation at that site recovers the correct prediction.
              </p>
              <div className="mt-3 space-y-1.5 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-zinc-400">High causal effect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-zinc-400">Medium causal effect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <span className="text-zinc-400">Low causal effect</span>
                </div>
              </div>
            </div>

            {/* Hover Info */}
            {hoveredCell && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Selected Site</h3>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Layer</span>
                    <span className="text-zinc-300 font-mono">{hoveredCell.layer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Position</span>
                    <span className="text-zinc-300 font-mono">{hoveredCell.pos} (&quot;{tokens[hoveredCell.pos]}&quot;)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Effect</span>
                    <span className="text-amber-400 font-mono">
                      {causalMatrix[hoveredCell.layer][hoveredCell.pos].toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Method</span>
                    <span className="text-zinc-300 font-mono">{corruptionType}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main visualization */}
          <div className="col-span-9 space-y-6">
            {/* Causal Tracing Heatmap */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">Causal Tracing Matrix</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Layer × Position causal effect on correct prediction</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-600">0.0</span>
                  <div className="flex h-3 rounded overflow-hidden">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="w-2 h-full" style={{ backgroundColor: viridisColor(i / 19) }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">1.0</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="inline-block">
                  {/* Column headers (positions) */}
                  <div className="flex ml-14 mb-1">
                    {tokens.map((token, i) => (
                      <div
                        key={i}
                        className={`w-12 text-center text-[9px] font-mono transition-smooth ${
                          hoveredCell?.pos === i ? 'text-amber-400' : 'text-zinc-600'
                        }`}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                  {/* Matrix rows */}
                  {causalMatrix.map((row, l) => (
                    <div key={l} className="flex items-center">
                      <div className={`w-12 text-right pr-2 text-[10px] font-mono transition-smooth ${
                        hoveredCell?.layer === l ? 'text-amber-400' : 'text-zinc-500'
                      }`}>
                        L{l}
                      </div>
                      <div className="flex">
                        {row.map((val, p) => (
                          <div
                            key={p}
                            className="w-12 h-8 border-r border-b border-zinc-900/50 cursor-crosshair transition-smooth"
                            style={{
                              backgroundColor: viridisColor(val),
                              opacity: hoveredCell && hoveredCell.layer !== l && hoveredCell.pos !== p ? 0.5 : 1,
                            }}
                            onMouseEnter={() => setHoveredCell({ layer: l, pos: p })}
                            onMouseLeave={() => setHoveredCell(null)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Layer Importance Bar Chart */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Layer-wise Causal Effect</h3>
              <p className="text-[11px] text-zinc-500 mb-4">Mean causal effect per layer (averaged across positions)</p>
              <div className="flex items-end gap-1 h-32">
                {layerImportance.map((val, l) => (
                  <div key={l} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-zinc-500">{val.toFixed(2)}</span>
                    <div
                      className="w-full rounded-t transition-smooth cursor-pointer"
                      style={{
                        height: `${val * 100}%`,
                        backgroundColor: viridisColor(val),
                        minHeight: '2px',
                      }}
                      onMouseEnter={() => setHoveredCell({ layer: l, pos: 0 })}
                    />
                    <span className="text-[8px] font-mono text-zinc-600">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Position Importance */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Position-wise Causal Effect</h3>
              <p className="text-[11px] text-zinc-500 mb-4">Mean causal effect per token position (averaged across layers)</p>
              <div className="flex items-end gap-2 h-24">
                {positionImportance.map((val, p) => (
                  <div key={p} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-zinc-500">{val.toFixed(2)}</span>
                    <div
                      className="w-full rounded-t transition-smooth"
                      style={{
                        height: `${val * 100}%`,
                        backgroundColor: viridisColor(val),
                        minHeight: '2px',
                      }}
                    />
                    <span className="text-[8px] font-mono text-zinc-500 truncate max-w-full">{tokens[p]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
