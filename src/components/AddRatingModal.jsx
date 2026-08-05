import React, { useState } from 'react';
import { X, Star, PlusCircle } from 'lucide-react';

export default function AddRatingModal({ graphStore, selectedUser, targetMovie = null, onClose, onRatingAdded }) {
  const [selectedMovieId, setSelectedMovieId] = useState(targetMovie?.id || '');
  const [ratingScore, setRatingScore] = useState(5);

  const movies = graphStore.getAllNodes().filter(n => n.type === 'Movie');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMovieId) return;

    graphStore.addEdge(selectedUser.id, selectedMovieId, 'RATED', { score: Number(ratingScore) });
    onRatingAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 text-slate-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <span>Add Graph Rating Edge</span>
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Active User */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold">Rating User:</label>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-bold text-amber-400">
              {selectedUser.name} ({selectedUser.role})
            </div>
          </div>

          {/* Select Movie */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold">Select Movie:</label>
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">-- Choose a Movie --</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.year})
                </option>
              ))}
            </select>
          </div>

          {/* Rating Score */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold">Rating Score: {ratingScore} ★</label>
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingScore(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= ratingScore
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/30"
            >
              Connect RATED Edge in Graph
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
