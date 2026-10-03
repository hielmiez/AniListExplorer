'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SAVE_MEDIA_LIST_ENTRY_MUTATION, GET_MEDIA_LIST_ENTRY_QUERY, ANILIST_API_URL } from '@/lib/anilist';
import { Edit2, Loader2, Plus, Check } from 'lucide-react';

interface WatchlistEditorProps {
  mediaId: number;
  maxEpisodes?: number | null;
}

export default function WatchlistEditor({
  mediaId,
  maxEpisodes
}: WatchlistEditorProps) {
  const { token, user, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [status, setStatus] = useState('CURRENT');
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line
      setIsFetching(false);
      return;
    }
    
    if (!user) {
      // Still waiting for AuthContext to fetch user profile
      return;
    }

    fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_MEDIA_LIST_ENTRY_QUERY,
        variables: { mediaId, userId: user.id }
      })
    })
    .then(res => res.json())
    .then(data => {
      const entry = data?.data?.MediaList;
      if (entry) {
        setStatus(entry.status || 'CURRENT');
        setProgress(entry.progress || 0);
        setScore(entry.score || 0);
        setHasEntry(true);
      }
    })
    .catch(console.error)
    .finally(() => setIsFetching(false));
  }, [token, user, mediaId]);

  if (!mounted) {
    return (
      <div className="h-10 w-full bg-slate-800 animate-pulse rounded-lg border border-slate-700"></div>
    );
  }

  if (!token) {
    return (
      <button 
        onClick={login}
        className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        <Plus size={18} /> Add to Watchlist
      </button>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: SAVE_MEDIA_LIST_ENTRY_MUTATION,
          variables: {
            mediaId,
            status,
            progress,
            scoreRaw: score
          }
        })
      });
      const result = await res.json();
      if (result.errors) throw new Error(result.errors[0].message);
      
      setHasEntry(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to save to watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <button disabled className="flex items-center justify-center w-full gap-2 bg-slate-800 text-slate-400 px-4 py-2 rounded-lg font-semibold cursor-not-allowed">
        <Loader2 size={18} className="animate-spin" /> Loading...
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        {hasEntry ? <><Edit2 size={18} /> Edit Watchlist</> : <><Plus size={18} /> Add to Watchlist</>}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-white mb-6">{hasEntry ? 'Edit Watchlist Entry' : 'Add to Watchlist'}</h3>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CURRENT">Watching</option>
              <option value="PLANNING">Plan to Watch</option>
              <option value="COMPLETED">Completed</option>
              <option value="DROPPED">Dropped</option>
              <option value="PAUSED">Paused</option>
            </select>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Progress {maxEpisodes ? `(Max: ${maxEpisodes})` : ''}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={maxEpisodes || undefined}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setProgress(p => p + 1)}
                disabled={maxEpisodes ? progress >= maxEpisodes : false}
                className="bg-slate-700 hover:bg-slate-600 px-4 rounded-lg font-bold text-white disabled:opacity-50"
              >
                +1
              </button>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Score (10-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="10"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || isSuccess}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
              isSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 
             isSuccess ? <><Check size={18} /> Saved!</> : 
             'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

