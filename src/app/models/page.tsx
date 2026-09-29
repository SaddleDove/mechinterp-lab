'use client';

import { useState } from 'react';
import { models, type ModelInfo } from '@/lib/data';

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  available: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  demo: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-500' },
  'coming-soon': { bg: 'bg-zinc-500/10', text: 'text-zinc-400', dot: 'bg-zinc-500' },
};

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelInfo>(models[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Model Explorer</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Browse available models, architectures, and interpretability resources</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-smooth ${viewMode === 'grid' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-smooth ${viewMode === 'table' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Model List */}
            <div className="col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {models.map(model => {
                  const status = statusColors[model.status];
                  const isSelected = selectedModel.id === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`text-left rounded-lg border p-4 transition-smooth ${
                        isSelected
                          ? 'border-teal-500/30 bg-teal-500/5'
                          : 'border-zinc-800/60 bg-zinc-900/50 hover:border-zinc-700/60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-sm font-semibold ${isSelected ? 'text-teal-300' : 'text-zinc-200'}`}>
                          {model.name}
                        </h3>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${status.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          <span className={`text-[9px] font-mono ${status.text}`}>
                            {model.status === 'available' ? 'ready' : model.status === 'demo' ? 'demo' : 'soon'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">{model.organization} · {model.year}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                          {model.params}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {model.layers}L × {model.heads}H
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Detail */}
            <div className="col-span-7 space-y-4">
              {/* Header */}
              <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-100">{selectedModel.name}</h2>
                    <p className="text-xs text-zinc-400 mt-1">{selectedModel.organization} · {selectedModel.year}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${statusColors[selectedModel.status].bg}`}>
                    <div className={`w-2 h-2 rounded-full ${statusColors[selectedModel.status].dot}`} />
                    <span className={`text-xs font-mono ${statusColors[selectedModel.status].text} capitalize`}>
                      {selectedModel.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{selectedModel.description}</p>
              </div>

              {/* Architecture Details */}
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-zinc-200 mb-4">Architecture</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Architecture</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.architecture}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Parameters</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.params}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Vocabulary Size</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.vocabSize.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Context Length</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.contextLen.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Layers</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.layers}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Attention Heads</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.heads}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">d_model</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.dModel}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">d_head</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.dHead}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">d_mlp</p>
                      <p className="text-sm font-mono text-zinc-200 mt-0.5">{selectedModel.dMlp.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Diagram */}
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-zinc-200 mb-4">Layer Structure</h3>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {/* Embedding */}
                  <div className="flex-shrink-0 w-12 h-16 rounded bg-cyan-500/10 border border-cyan-500/30 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-mono text-cyan-400">Embed</span>
                  </div>
                  <div className="flex-shrink-0 text-zinc-700">→</div>
                  {/* Transformer blocks */}
                  {Array.from({ length: Math.min(selectedModel.layers, 12) }, (_, i) => (
                    <div key={i} className="flex-shrink-0 flex flex-col gap-0.5">
                      <div className="w-10 h-7 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <span className="text-[7px] font-mono text-indigo-400">Attn</span>
                      </div>
                      <div className="w-10 h-7 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <span className="text-[7px] font-mono text-emerald-400">MLP</span>
                      </div>
                      <span className="text-[7px] font-mono text-zinc-600 text-center">L{i}</span>
                    </div>
                  ))}
                  {selectedModel.layers > 12 && (
                    <>
                      <div className="flex-shrink-0 text-zinc-600 text-xs">···</div>
                      <div className="flex-shrink-0 flex flex-col gap-0.5">
                        <div className="w-10 h-7 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <span className="text-[7px] font-mono text-indigo-400">Attn</span>
                        </div>
                        <div className="w-10 h-7 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <span className="text-[7px] font-mono text-emerald-400">MLP</span>
                        </div>
                        <span className="text-[7px] font-mono text-zinc-600 text-center">L{selectedModel.layers - 1}</span>
                      </div>
                    </>
                  )}
                  <div className="flex-shrink-0 text-zinc-700">→</div>
                  {/* Unembedding */}
                  <div className="flex-shrink-0 w-12 h-16 rounded bg-pink-500/10 border border-pink-500/30 flex flex-col items-center justify-center">
                    <span className="text-[8px] font-mono text-pink-400">Unembed</span>
                  </div>
                </div>
              </div>

              {/* Interpretability Resources */}
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Interpretability Resources</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-zinc-800/30 border border-zinc-700/30">
                    <p className="text-[11px] font-semibold text-zinc-300">Available Circuits</p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {selectedModel.id === 'gpt2-small' ? 'IOI, Greater-Than, Docstring' : 'Limited — use GPT-2 Small for full circuit analysis'}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-zinc-800/30 border border-zinc-700/30">
                    <p className="text-[11px] font-semibold text-zinc-300">SAE Availability</p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {selectedModel.id === 'gpt2-small' ? 'Illustrative SAE catalog (24K features) — not loaded' : 'None in this demo — all features are mocked'}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-zinc-800/30 border border-zinc-700/30">
                    <p className="text-[11px] font-semibold text-zinc-300">Hook Points</p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {selectedModel.layers * 2 + 2} total ({selectedModel.layers} attn + {selectedModel.layers} MLP + embed + unembed)
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-zinc-800/30 border border-zinc-700/30">
                    <p className="text-[11px] font-semibold text-zinc-300">Total Parameters</p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {selectedModel.params} (declared)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/60">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Model</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Organization</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Params</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Layers</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Heads</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">d_model</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Context</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {models.map(model => {
                  const status = statusColors[model.status];
                  return (
                    <tr
                      key={model.id}
                      className={`border-b border-zinc-800/30 cursor-pointer transition-smooth ${
                        selectedModel.id === model.id ? 'bg-teal-500/5' : 'hover:bg-zinc-800/30'
                      }`}
                      onClick={() => setSelectedModel(model)}
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-zinc-200">{model.name}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">{model.organization}</td>
                      <td className="px-4 py-3 text-xs font-mono text-zinc-300">{model.params}</td>
                      <td className="px-4 py-3 text-xs font-mono text-zinc-300">{model.layers}</td>
                      <td className="px-4 py-3 text-xs font-mono text-zinc-300">{model.heads}</td>
                      <td className="px-4 py-3 text-xs font-mono text-zinc-300">{model.dModel}</td>
                      <td className="px-4 py-3 text-xs font-mono text-zinc-300">{(model.contextLen / 1024).toFixed(0)}K</td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${status.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          <span className={`text-[10px] font-mono ${status.text} capitalize`}>{model.status}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
