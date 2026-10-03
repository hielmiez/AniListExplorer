'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { LayoutGrid, List } from 'lucide-react';

export default function SortAndToolBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentView = searchParams.get('view') || 'grid';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleParamChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-4 mb-6 text-sm">
      
      {/* View Toggle */}
      <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/50 shadow-sm">
        <button
          onClick={() => handleParamChange('view', 'grid')}
          className={`p-1.5 rounded-md transition-colors ${
            currentView === 'grid' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
          aria-label="Grid View"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleParamChange('view', 'list')}
          className={`p-1.5 rounded-md transition-colors ${
            currentView === 'list' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
          aria-label="List View"
        >
          <List className="w-4 h-4" />
        </button>
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-medium">Sort By:</span>
        <select
          value={searchParams.get('sort') || 'POPULARITY_DESC'}
          onChange={(e) => handleParamChange('sort', e.target.value)}
          className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600 transition-colors shadow-sm"
        >
          <option value="POPULARITY_DESC">Popularity</option>
          <option value="TRENDING_DESC">Trending</option>
          <option value="TITLE_ROMAJI">Title</option>
          <option value="ID_DESC">Date Added</option>
          <option value="START_DATE_DESC">Release Date</option>
        </select>
      </div>
    </div>
  );
}
