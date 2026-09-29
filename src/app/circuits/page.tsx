'use client';

import { useState } from 'react';
import { circuits, type Circuit, type CircuitNode } from '@/lib/data';

const nodeTypeColors: Record<string, string> = {
  attention: '#6366f1',
  mlp: '#10b981',
  embedding: '#06b6d4',
  output: '#ec4899',
};

export default function CircuitsPage() {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>(circuits[0]);
  const [hoveredNode, setHoveredNode] = useState<CircuitNode | null>(null);

  // Layout positions for circuit nodes
  const getNodePosition = (node: CircuitNode) => {
    const typeGroups: Record<string, CircuitNode[]> = { embedding: [], attention: [], mlp: [], output: [] };
    selectedCircuit.nodes.forEach(n => {
      if (typeGroups[n.type]) typeGroups[n.type].push(n);
    });

    const typeOrder = ['embedding', 'attention', 'mlp', 'output'];
    const typeIdx = typeOrder.indexOf(node.type);
    const nodesInType = typeGroups[node.type] || [];
    const idxInType = nodesInType.findIndex(n => n.id === node.id);

    const x = 80 + typeIdx * 180;
    const y = 60 + idxInType * 80;
    return { x, y };
  };

  // Grow the viewBox so the deepest column is never clipped.
  const svgHeight = Math.max(
    400,
    ...selectedCircuit.nodes.map(n => getNodePosition(n).y + 60),
  );

  return (
    <div className="min-h-screen bg-grid">
      {/* Header */}
      <div className="border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Circuit Analysis</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Visualize computational circuits — the algorithms transformers implement</p>
            </div>
            <div className="flex items-center gap-3">
              {circuits.map(circuit => (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuit(circuit)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-smooth ${
                    selectedCircuit.id === circuit.id
                      ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                      : 'text-zinc-500 hover:text-zinc-300 border border-zinc-700/30'
                  }`}
                >
                  {circuit.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel */}
          <div className="col-span-3 space-y-4">
            {/* Circuit Info */}
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
              <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
                {selectedCircuit.name}
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{selectedCircuit.description}</p>
              <div className="mt-3 pt-3 border-t border-zinc-800/40 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Model</span>
                  <span className="text-zinc-300 font-mono">{selectedCircuit.model}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Nodes</span>
                  <span className="text-zinc-300 font-mono">{selectedCircuit.nodes.length}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Edges</span>
                  <span className="text-zinc-300 font-mono">{selectedCircuit.edges.length}</span>
                </div>
              </div>
            </div>

            {/* Task */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Task</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">{selectedCircuit.task}</p>
            </div>

            {/* Node Legend */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Node Types</h3>
              <div className="space-y-2">
                {Object.entries(nodeTypeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: color, opacity: 0.7 }} />
                    <span className="text-[11px] text-zinc-400 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hovered Node Detail */}
            {hoveredNode && (
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-4">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Node Detail</h3>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded" style={{ backgroundColor: nodeTypeColors[hoveredNode.type] }} />
                    <span className="text-zinc-200 font-mono">{hoveredNode.label}</span>
                  </div>
                  <p className="text-zinc-500">{hoveredNode.description}</p>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Layer</span>
                    <span className="text-zinc-300 font-mono">{hoveredNode.layer}</span>
                  </div>
                  {hoveredNode.head !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Head</span>
                      <span className="text-zinc-300 font-mono">{hoveredNode.head}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Importance</span>
                    <span className="text-violet-400 font-mono">{(hoveredNode.importance * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main visualization */}
          <div className="col-span-9 space-y-6">
            {/* Circuit Graph */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-4">Circuit Graph</h3>
              <div className="relative overflow-x-auto" style={{ minHeight: `${svgHeight}px` }}>
                <svg width="100%" height={svgHeight} viewBox={`0 0 900 ${svgHeight}`}>
                  {/* Edges */}
                  {selectedCircuit.edges.map((edge, i) => {
                    const sourceNode = selectedCircuit.nodes.find(n => n.id === edge.source);
                    const targetNode = selectedCircuit.nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    const sourcePos = getNodePosition(sourceNode);
                    const targetPos = getNodePosition(targetNode);
                    const isHighlighted = hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target);

                    return (
                      <g key={i}>
                        <line
                          x1={sourcePos.x + 50}
                          y1={sourcePos.y + 20}
                          x2={targetPos.x}
                          y2={targetPos.y + 20}
                          stroke={isHighlighted ? '#a78bfa' : '#3f3f46'}
                          strokeWidth={isHighlighted ? 2 : 1}
                          strokeOpacity={isHighlighted ? 0.8 : 0.3 + edge.strength * 0.4}
                          markerEnd="url(#arrowhead)"
                        />
                        {isHighlighted && (
                          <text
                            x={(sourcePos.x + 50 + targetPos.x) / 2}
                            y={(sourcePos.y + 20 + targetPos.y + 20) / 2 - 8}
                            textAnchor="middle"
                            className="text-[9px] fill-violet-400 font-mono"
                          >
                            {edge.type} ({edge.strength.toFixed(2)})
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Arrow marker */}
                  <defs>
                    <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                      <polygon points="0 0, 6 2, 0 4" fill="#52525b" />
                    </marker>
                  </defs>

                  {/* Nodes */}
                  {selectedCircuit.nodes.map((node) => {
                    const pos = getNodePosition(node);
                    const color = nodeTypeColors[node.type];
                    const isHovered = hoveredNode?.id === node.id;

                    return (
                      <g
                        key={node.id}
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className="cursor-pointer"
                      >
                        <rect
                          x={pos.x}
                          y={pos.y}
                          width="100"
                          height="40"
                          rx="6"
                          fill={isHovered ? `${color}20` : '#18181b'}
                          stroke={color}
                          strokeWidth={isHovered ? 2 : 1}
                          strokeOpacity={isHovered ? 0.8 : 0.4}
                        />
                        <text
                          x={pos.x + 50}
                          y={pos.y + 16}
                          textAnchor="middle"
                          className="text-[9px] fill-zinc-200 font-mono"
                        >
                          {node.label.length > 16 ? node.label.slice(0, 14) + '...' : node.label}
                        </text>
                        <text
                          x={pos.x + 50}
                          y={pos.y + 30}
                          textAnchor="middle"
                          className="text-[8px] fill-zinc-500 font-mono"
                        >
                          L{node.layer}{node.head !== undefined ? ` H${node.head}` : ''}
                        </text>
                        {/* Importance indicator */}
                        <rect
                          x={pos.x}
                          y={pos.y + 36}
                          width={100 * node.importance}
                          height="3"
                          rx="1"
                          fill={color}
                          opacity={0.6}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Node Importance Ranking */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-4">Component Importance</h3>
              <div className="space-y-2">
                {[...selectedCircuit.nodes]
                  .sort((a, b) => b.importance - a.importance)
                  .map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center gap-3 cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: nodeTypeColors[node.type], opacity: 0.7 }} />
                      <span className="text-[11px] font-mono text-zinc-300 w-48 truncate">{node.label}</span>
                      <div className="flex-1 h-4 bg-zinc-800/30 rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-smooth"
                          style={{
                            width: `${node.importance * 100}%`,
                            backgroundColor: nodeTypeColors[node.type],
                            opacity: 0.6,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 w-12 text-right">
                        {(node.importance * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* References */}
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">References</h3>
              <ul className="space-y-2">
                {selectedCircuit.references.map((ref, i) => (
                  <li key={i} className="text-[11px] text-zinc-500 leading-relaxed pl-3 border-l border-zinc-800/60">
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
