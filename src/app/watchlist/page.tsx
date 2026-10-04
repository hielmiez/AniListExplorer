'use client';

import { useAuth } from '@/contexts/AuthContext';
import { GET_USER_WATCHLIST_QUERY } from '@/lib/anilist';
import { useEffect, useState, useMemo } from 'react';
import AnimeCard from '@/components/AnimeCard';
import { Bookmark, Lock, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function WatchlistPage() {
  const { user, token, login } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36; // 6 columns * 6 rows

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

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
        const fetchedLists = data.data.MediaListCollection.lists;
        
        // Sort lists to prioritize 'Watching' and 'Plan to Watch'
        const priority: Record<string, number> = {
          "Watching": 1,
          "Plan to Watch": 2,
          "Planning": 2
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sortedLists = [...fetchedLists].sort((a: any, b: any) => {
          const aPriority = priority[a.name] || 99;
          const bPriority = priority[b.name] || 99;
          if (aPriority !== bPriority) return aPriority - bPriority;
          return a.name.localeCompare(b.name);
        });

        setLists(sortedLists);
        if (sortedLists.length > 0) {
          setActiveTab(sortedLists[0].name);
        }
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user, token]);

  // Reset pagination when changing tab or searching
  useEffect(() => {
    // eslint-disable-next-line
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Filter & Paginate
  const activeList = lists.find(l => l.name === activeTab);
  
  const filteredEntries = useMemo(() => {
    if (!activeList) return [];
    if (!searchQuery.trim()) return activeList.entries;
    
    const query = searchQuery.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return activeList.entries.filter((entry: any) => {
      const title = entry.media.title;
      return (
        title.english?.toLowerCase().includes(query) ||
        title.romaji?.toLowerCase().includes(query) ||
        title.native?.toLowerCase().includes(query)
      );
    });
  }, [activeList, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / itemsPerPage));
  const currentEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

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
        <header className="mb-8 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-xl flex-shrink-0">
              <Bookmark className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                My Watchlists
              </h1>
              <p className="text-slate-400 text-sm">
                {user ? `Synced with ${user.name}'s AniList account` : 'Loading...'}
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          {!loading && lists.length > 0 && (
            <div className="relative w-full md:w-72 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          )}
        </header>

        {loading ? (
          <div className="text-center p-12 text-slate-500 flex justify-center items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Syncing watchlists...
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center p-12 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400">No watchlists found on your AniList account.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
              {lists.map(list => (
                <button
                  key={list.name}
                  onClick={() => setActiveTab(list.name)}
                  className={`px-5 py-2.5 rounded-t-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === list.name 
                      ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {list.name} <span className="ml-1.5 opacity-60 text-xs">({list.entries.length})</span>
                </button>
              ))}
            </div>

            {/* List Content */}
            {activeList && (
              <div className="min-h-[400px]">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                    No anime found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {currentEntries.map((entry: any) => (
                        <div key={entry.id} className="relative group">
                          <AnimeCard anime={entry.media} view="grid" />
                          {/* Entry Metadata overlay */}
                          <div className="absolute top-1 left-1 right-1 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-slate-900/95 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md border border-slate-700 shadow-lg">
                              EP: {entry.progress} {entry.media.episodes ? `/ ${entry.media.episodes}` : ''}
                            </div>
                            {entry.score > 0 && (
                              <div className="bg-blue-600/95 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md shadow-lg">
                                ★ {entry.score}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-8 bg-slate-900/50 py-3 px-6 rounded-xl border border-slate-800 w-fit mx-auto">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-slate-300"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="text-sm font-medium text-slate-400 min-w-[100px] text-center">
                          Page <span className="text-white">{currentPage}</span> of {totalPages}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-slate-300"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
