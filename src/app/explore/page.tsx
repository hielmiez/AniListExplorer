import { fetchAnilist, GET_ANIME_LIST_QUERY, GET_OPTIONS_QUERY } from '@/lib/anilist';
import Filters from '@/components/Filters';
import SortAndToolBar from '@/components/SortAndToolBar';
import AnimeList from '@/components/AnimeList';
import { Suspense } from 'react';

function getCurrentSeasonAndYear() {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();

  let season = 'WINTER';
  if (month >= 3 && month <= 5) {
    season = 'SPRING';
  } else if (month >= 6 && month <= 8) {
    season = 'SUMMER';
  } else if (month >= 9 && month <= 11) {
    season = 'FALL';
  }

  return { season, year };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Use await for searchParams in Next.js 15
  const params = await searchParams;

  // Defaults
  const search = typeof params.search === 'string' ? params.search : undefined;
  const genre = typeof params.genre === 'string' ? params.genre : undefined;
  const tag = typeof params.tag === 'string' ? params.tag : undefined;
  const format = typeof params.format === 'string' ? params.format : undefined;
  const status = typeof params.status === 'string' ? params.status : undefined;
  
  const sort = typeof params.sort === 'string' ? params.sort : undefined;
  
  // Default to Current Season if no filters are applied and it's not a search
  let season = typeof params.season === 'string' ? params.season : undefined;
  let seasonYear = typeof params.year === 'string' ? parseInt(params.year) : undefined;

  // If there are no filters at all, set the default to the current season
  if (!search && !genre && !tag && !format && !status && !season && !seasonYear && !sort) {
    const current = getCurrentSeasonAndYear();
    season = current.season;
    seasonYear = current.year;
  }

  const variables = {
    page: 1,
    search,
    season,
    seasonYear,
    genre_in: genre ? [genre] : undefined,
    tag_in: tag ? [tag] : undefined,
    format_in: format ? [format] : undefined,
    status_in: status ? [status] : undefined,
    sort: sort ? [sort] : ['POPULARITY_DESC'],
  };

  // Fetch Options for Filters
  const optionsData = await fetchAnilist(GET_OPTIONS_QUERY);
  const genres = optionsData.GenreCollection || [];
  const tags = optionsData.MediaTagCollection?.map((t: { name: string }) => t.name) || [];

  // Fetch Anime List
  const animeData = await fetchAnilist(GET_ANIME_LIST_QUERY, variables);
  const animeList = animeData.Page?.media || [];

  const view = typeof params.view === 'string' ? params.view : 'grid';

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="text-center p-8">Loading Filters...</div>}>
          <Filters genres={genres} tags={tags} />
          <SortAndToolBar />
        </Suspense>

        <AnimeList 
          initialAnime={animeList} 
          initialPageInfo={animeData.Page?.pageInfo || { hasNextPage: false }} 
          variables={variables} 
          view={view as 'grid' | 'list'} 
        />
      </div>
    </main>
  );
}
