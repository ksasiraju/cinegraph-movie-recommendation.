import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone';
import { Info, ZoomIn, ZoomOut, RotateCcw, Filter } from 'lucide-react';

export default function GraphCanvas({ graphStore, highlightedPath = null, onSelectNode }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    if (!containerRef.current || !graphStore) return;

    // Node styling rules by type
    const nodeColors = {
      User: { background: '#f59e0b', border: '#d97706', highlight: { background: '#fbbf24', border: '#f59e0b' } },
      Movie: { background: '#06b6d4', border: '#0891b2', highlight: { background: '#22d3ee', border: '#06b6d4' } },
      Actor: { background: '#a855f7', border: '#9333ea', highlight: { background: '#c084fc', border: '#a855f7' } },
      Director: { background: '#10b981', border: '#059669', highlight: { background: '#34d399', border: '#10b981' } },
      Genre: { background: '#f43f5e', border: '#e11d48', highlight: { background: '#fb7185', border: '#f43f5e' } }
    };

    const nodeIcons = {
      User: '👤',
      Movie: '🎬',
      Actor: '🎭',
      Director: '🎥',
      Genre: '🏷️'
    };

    const rawNodes = graphStore.getAllNodes();
    const rawEdges = graphStore.getAllEdges();

    const filteredNodes = rawNodes.filter(n => filterType === 'ALL' || n.type === filterType);
    const validNodeIds = new Set(filteredNodes.map(n => n.id));

    const nodesData = filteredNodes.map(node => {
      const isHighlighted = highlightedPath && highlightedPath.includes(node.id);
      const colorScheme = nodeColors[node.type] || nodeColors.Movie;

      return {
        id: node.id,
        label: `${nodeIcons[node.type] || ''} ${node.name || node.title}`,
        shape: node.type === 'Movie' ? 'box' : 'ellipse',
        color: isHighlighted ? { background: '#e11d48', border: '#ffffff' } : colorScheme,
        font: { color: '#ffffff', size: isHighlighted ? 16 : 13, face: 'Inter' },
        borderWidth: isHighlighted ? 3 : 1.5,
        shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8 }
      };
    });

    const edgesData = rawEdges
      .filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target))
      .map(edge => {
        const isHighlighted = highlightedPath && 
          highlightedPath.includes(edge.source) && 
          highlightedPath.includes(edge.target);

        let label = edge.relation;
        if (edge.relation === 'RATED') label = `RATED ${edge.properties.score}★`;

        return {
          id: edge.id,
          from: edge.source,
          to: edge.target,
          label,
          color: isHighlighted ? { color: '#fb7185', highlight: '#fb7185' } : { color: 'rgba(148, 163, 184, 0.3)' },
          width: isHighlighted ? 3 : 1.5,
          font: { color: '#94a3b8', size: 10, align: 'middle' },
          arrows: { to: { enabled: true, scaleFactor: 0.5 } }
        };
      });

    const data = { nodes: nodesData, edges: edgesData };

    const options = {
      nodes: {
        margin: 10,
        shadow: true
      },
      edges: {
        smooth: { type: 'continuous' }
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -35,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true
      }
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const fullNode = graphStore.getNode(nodeId);
        setSelectedNodeInfo(fullNode);
        if (onSelectNode) onSelectNode(fullNode);
      } else {
        setSelectedNodeInfo(null);
      }
    });

    return () => {
      network.destroy();
    };
  }, [graphStore, highlightedPath, filterType]);

  const handleZoomIn = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale * 1.3 });
    }
  };

  const handleZoomOut = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale * 0.7 });
    }
  };

  const handleFit = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: true });
    }
  };

  return (
    <div className="relative w-full h-[650px] rounded-2xl glass-panel overflow-hidden border border-slate-800 shadow-2xl">
      {/* Visual Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Control Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFit}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 my-auto" />

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-1.5 px-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Nodes</option>
            <option value="Movie" className="bg-slate-900">Movies</option>
            <option value="User" className="bg-slate-900">Users</option>
            <option value="Actor" className="bg-slate-900">Actors</option>
            <option value="Director" className="bg-slate-900">Directors</option>
            <option value="Genre" className="bg-slate-900">Genres</option>
          </select>
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center space-x-3 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-xs">
        <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-300">User</span></span>
        <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span><span className="text-slate-300">Movie</span></span>
        <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span><span className="text-slate-300">Actor</span></span>
        <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-slate-300">Director</span></span>
        <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-slate-300">Genre</span></span>
      </div>

      {/* Node Inspector Side Overlay */}
      {selectedNodeInfo && (
        <div className="absolute top-4 right-4 z-10 w-72 bg-slate-900/95 p-4 rounded-xl border border-slate-800 shadow-2xl backdrop-blur-md text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              {selectedNodeInfo.type} Node Details
            </span>
            <button
              onClick={() => setSelectedNodeInfo(null)}
              className="text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-indigo-400">
              {selectedNodeInfo.name || selectedNodeInfo.title}
            </h4>
            <p className="text-slate-400 font-mono text-[11px]">ID: {selectedNodeInfo.id}</p>
          </div>

          {selectedNodeInfo.type === 'Movie' && (
            <div className="space-y-2 text-slate-300">
              <p>Year: <span className="text-cyan-400 font-medium">{selectedNodeInfo.year}</span></p>
              <p>Rating: <span className="text-amber-400 font-bold">{selectedNodeInfo.rating} ★</span></p>
              <p className="line-clamp-3 text-slate-400 leading-relaxed">{selectedNodeInfo.overview}</p>
            </div>
          )}

          {selectedNodeInfo.type === 'User' && (
            <div className="text-slate-300">
              <p>Role: <span className="text-amber-400">{selectedNodeInfo.role}</span></p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
            <span>Direct Neighbors:</span>
            <span className="font-semibold text-slate-200">
              {graphStore.getNeighbors(selectedNodeInfo.id).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
