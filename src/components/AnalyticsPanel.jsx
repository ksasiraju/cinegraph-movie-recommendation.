import React from 'react';
import { BarChart2, Activity, Network, Award, PieChart } from 'lucide-react';

export default function AnalyticsPanel({ graphStore }) {
  const stats = graphStore.getStats();
  const centralities = graphStore.getDegreeCentrality();

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Nodes</span>
          <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.totalNodes}</p>
          <p className="text-[11px] text-slate-500">Movies, Users, Actors, Directors, Genres</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Edges</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.totalEdges}</p>
          <p className="text-[11px] text-slate-500">Typed property relationships</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Graph Density</span>
            <PieChart className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.density}</p>
          <p className="text-[11px] text-slate-500">Ratio of actual edges to max potential</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Node Degree</span>
            <BarChart2 className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{stats.avgDegree}</p>
          <p className="text-[11px] text-slate-500">Average connections per entity node</p>
        </div>
      </div>

      {/* Degree Centrality Ranking Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Node Centrality Rankings (Degree Power)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Nodes with highest number of incoming/outgoing relationship connections in the graph
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Entity Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Degree Count</th>
                <th className="px-4 py-3">Influence Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {centralities.slice(0, 10).map(({ node, degree }, idx) => (
                <tr key={node.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">#{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-white">{node.name || node.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
                      {node.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-cyan-400 font-bold">{degree} edges</td>
                  <td className="px-4 py-3">
                    <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, (degree / (centralities[0]?.degree || 1)) * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
