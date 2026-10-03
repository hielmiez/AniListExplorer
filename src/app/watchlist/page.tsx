'use client';

import { useAuth } from '@/contexts/AuthContext';
import { GET_USER_WATCHLIST_QUERY } from '@/lib/anilist';
import { useEffect, useState } from 'react';
import AnimeCard from '@/components/AnimeCard';
import { Bookmark, Lock } from 'lucide-react';

export default function WatchlistPage() {
  const { user, token, login } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: GET_USER_WATCHLIST_QUERY,
        variables: { userId: user.id }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.data?.MediaListCollection?.lists) {
        setLists(data.data.MediaListCollection.lists);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user, token]);

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
        <Lock className="w-16 h-16 text-slate-700 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Login Required</h1>
        <p className="text-slate-400 mb-8 text-center max-w-md">
          You need to connect your AniList account to view and manage your personal watchlists.
        </p>
        <button 
          onClick={login}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-900/20"
        >
          Login with AniList
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-8">
      <div className="max-w-[1400px] mx-auto pb-10">
        <header className="mb-12 mt-4 flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-xl">
            <Bookmark className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              My Watchlists
            </h1>
            <p className="text-slate-400">
              {user ? `Synced with ${user.name}'s AniList account` : 'Loading...'}
            </p>
          </div>
        </header>

        {loading ? (
          <div className="text-center p-12 text-slate-500">Syncing watchlists...</div>
        ) : lists.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400">No watchlists found on your AniList account.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {lists.map(list => (
              <section key={list.name}>
                <h2 className="text-2xl font-bold mb-6 text-slate-100 border-b border-slate-800 pb-2">
                  {list.name} <span className="text-slate-500 text-lg font-medium ml-2">({list.entries.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {list.entries.map((entry: any) => (
                    <div key={entry.id} className="relative group">
                      <AnimeCard anime={entry.media} view="grid" />
                      {/* Entry Metadata overlay */}
                      <div className="absolute top-1 left-1 right-1 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md border border-slate-700">
                          EP: {entry.progress} {entry.media.episodes ? `/ ${entry.media.episodes}` : ''}
                        </div>
                        {entry.score > 0 && (
                          <div className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md shadow-md">
                            ★ {entry.score}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
