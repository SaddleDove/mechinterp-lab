'use client';

import { useState, useMemo } from 'react';
import { models, neuronFeatures, type NeuronFeature } from '@/lib/data';

const categoryColors: Record<string, string> = {
  syntax: '#6366f1',
  semantics: '#ec4899',
  factual: '#f59e0b',
  algorithm: '#10b981',
  format: '#06b6d4',
};

export default function NeuronsPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedNeuron, setSelectedNeuron] = useState<NeuronFeature>(neuronFeatures[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  const filteredNeurons = useMemo(() => {
    let neurons = [...neuronFeatures];
    if (filterCategory !== 'all') {
      neurons = neurons.filter(n => n.category === filterCategory);
    }
    if (selectedLayer !== null) {
      neurons = neurons.filter(n => n.layer === selectedLayer);
    }
    return neurons;
  }, [filterCategory, selectedLayer]);

  // Deterministic pseudo-random
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  // Generate activation pattern for the selected neuron across a sequence
  const activationPattern = useMemo(() => {
    const tokens = ['def', ' ', 'foobar', '(', 'x', '):', '\n', '    ', 'return', ' ', 'x', ' ', '+', ' ', '1'];
    return tokens.map((token, i) => {
      const isTopToken = selectedNeuron.topActivatingTokens.some(t =>
        token.includes(t.token.trim()) || t.token.includes(token.trim())
      );
      const r = seededRandom(i * 137 + selectedNeuron.neuronId + selectedModel.id.length * 41);
      return {
        token,
        activation: isTopToken
          ? selectedNeuron.maxActivation * (0.6 + r * 0.4)
          : r * selectedNeuron.maxActivation * 0.15,
      };
    });
  }, [selectedNeuron, selectedModel.id]);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Neuron Analysis</h1>
              <p className="text-xs text-zinc-500 mt-0.5">MLP neuron feature detection — individual neuron activation patterns</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const next = models.find(m => m.id === e.target.value) || models[0];
                  setSelectedModel(next);
                  // A layer filter from a deeper model would empty the list on a shallower one.
                  setSelectedLayer(null);
                }}
                className="text-xs bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-1.5 text-zinc-300 font-mono"
              >
                {models.filter(m => m.status === 'available').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
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
            {/* Category Filter */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Category</h3>
              <div className="space-y-1">
                {['all', 'syntax', 'semantics', 'factual', 'algorithm', 'format'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] transition-smooth ${
                      filterCategory === cat
                        ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    {cat !== 'all' && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                    )}
                    <span className="capitalize">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Filter */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Layer Filter</h3>
              <div className="grid grid-cols-6 gap-1">
                <button
                  onClick={() => setSelectedLayer(null)}
                  className={`py-1.5 rounded text-[10px] font-mono transition-smooth ${
                    selectedLayer === null
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : 'bg-zinc-800/30 text-zinc-500 border border-zinc-700/20'
                  }`}
                >
                  All
                </button>
                {Array.from({ length: selectedModel.layers }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedLayer(i)}
                    className={`py-1.5 rounded text-[10px] font-mono transition-smooth ${
                      selectedLayer === i
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-zinc-800/30 text-zinc-500 border border-zinc-700/20'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Neuron List */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Neurons ({filteredNeurons.length})
              </h3>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {filteredNeurons.map(neuron => (
                  <button
                    key={neuron.neuronId}
                    onClick={() => setSelectedNeuron(neuron)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-smooth ${
                      selectedNeuron.neuronId === neuron.neuronId
                        ? 'bg-pink-500/10 border border-pink-500/25'
                        : 'border border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[neuron.category] }} />
                        <span className="text-[11px] font-mono text-zinc-300">{neuron.label}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-600">L{neuron.layer}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main panel */}
          <div className="col-span-9 space-y-4">
            {/* Neuron Detail */}
            <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[selectedNeuron.category] }} />
                    <h2 className="text-base font-semibold text-zinc-100 font-mono">{selectedNeuron.label}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 capitalize">
                      {selectedNeuron.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">{selectedNeuron.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500">Neuron ID</p>
                  <p className="text-sm font-mono text-zinc-300">#{selectedNeuron.neuronId}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800/40">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Layer</p>
                  <p className="text-lg font-mono text-zinc-200">{selectedNeuron.layer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Max Activation</p>
                  <p className="text-lg font-mono text-pink-400">{selectedNeuron.maxActivation.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Model</p>
                  <p className="text-lg font-mono text-zinc-200">{selectedModel.name}</p>
                </div>
              </div>
            </div>

            {/* Activation Pattern */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Activation Pattern</h3>
              <p className="text-[11px] text-zinc-500 mb-4">Neuron activation across a sample sequence</p>
              <div className="flex items-end gap-0.5">
                {activationPattern.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t transition-smooth"
                      style={{
                        height: `${(item.activation / selectedNeuron.maxActivation) * 120}px`,
                        backgroundColor: item.activation > selectedNeuron.maxActivation * 0.5
                          ? categoryColors[selectedNeuron.category]
                          : '#27272a',
                        opacity: item.activation > selectedNeuron.maxActivation * 0.5 ? 0.8 : 0.4,
                      }}
                    />
                    <span className={`text-[9px] font-mono truncate max-w-full ${
                      item.activation > selectedNeuron.maxActivation * 0.5 ? 'text-zinc-300' : 'text-zinc-600'
                    }`}>
                      {item.token || '·'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Activating Tokens */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-4">Top Activating Tokens</h3>
              <div className="space-y-2">
                {selectedNeuron.topActivatingTokens.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-600 w-4">{i + 1}</span>
                    <code className="text-xs font-mono text-zinc-200 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700/30 min-w-[100px]">
                      {item.token.trim().length === 0 ? '␣ whitespace' : item.token}
                    </code>
                    <div className="flex-1 h-5 bg-zinc-800/30 rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-smooth"
                        style={{
                          width: `${(item.activation / selectedNeuron.maxActivation) * 100}%`,
                          backgroundColor: categoryColors[selectedNeuron.category],
                          opacity: 0.6 + (item.activation / selectedNeuron.maxActivation) * 0.4,
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 w-12 text-right">
                      {item.activation.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer Activation Map */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Activation Strength by Layer</h3>
              <p className="text-[11px] text-zinc-500 mb-4">
                This neuron&apos;s activation across the model&apos;s layers (ring marks the neuron&apos;s own layer, L{selectedNeuron.layer})
              </p>
              <div className="grid grid-cols-12 gap-0.5">
                {Array.from({ length: selectedModel.layers }, (_, l) => {
                  const isThisNeuron = l === selectedNeuron.layer;
                  const intensity = isThisNeuron ? 1 : seededRandom(l * 73 + selectedNeuron.neuronId);
                  return (
                    <div
                      key={l}
                      className={`aspect-square rounded-sm flex items-center justify-center transition-smooth ${
                        isThisNeuron ? 'ring-1 ring-white/50' : ''
                      }`}
                      style={{
                        backgroundColor: categoryColors[selectedNeuron.category],
                        opacity: isThisNeuron ? 1 : 0.22 + intensity * 0.45,
                      }}
                    >
                      <span className="text-[8px] font-mono text-white/60">{l}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
