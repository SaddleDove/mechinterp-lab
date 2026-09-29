'use client';

import { useState, useMemo } from 'react';
import { saeFeatures, type SAEFeature } from '@/lib/data';

const categories = ['All', 'Domain', 'Formatting', 'Token Type', 'Semantics', 'Grammar', 'NER', 'Discourse', 'Circuit', 'Algorithm'];

const categoryColors: Record<string, string> = {
  Domain: '#6366f1',
  Formatting: '#10b981',
  'Token Type': '#f59e0b',
  Semantics: '#ec4899',
  Grammar: '#06b6d4',
  NER: '#8b5cf6',
  Discourse: '#f97316',
  Circuit: '#e11d48',
  Algorithm: '#14b8a6',
};

// Deterministic pseudo-random
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export default function SAEPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFeature, setSelectedFeature] = useState<SAEFeature>(saeFeatures[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'frequency' | 'activation' | 'layer'>('layer');

  const filteredFeatures = useMemo(() => {
    let features = [...saeFeatures];
    if (selectedCategory !== 'All') {
      features = features.filter(f => f.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      features = features.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.topTokens.some(t => t.token.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case 'frequency':
        features.sort((a, b) => b.frequency - a.frequency);
        break;
      case 'activation':
        features.sort((a, b) => b.maxActivation - a.maxActivation);
        break;
      case 'layer':
        features.sort((a, b) => a.layer - b.layer);
        break;
    }
    return features;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">SAE Feature Browser</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Sparse Autoencoder features — interpretable directions in activation space</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-1.5 text-zinc-300 w-48 placeholder:text-zinc-600"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs bg-zinc-800/50 border border-zinc-700/50 rounded-md px-3 py-1.5 text-zinc-300"
              >
                <option value="layer">Sort by Layer</option>
                <option value="frequency">Sort by Frequency</option>
                <option value="activation">Sort by Max Activation</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel - Feature list */}
          <div className="col-span-4 space-y-4">
            {/* Category Filter */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Categories</h3>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-smooth ${
                      selectedCategory === cat
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'bg-zinc-800/30 text-zinc-500 border border-zinc-700/20 hover:text-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature List */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Features ({filteredFeatures.length})
              </h3>
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                {filteredFeatures.map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature)}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-smooth ${
                      selectedFeature.id === feature.id
                        ? 'bg-emerald-500/10 border border-emerald-500/25'
                        : 'border border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: categoryColors[feature.category] || '#6366f1' }}
                        />
                        <span className={`text-xs font-mono ${
                          selectedFeature.id === feature.id ? 'text-emerald-300' : 'text-zinc-300'
                        }`}>
                          {feature.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600">L{feature.layer}</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1 truncate">{feature.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - Feature detail */}
          <div className="col-span-8 space-y-4">
            {/* Feature Header */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[selectedFeature.category] || '#6366f1' }}
                    />
                    <h2 className="text-base font-semibold text-zinc-100 font-mono">{selectedFeature.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/50 text-zinc-400 border border-zinc-700/30">
                      {selectedFeature.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{selectedFeature.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500">Feature ID</p>
                  <p className="text-sm font-mono text-zinc-300">#{selectedFeature.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-zinc-800/40">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Layer</p>
                  <p className="text-lg font-mono text-zinc-200">{selectedFeature.layer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Frequency</p>
                  <p className="text-lg font-mono text-zinc-200">{(selectedFeature.frequency * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Max Activation</p>
                  <p className="text-lg font-mono text-emerald-400">{selectedFeature.maxActivation.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Top Activating Tokens */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-4">Top Activating Tokens</h3>
              <div className="space-y-2">
                {selectedFeature.topTokens.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-600 w-4">{i + 1}</span>
                    <code className="text-xs font-mono text-zinc-200 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700/30 min-w-[80px]">
                      {item.token}
                    </code>
                    <div className="flex-1 h-5 bg-zinc-800/30 rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-smooth"
                        style={{
                          width: `${item.weight * 100}%`,
                          backgroundColor: categoryColors[selectedFeature.category] || '#6366f1',
                          opacity: 0.6 + (item.weight * 0.4),
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 w-12 text-right">
                      {item.weight.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activation Distribution */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Activation Distribution</h3>
              <p className="text-[11px] text-zinc-500 mb-4">Histogram of feature activations across the corpus</p>
              <div className="flex items-end gap-0.5 h-32">
                {Array.from({ length: 40 }, (_, i) => {
                  // Simulate a sparse distribution (most activations near 0) - deterministic
                  const x = i / 40;
                  const r = seededRandom(i * 53 + selectedFeature.id * 7);
                  const density = Math.exp(-x * 5) * (1 + r * 0.3);
                  const height = density * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t transition-smooth"
                      style={{
                        height: `${height}%`,
                        backgroundColor: i > 30
                          ? (categoryColors[selectedFeature.category] || '#6366f1')
                          : '#27272a',
                        opacity: i > 30 ? 0.7 : 0.5,
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] font-mono text-zinc-600">0.0</span>
                <span className="text-[9px] font-mono text-zinc-600">{(selectedFeature.maxActivation / 2).toFixed(1)}</span>
                <span className="text-[9px] font-mono text-zinc-600">{selectedFeature.maxActivation.toFixed(1)}</span>
              </div>
            </div>

            {/* Feature Geometry */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Feature Geometry</h3>
              <p className="text-[11px] text-zinc-500 mb-4">Cosine similarity with other features in the same layer</p>
              <div className="grid grid-cols-6 gap-2">
                {saeFeatures.filter(f => f.layer === selectedFeature.layer && f.id !== selectedFeature.id).slice(0, 6).map((f, idx) => {
                  const similarity = seededRandom(f.id * 31 + selectedFeature.id * 17 + idx) * 0.3 - 0.1; // mostly near-zero (sparse)
                  return (
                    <div key={f.id} className="text-center">
                      <div
                        className="w-full aspect-square rounded-md border border-zinc-800/40 flex items-center justify-center mb-1"
                        style={{
                          backgroundColor: similarity > 0
                            ? `rgba(16, 185, 129, ${similarity * 2})`
                            : `rgba(239, 68, 68, ${Math.abs(similarity) * 2})`,
                        }}
                      >
                        <span className="text-[10px] font-mono text-zinc-300">{similarity.toFixed(2)}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 truncate block">{f.name}</span>
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
