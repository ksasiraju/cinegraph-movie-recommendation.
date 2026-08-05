import React from 'react';
import { X, Star, Clock, Calendar, Film, User, Tag, Award } from 'lucide-react';

export default function MovieDetailsModal({ movie, graphStore, onClose, onAddRating }) {
  if (!movie) return null;

  // Find connected Director, Actors, Genres in graph
  const neighbors = graphStore.getNeighbors(movie.id);
  const directorNode = neighbors.find(n => n.node.type === 'Director')?.node;
  const actorNodes = neighbors.filter(n => n.node.type === 'Actor').map(n => n.node);
  const genreNodes = neighbors.filter(n => n.node.type === 'Genre').map(n => n.node);
  const ratingEdges = graphStore.getEdgesForNode(movie.id).filter(e => e.relation === 'RATED');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100 space-y-0">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Backdrop & Title */}
        <div className="relative h-64 w-full bg-slate-950">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover opacity-40 blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">{movie.title}</h2>
            </div>

            <div className="flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 font-extrabold px-3 py-1.5 rounded-xl border border-amber-500/30 text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{movie.rating} / 10</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Synopsis</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{movie.overview}</p>
          </div>

          {/* Graph Entities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Director */}
            {directorNode && (
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Director Node</span>
                <p className="text-sm font-bold text-emerald-400">{directorNode.name}</p>
              </div>
            )}

            {/* Genres */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Genre Nodes</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {genreNodes.map(g => (
                  <span key={g.id} className="text-xs px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-medium">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Cast Actors */}
          {actorNodes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Cast Nodes</h4>
              <div className="flex flex-wrap gap-2">
                {actorNodes.map(a => (
                  <div key={a.id} className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-slate-200">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings in Graph */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold">User Graph Ratings ({ratingEdges.length})</h4>
            <div className="space-y-1.5">
              {ratingEdges.map(e => {
                const u = graphStore.getNode(e.source);
                return (
                  <div key={e.id} className="flex items-center justify-between bg-slate-950/40 px-3 py-2 rounded-lg text-xs">
                    <span className="text-slate-300 font-medium">{u?.name || 'User'}</span>
                    <span className="text-amber-400 font-bold">{e.properties.score} ★</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer Action */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              onClose();
              onAddRating(movie);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
          >
            Rate This Movie
          </button>
        </div>

      </div>
    </div>
  );
}
