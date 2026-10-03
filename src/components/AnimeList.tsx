'use client';

import { useState, useEffect, useRef } from 'react';
import AnimeCard from './AnimeCard';
import { fetchNextPage } from '@/app/actions';

interface AnimeListProps {
  initialAnime: React.ComponentProps<typeof AnimeCard>['anime'][];
  initialPageInfo: {
    hasNextPage: boolean;
  };
  variables: Record<string, unknown>;
  view: 'grid' | 'list';
}

export default function AnimeList({ initialAnime, initialPageInfo, variables, view }: AnimeListProps) {
  const [anime, setAnime] = useState(initialAnime);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(initialPageInfo?.hasNextPage || false);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Derive state from props (reset on filter change)
  const [prevInitial, setPrevInitial] = useState(initialAnime);
  if (initialAnime !== prevInitial) {
    setPrevInitial(initialAnime);
    setAnime(initialAnime);
    setPage(1);
    setHasNextPage(initialPageInfo?.hasNextPage || false);
  }

  async function loadMore() {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const data = await fetchNextPage({ ...variables, page: nextPage });
      const newAnime = data.Page?.media || [];
      const newPageInfo = data.Page?.pageInfo;
      
      setAnime((prev) => {
        const existingIds = new Set(prev.map(a => a.id));
        const uniqueNew = newAnime.filter((a: React.ComponentProps<typeof AnimeCard>['anime']) => !existingIds.has(a.id));
        return [...prev, ...uniqueNew];
      });
      setPage(nextPage);
      setHasNextPage(newPageInfo?.hasNextPage || false);
    } catch (error) {
      console.error("Failed to load more anime:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage, loading, page, variables]);

  if (anime.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 text-xl font-medium bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-inner">
        No anime found matching your criteria.
      </div>
    );
  }

  return (
    <>
      <div className={
        view === 'list' 
          ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
      }>
        {anime.map((a: React.ComponentProps<typeof AnimeCard>['anime']) => (
          <AnimeCard key={a.id} anime={a} view={view} />
        ))}
      </div>
      
      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center p-12 mt-4">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {!hasNextPage && anime.length > 0 && (
        <div className="text-center p-8 mt-4 text-slate-500 font-medium">
          You have reached the end of the list.
        </div>
      )}
    </>
  );
}
