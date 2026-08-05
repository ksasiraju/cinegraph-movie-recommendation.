import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import GraphCanvas from './components/GraphCanvas';
import RecommendationList from './components/RecommendationList';
import QueryConsole from './components/QueryConsole';
import AnalyticsPanel from './components/AnalyticsPanel';
import MovieDetailsModal from './components/MovieDetailsModal';
import AddRatingModal from './components/AddRatingModal';

import { INITIAL_DATASET } from './data/movieDataset';
import { GraphStore } from './graph/GraphStore';
import { getRecommendations } from './graph/recommendationEngine';

export default function App() {
  // Initialize Graph Store once
  const [graphStore] = useState(() => new GraphStore(INITIAL_DATASET));
  const [graphVersion, setGraphVersion] = useState(0); // Trigger re-render on graph mutations

  const users = INITIAL_DATASET.users;
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [activeTab, setActiveTab] = useState('recommendations'); // recommendations | graph | cypher | analytics
  const [algoMode, setAlgoMode] = useState('hybrid'); // hybrid | collaborative | content | pagerank

  // Modals & Highlights
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isAddRatingOpen, setIsAddRatingOpen] = useState(false);
  const [targetMovieForRating, setTargetMovieForRating] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState(null);

  // Re-calculate recommendations dynamically when user, algoMode, or graph changes
  const recommendations = useMemo(() => {
    // depend on graphVersion to re-evaluate
    return getRecommendations(graphStore, selectedUser.id, algoMode);
  }, [graphStore, selectedUser.id, algoMode, graphVersion]);

  const handleRatingAdded = () => {
    setGraphVersion(v => v + 1);
  };

  const handleHighlightPath = (path) => {
    setHighlightedPath(path);
    setActiveTab('graph');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUser={selectedUser}
        users={users}
        setSelectedUser={setSelectedUser}
        onOpenAddRating={() => {
          setTargetMovieForRating(null);
          setIsAddRatingOpen(true);
        }}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <RecommendationList
            recommendations={recommendations}
            selectedUser={selectedUser}
            algoMode={algoMode}
            setAlgoMode={setAlgoMode}
            onSelectMovie={(movie) => setSelectedMovie(movie)}
            onHighlightPath={handleHighlightPath}
          />
        )}

        {/* Visual Graph Canvas Tab */}
        {activeTab === 'graph' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Interactive Graph Explorer</h2>
                <p className="text-xs text-slate-400">Drag nodes, inspect properties, or view animated recommendation paths</p>
              </div>
              {highlightedPath && (
                <button
                  onClick={() => setHighlightedPath(null)}
                  className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                >
                  Clear Path Highlight
                </button>
              )}
            </div>
            <GraphCanvas
              graphStore={graphStore}
              highlightedPath={highlightedPath}
              onSelectNode={(node) => {
                if (node && node.type === 'Movie') setSelectedMovie(node);
              }}
            />
          </div>
        )}

        {/* Cypher Query Console Tab */}
        {activeTab === 'cypher' && (
          <QueryConsole graphStore={graphStore} />
        )}

        {/* Analytics & Metrics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsPanel graphStore={graphStore} />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full glass-panel border-t border-slate-800/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          CineGraph • Graph Database & Recommendation Engine • Powered by Property Graph Traversal & PageRank
        </div>
      </footer>

      {/* Modals */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          graphStore={graphStore}
          onClose={() => setSelectedMovie(null)}
          onAddRating={(movie) => {
            setTargetMovieForRating(movie);
            setIsAddRatingOpen(true);
          }}
        />
      )}

      {isAddRatingOpen && (
        <AddRatingModal
          graphStore={graphStore}
          selectedUser={selectedUser}
          targetMovie={targetMovieForRating}
          onClose={() => setIsAddRatingOpen(false)}
          onRatingAdded={handleRatingAdded}
        />
      )}

    </div>
  );
}
