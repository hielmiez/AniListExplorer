import { fetchAnilist, GET_ANIME_CHARACTERS_QUERY } from '@/lib/anilist';
import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = await fetchAnilist(GET_ANIME_CHARACTERS_QUERY, { id: parseInt(id) });
  const anime = data?.Media;
  if (!anime) return { title: 'Not Found' };
  return { title: `Characters - ${anime.title.english || anime.title.romaji}` };
}

export default async function AnimeCharactersPage({ params, searchParams }: Props) {
  const { id } = await params;
  const search = await searchParams;
  const page = typeof search.page === 'string' ? parseInt(search.page) : 1;

  const data = await fetchAnilist(GET_ANIME_CHARACTERS_QUERY, { id: parseInt(id), page });
  const anime = data?.Media;

  if (!anime) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Anime not found.</h1>
      </div>
    );
  }

  const title = anime.title.english || anime.title.romaji || anime.title.native || 'Unknown Title';
  const charactersData = anime.characters;
  const pageInfo = charactersData?.pageInfo;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            <h2 className="text-slate-400 font-medium">All Characters</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {charactersData?.edges?.map((edge: any, i: number) => {
            const char = edge.node;
            const va = edge.voiceActors?.[0];

            return (
              <div key={`${char.id}-${i}`} className="flex justify-between bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800 h-24">
                {/* Character */}
                <Link href={`/character/${char.id}`} className="flex flex-1 overflow-hidden group/char hover:bg-slate-800/80 transition-colors cursor-pointer">
                  <div className="relative w-16 h-full flex-shrink-0 bg-slate-800">
                    {char.image?.large && <Image src={char.image.large} alt={char.name.full} fill className="object-cover group-hover/char:scale-110 transition-transform" sizes="64px" />}
                  </div>
                  <div className="p-3 flex flex-col justify-center min-w-0">
                    <span className="font-semibold text-slate-200 truncate group-hover/char:text-blue-400 transition-colors" title={char.name.full}>{char.name.full}</span>
                    <span className="text-sm text-slate-400 capitalize mt-1">{edge.role?.toLowerCase()}</span>
                  </div>
                </Link>
                
                {/* Voice Actor */}
                {va ? (
                  <Link href={`/staff/${va.id}`} className="flex flex-1 overflow-hidden justify-end text-right bg-slate-800/30 group/va hover:bg-slate-800/80 transition-colors cursor-pointer">
                    <div className="p-3 flex flex-col justify-center min-w-0">
                      <span className="font-semibold text-slate-200 truncate group-hover/va:text-blue-400 transition-colors" title={va.name.full}>{va.name.full}</span>
                      <span className="text-sm text-slate-400 mt-1">Japanese</span>
                    </div>
                    <div className="relative w-16 h-full flex-shrink-0 bg-slate-800">
                      {va.image?.large && <Image src={va.image.large} alt={va.name.full} fill className="object-cover group-hover/va:scale-110 transition-transform" sizes="64px" />}
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-1 overflow-hidden justify-end items-center px-4 bg-slate-800/30 text-slate-500 text-sm">
                    No VA
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {pageInfo && (pageInfo.hasNextPage || pageInfo.currentPage > 1) && (
          <div className="flex justify-center items-center gap-4 mt-12">
            {pageInfo.currentPage > 1 ? (
              <Link href={`?page=${pageInfo.currentPage - 1}`} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors">
                Previous
              </Link>
            ) : (
              <button disabled className="px-6 py-2 bg-slate-900 text-slate-600 rounded-lg font-semibold cursor-not-allowed">
                Previous
              </button>
            )}
            
            <span className="text-slate-400 font-medium">
              Page {pageInfo.currentPage}
            </span>

            {pageInfo.hasNextPage ? (
              <Link href={`?page=${pageInfo.currentPage + 1}`} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors">
                Next
              </Link>
            ) : (
              <button disabled className="px-6 py-2 bg-slate-900 text-slate-600 rounded-lg font-semibold cursor-not-allowed">
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

