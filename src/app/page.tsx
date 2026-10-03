import { fetchAnilist, GET_ANIME_LIST_QUERY } from '@/lib/anilist';
import AnimeCard from '@/components/AnimeCard';

function getNextSeasonAndYear() {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  let year = date.getFullYear();

  let nextSeason = 'SPRING';
  if (month >= 3 && month <= 5) nextSeason = 'SUMMER';
  else if (month >= 6 && month <= 8) nextSeason = 'FALL';
  else if (month >= 9 && month <= 11) {
    nextSeason = 'WINTER';
    year += 1;
  }
  return { season: nextSeason, year };
}

// Reusable component for horizontal scrolling rows
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AnimeRow({ title, icon, animeList }: { title: string, icon: string, animeList: any[] }) {
  if (!animeList || animeList.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50 hover:scrollbar-thumb-slate-500 transition-colors">
        {animeList.map((anime) => (
          <div key={anime.id} className="flex-shrink-0 w-44 sm:w-52 md:w-60 snap-start">
            <AnimeCard anime={anime} view="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function DiscoverPage() {
  const { season, year } = getNextSeasonAndYear();

  const [trendingData, topRatedData, upcomingData] = await Promise.all([
    fetchAnilist(GET_ANIME_LIST_QUERY, {
      page: 1,
      sort: ['TRENDING_DESC'],
    }),
    fetchAnilist(GET_ANIME_LIST_QUERY, {
      page: 1,
      sort: ['SCORE_DESC'],
    }),
    fetchAnilist(GET_ANIME_LIST_QUERY, {
      page: 1,
      season,
      seasonYear: year,
      sort: ['POPULARITY_DESC'],
    }),
  ]);

  const trending = trendingData.Page?.media || [];
  const topRated = topRatedData.Page?.media || [];
  const upcoming = upcomingData.Page?.media || [];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-8">
      <div className="max-w-[1400px] mx-auto pb-10">
        <header className="mb-10 mt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            Discover
          </h1>
          <p className="text-slate-400 text-lg">
            Find your next favorite anime from trending hits, all-time classics, and upcoming releases.
          </p>
        </header>

        <AnimeRow title="Trending Right Now" icon="🔥" animeList={trending} />
        <AnimeRow title="Highest Rated All-Time" icon="⭐" animeList={topRated} />
        <AnimeRow title={`Top Upcoming (${season} ${year})`} icon="📅" animeList={upcoming} />

      </div>
    </main>
  );
}
