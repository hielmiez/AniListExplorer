import { fetchAnilist, GET_CHARACTER_DETAIL_QUERY } from '@/lib/anilist';
import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import Biography from '@/components/Biography';
import SpoilerSpan from '@/components/SpoilerSpan';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await fetchAnilist(GET_CHARACTER_DETAIL_QUERY, { id: parseInt(id) });
  const char = data?.Character;
  if (!char) return { title: 'Character Not Found' };
  
  return {
    title: `${char.name.full} - AniList Explorer`,
  };
}

export default async function CharacterDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await fetchAnilist(GET_CHARACTER_DETAIL_QUERY, { id: parseInt(id) });
  const char = data?.Character;

  if (!char) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Character not found.</h1>
      </div>
    );
  }

  const title = char.name.full || 'Unknown Character';
  const displayAge = char.age?.replace(/-$/, '').trim();
  
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <BackButton />
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Image & Info */}
          <div className="flex flex-col w-full md:w-64 flex-shrink-0 gap-6">
            <div className="relative w-48 md:w-full mx-auto md:mx-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-slate-900">
              {char.image?.large ? (
                <Image
                  src={char.image.large}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                  sizes="230px"
                />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
            </div>

            {/* Information Box */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3 text-sm">
              <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3">Information</h3>
              
              {char.name.native && <div><span className="text-slate-400 font-medium">Native:</span> <span className="float-right text-slate-200">{char.name.native}</span></div>}
              {displayAge && <div><span className="text-slate-400 font-medium">Age:</span> <span className="float-right text-slate-200">{displayAge}</span></div>}
              {char.gender && <div><span className="text-slate-400 font-medium">Gender:</span> <span className="float-right text-slate-200">{char.gender}</span></div>}
              {char.bloodType && <div><span className="text-slate-400 font-medium">Blood Type:</span> <span className="float-right text-slate-200">{char.bloodType}</span></div>}
              {char.dateOfBirth?.year && <div><span className="text-slate-400 font-medium">Birthday:</span> <span className="float-right text-slate-200">{char.dateOfBirth.year}-{char.dateOfBirth.month}-{char.dateOfBirth.day}</span></div>}
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="flex flex-col flex-grow min-w-0 pt-2">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight text-white">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {char.name.native && (
                <span className="text-sm px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                  {char.name.native}
                </span>
              )}
              {char.name.alternative && char.name.alternative.length > 0 && (
                <>
                  {char.name.alternative.filter(Boolean).map((alt: string) => (
                    <span key={alt} className="text-sm px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                      {alt}
                    </span>
                  ))}
                </>
              )}
              {char.name.alternativeSpoiler && char.name.alternativeSpoiler.length > 0 && (
                <>
                  {char.name.alternativeSpoiler.filter(Boolean).map((altSpoiler: string) => (
                    <SpoilerSpan key={altSpoiler} className="text-sm px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                      {altSpoiler}
                    </SpoilerSpan>
                  ))}
                </>
              )}
            </div>

            <div className="bg-slate-900/60 rounded-xl p-5 md:p-8 border border-slate-800 mb-10">
              <h3 className="text-xl font-bold mb-4 text-slate-100">Biography</h3>
              <Biography html={char.description || ''} />
            </div>
            
            {/* Anime Roles Section */}
            {char.media?.edges?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-slate-100 border-b border-slate-800 pb-2">Anime Appearances</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {char.media.edges.map((edge: { characterRole: string, node: Record<string, unknown> }, i: number) => {
                    const anime = edge.node as Record<string, unknown>;
                    const titleNode = anime.title as Record<string, string>;
                    const coverImageNode = anime.coverImage as Record<string, string>;
                    const animeTitle = titleNode?.english || titleNode?.romaji || 'Unknown';
                    return (
                      <Link key={`${anime.id}-${i}`} href={`/anime/${anime.id}`} className="group">
                        <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-slate-800 shadow-md group-hover:shadow-blue-500/20 transition-all">
                          {coverImageNode?.large && (
                            <Image src={coverImageNode.large} alt={animeTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="160px" />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-1">
                            <span className="text-[10px] text-white/80 uppercase font-bold">{edge.characterRole}</span>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors" title={animeTitle}>
                          {animeTitle}
                        </h4>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </main>
  );
}
