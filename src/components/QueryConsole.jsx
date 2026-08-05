import React, { useState } from 'react';
import { Terminal, Play, Database, Code, CheckCircle2, Sparkles, Network } from 'lucide-react';
import { executeCypherQuery } from '../graph/recommendationEngine';

export default function QueryConsole({ graphStore }) {
  const [queryText, setQueryText] = useState("MATCH (u:User {name: 'Alice Chen'})-[:FRIEND_WITH]->(f:User)-[:WATCHED]->(m:Movie) RETURN f.name AS Friend, m.title AS Recommendation");
  const [queryResult, setQueryResult] = useState(null);

  const sampleQueries = [
    { 
      label: 'Multi-Hop (2 Hops): Friends of Friends Watched',
      query: "MATCH (u:User {name: 'Alice Chen'})-[:FRIEND_WITH]->(f:User)-[:WATCHED]->(m:Movie) RETURN f.name AS Friend, m.title AS Recommendation"
    },
    { 
      label: 'Multi-Hop (3 Hops): Actor & Genre Multi-Hop Walk', 
      query: "MATCH (u:User {name: 'Alice Chen'})-[:WATCHED]->(m1:Movie)<-[:ACTED_IN]-(a:Actor)-[:ACTED_IN]->(m2:Movie)-[:BELONGS_TO]->(g:Genre) RETURN a.name AS Actor, m2.title AS RecommendedMovie, g.name AS Genre" 
    },
    { 
      label: 'SQL-Hard Query: Shortest Path Traversal', 
      query: "MATCH path = shortestPath((u1:User {name: 'Alice Chen'})-[*..5]-(u2:User {name: 'Bob Smith'})) RETURN path" 
    },
    { 
      label: 'All User Movie Ratings', 
      query: 'MATCH (u:User)-[:WATCHED]->(m:Movie) RETURN u.name AS User, m.title AS Movie' 
    },
    { 
      label: 'Director & Movie Graph Connections', 
      query: 'MATCH (d:Director)-[:DIRECTED]->(m:Movie) RETURN d.name AS Director, m.title AS Movie' 
    }
  ];

  const handleRunQuery = () => {
    const res = executeCypherQuery(graphStore, queryText);
    setQueryResult(res);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Cypher Graph Query Engine</span>
          </h2>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Cypher Pattern Matcher</span>
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Execute multi-hop graph pattern matching queries. Graph databases traverse relationship pointers without high-cost SQL JOIN tables.
        </p>

        {/* Sample Templates */}
        <div className="space-y-2 pt-2">
          <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>Preset Cypher Queries (Click to load):</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryText(item.query);
                  setQueryResult(executeCypherQuery(graphStore, item.query));
                }}
                className="text-xs bg-slate-900 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-300 px-3 py-2 rounded-xl border border-slate-800 hover:border-indigo-500/40 font-mono transition-all text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Editor */}
        <div className="relative pt-2">
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 text-emerald-400 font-mono text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/50 resize-none shadow-inner"
            placeholder="Write Cypher query here... e.g. MATCH (u:User)-[:WATCHED]->(m:Movie)"
          />
          <button
            onClick={handleRunQuery}
            className="absolute bottom-4 right-4 flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Execute Cypher Query</span>
          </button>
        </div>
      </div>

      {/* Query Results Table */}
      {queryResult && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-3">
          <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Query Results ({queryResult.rows.length} records returned)</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/40 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  {queryResult.columns.map((col, idx) => (
                    <th key={idx} className="px-6 py-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {queryResult.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-6 py-3 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
