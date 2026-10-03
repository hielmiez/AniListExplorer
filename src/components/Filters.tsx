'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface FiltersProps {
  genres: string[];
  tags: string[];
}

export default function Filters({ genres, tags }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchParams.get('search') || '');

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

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const handleSearchSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFilterChange('search', search);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 1 - i);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-md p-6 rounded-2xl mb-10 shadow-2xl flex flex-col gap-5">
      
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for anime..."
          className="w-full pl-11 pr-32 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500 text-lg shadow-inner"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-md"
        >
          Search
        </button>
      </form>

      <div className="border-t border-slate-700/50 pt-4">
        <div className="flex items-center gap-2 text-slate-300 font-medium mb-4">
          <Filter className="w-4 h-4 text-blue-400" />
          <span className="text-sm uppercase tracking-wider font-semibold text-slate-200">Filters</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Genre */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-genre" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Genre</label>
            <select
              id="filter-genre"
              value={searchParams.get('genre') || ''}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600 transition-colors"
            >
              <option value="">Any</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-tag" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tag</label>
            <select
              id="filter-tag"
              value={searchParams.get('tag') || ''}
              onChange={(e) => handleFilterChange('tag', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600 transition-colors"
            >
              <option value="">Any</option>
              {tags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Season */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-season" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Season</label>
            <select
              id="filter-season"
              value={searchParams.get('season') || ''}
              onChange={(e) => handleFilterChange('season', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600 transition-colors"
            >
              <option value="">Any</option>
              <option value="WINTER">Winter</option>
              <option value="SPRING">Spring</option>
              <option value="SUMMER">Summer</option>
              <option value="FALL">Fall</option>
            </select>
          </div>

          {/* Year */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-year" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Year</label>
            <select
              id="filter-year"
              value={searchParams.get('year') || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600 transition-colors"
            >
              <option value="">Any</option>
              {years.map(y => <option key={y} value={y.toString()}>{y}</option>)}
            </select>
          </div>

          {/* Format */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-format" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Format</label>
            <select
              id="filter-format"
              value={searchParams.get('format') || ''}
              onChange={(e) => handleFilterChange('format', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600 transition-colors"
            >
              <option value="">Any</option>
              <option value="TV">TV</option>
              <option value="TV_SHORT">TV Short</option>
              <option value="MOVIE">Movie</option>
              <option value="SPECIAL">Special</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="MUSIC">Music</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-status" className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</label>
            <select
              id="filter-status"
              value={searchParams.get('status') || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-600 transition-colors"
            >
              <option value="">Any</option>
              <option value="FINISHED">Finished</option>
              <option value="RELEASING">Releasing</option>
              <option value="NOT_YET_RELEASED">Not Yet Released</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="HIATUS">Hiatus</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Reset Button */}
      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={() => {
            setSearch('');
            router.push(pathname);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </div>
  );
}
