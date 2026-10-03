import { fetchAnilist, GET_ANIME_DETAIL_QUERY } from '@/lib/anilist';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Synopsis from '@/components/Synopsis';
import BackButton from '@/components/BackButton';
import WatchlistEditor from '@/components/WatchlistEditor';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await fetchAnilist(GET_ANIME_DETAIL_QUERY, { id: parseInt(id) });
  const anime = data?.Media;
  if (!anime) return { title: 'Anime Not Found' };
  
  return {
    title: `${anime.title.english || anime.title.romaji} - AniList Explorer`,
  };
}

function formatTimeUntilAiring(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default async function AnimeDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await fetchAnilist(GET_ANIME_DETAIL_QUERY, { id: parseInt(id) });
  const anime = data?.Media;

  if (!anime) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold">Anime not found.</h1>
      </div>
    );
  }

  const title = anime.title.english || anime.title.romaji || anime.title.native || 'Unknown Title';
  const themeColor = anime.coverImage?.color || '#3b82f6';
  
  const normalizeText = (text: string | null | undefined) => {
    if (!text) return '';
    const acronyms = ['TV', 'OVA', 'ONA'];
    return text.split('_').map(word => 
      acronyms.includes(word.toUpperCase()) 
        ? word.toUpperCase() 
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  type StudioEdge = { isMain: boolean, node: { name: string } };
  const studios = anime.studios?.edges?.filter((e: StudioEdge) => e.isMain).map((e: StudioEdge) => e.node.name) || [];
  const producers = anime.studios?.edges?.filter((e: StudioEdge) => !e.isMain).map((e: StudioEdge) => e.node.name) || [];
  const synonyms = anime.synonyms?.filter((s: string) => s.trim() !== '') || [];

  let startDateStr = null;
  if (anime.startDate?.year) {
    const { year, month, day } = anime.startDate;
    const d = new Date(year, (month || 1) - 1, day || 1);
    startDateStr = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: month ? 'short' : undefined,
      day: day ? 'numeric' : undefined,
    });
  }
  
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Banner / Hero */}
      <div className="relative w-full h-64 md:h-96 bg-slate-900">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={`${title} Banner`}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
          <BackButton className="" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Cover & Quick Info */}
          <div className="flex flex-col w-full md:w-64 flex-shrink-0 gap-6">
            <div className="relative w-48 md:w-full mx-auto md:mx-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border-4 border-slate-900">
              <Image
                src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                alt={title}
                fill
                className="object-cover"
                priority
                sizes="230px"
              />
            </div>
            
            {/* Quick Actions / Stats */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {anime.averageScore && (
                <div className="px-3 py-2 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center flex-1">
                  <span className="text-green-400 font-bold text-lg">{anime.averageScore}%</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
                </div>
              )}
              {anime.popularity && (
                <div className="px-3 py-2 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center flex-1">
                  <span className="text-blue-400 font-bold text-lg">{anime.popularity.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Popularity</span>
                </div>
              )}
            </div>

            {/* Watchlist Actions */}
            <div className="w-full">
              <WatchlistEditor 
                mediaId={anime.id} 
                maxEpisodes={anime.episodes} 
              />
            </div>

            {/* Information Box */}
            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3 text-sm">
              <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3">Information</h3>
              
              <div><span className="text-slate-400 font-medium">Format:</span> <span className="float-right text-slate-200">{normalizeText(anime.format) || 'Unknown'}</span></div>
              <div><span className="text-slate-400 font-medium">Episodes:</span> <span className="float-right text-slate-200">{anime.episodes || 'TBA'}</span></div>
              {anime.duration && <div><span className="text-slate-400 font-medium">Duration:</span> <span className="float-right text-slate-200">{anime.duration} mins</span></div>}
              <div><span className="text-slate-400 font-medium">Status:</span> <span className="float-right text-slate-200">{normalizeText(anime.status) || 'Unknown'}</span></div>
              {startDateStr && <div><span className="text-slate-400 font-medium">Start Date:</span> <span className="float-right text-slate-200">{startDateStr}</span></div>}
              {anime.season && anime.seasonYear && <div><span className="text-slate-400 font-medium">Season:</span> <span className="float-right text-slate-200 capitalize">{anime.season.toLowerCase()} {anime.seasonYear}</span></div>}
              <div><span className="text-slate-400 font-medium">Source:</span> <span className="float-right text-slate-200">{normalizeText(anime.source) || 'Unknown'}</span></div>
              
              {studios.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-400 font-medium block mb-1">Studios:</span>
                  <div className="flex flex-col text-slate-200">
                    {studios.map((s: string) => <span key={s}>{s}</span>)}
                  </div>
                </div>
              )}
              
              {producers.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-400 font-medium block mb-1">Producers:</span>
                  <div className="flex flex-col text-slate-200">
                    {producers.map((p: string) => <span key={p}>{p}</span>)}
                  </div>
                </div>
              )}

              {anime.title.romaji && (
                <div className="pt-2 border-t border-slate-800 mt-2">
                  <span className="text-slate-400 font-medium block">Romaji:</span>
                  <span className="text-slate-200 block text-xs mt-0.5">{anime.title.romaji}</span>
                </div>
              )}
              {anime.title.english && (
                <div className="pt-2">
                  <span className="text-slate-400 font-medium block">English:</span>
                  <span className="text-slate-200 block text-xs mt-0.5">{anime.title.english}</span>
                </div>
              )}
              {synonyms.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-400 font-medium block">Synonyms:</span>
                  {synonyms.map((s: string) => <span key={s} className="text-slate-200 block text-xs mt-0.5">{s}</span>)}
                </div>
              )}
              {anime.nextAiringEpisode && (
                <div className="pt-2 border-t border-slate-800 mt-2">
                  <span className="text-blue-400 font-bold block mb-1">Next Episode:</span>
                  <div className="text-blue-300 text-xs font-semibold bg-blue-900/20 p-2 rounded border border-blue-800/30">
                    Ep {anime.nextAiringEpisode.episode} in {formatTimeUntilAiring(anime.nextAiringEpisode.timeUntilAiring)}
                  </div>
                </div>
              )}
            </div>

            {/* Tags Section */}
            {anime.tags?.length > 0 && (
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.tags.map((tag: { name: string, description?: string, rank?: number }) => (
                    <div key={tag.name} className="group relative">
                      <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700 cursor-help inline-block">
                        {tag.name} <span className="text-slate-500">{tag.rank}%</span>
                      </span>
                      {tag.description && (
                        <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-slate-200 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-700">
                          {tag.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Links Section */}
            {anime.externalLinks?.length > 0 && (
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 mt-4">
                <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3">External & Streaming</h3>
                <div className="flex flex-col gap-2">
                  {anime.externalLinks.map((link: { id: number, url: string, site: string, color?: string, icon?: string }) => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between px-3 py-2.5 bg-slate-800/60 hover:bg-slate-700/80 rounded-lg border border-slate-700/50 transition-all hover:scale-[1.02]"
                      style={link.color ? { borderLeftColor: link.color, borderLeftWidth: '4px' } : {}}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={link.icon} alt={link.site} className="w-5 h-5 object-contain" />
                        ) : (
                          <ExternalLink size={18} className="text-slate-400" />
                        )}
                        <span className="text-slate-200 text-sm font-semibold">{link.site}</span>
                      </div>
                      <ExternalLink size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Main Content */}
          <div className="flex flex-col flex-grow min-w-0 pt-2 md:pt-36">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight" style={{ color: themeColor }}>
              {title}
            </h1>
            
            {anime.title.native && (
              <h2 className="text-lg md:text-xl text-slate-400 font-medium mb-6">
                {anime.title.native} {anime.title.romaji && anime.title.romaji !== title ? `• ${anime.title.romaji}` : ''}
              </h2>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {anime.genres?.map((genre: string) => (
                <span key={genre} className="px-3 py-1 bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-700">
                  {genre}
                </span>
              ))}
            </div>

            <Synopsis text={anime.description} />
            
            {/* Characters Section */}
            {anime.characters?.edges?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-slate-100 border-b border-slate-800 pb-2">Characters & Voice Actors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anime.characters.edges.map((edge: { role: string, node: Record<string, unknown>, voiceActors: Record<string, unknown>[] }, i: number) => {
                    type PersonNode = { id: number, name: { full: string }, image?: { large: string } };
                    const char = edge.node as PersonNode;
                    const va = edge.voiceActors?.[0] as PersonNode | undefined; // Filtered to Japanese in query
                    
                    return (
                      <div key={`${char.id}-${i}`} className="flex justify-between bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800 h-20">
                        {/* Character */}
                        <Link href={`/character/${char.id}`} className="flex flex-1 overflow-hidden group/char hover:bg-slate-800/80 transition-colors cursor-pointer">
                          <div className="relative w-14 h-full flex-shrink-0 bg-slate-800">
                            {char.image?.large && <Image src={char.image.large} alt={char.name.full} fill className="object-cover group-hover/char:scale-110 transition-transform" sizes="56px" />}
                          </div>
                          <div className="p-2 flex flex-col justify-center min-w-0">
                            <span className="font-semibold text-sm text-slate-200 truncate group-hover/char:text-blue-400 transition-colors" title={char.name.full}>{char.name.full}</span>
                            <span className="text-xs text-slate-400 capitalize">{edge.role?.toLowerCase()}</span>
                          </div>
                        </Link>
                        
                        {/* Voice Actor */}
                        {va ? (
                          <Link href={`/staff/${va.id}`} className="flex flex-1 overflow-hidden justify-end text-right bg-slate-800/30 group/va hover:bg-slate-800/80 transition-colors cursor-pointer">
                            <div className="p-2 flex flex-col justify-center min-w-0">
                              <span className="font-semibold text-sm text-slate-200 truncate group-hover/va:text-blue-400 transition-colors" title={va.name.full}>{va.name.full}</span>
                              <span className="text-xs text-slate-400">Japanese</span>
                            </div>
                            <div className="relative w-14 h-full flex-shrink-0 bg-slate-800">
                              {va.image?.large && <Image src={va.image.large} alt={va.name.full} fill className="object-cover group-hover/va:scale-110 transition-transform" sizes="56px" />}
                            </div>
                          </Link>
                        ) : (
                          <div className="flex flex-1 overflow-hidden justify-end items-center px-4 bg-slate-800/30 text-slate-500 text-xs">
                            No VA
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Staff Section */}
            {anime.staff?.edges?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-slate-100 border-b border-slate-800 pb-2">Staff</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {anime.staff.edges.map((edge: { role: string, node: Record<string, unknown> }, i: number) => {
                    type StaffNode = { id: number, name: { full: string }, image?: { large: string } };
                    const staff = edge.node as StaffNode;
                    return (
                      <Link href={`/staff/${staff.id}`} key={`${staff.id}-${i}`} className="flex bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800 h-20 group hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="relative w-14 h-full flex-shrink-0 bg-slate-800">
                          {staff.image?.large && <Image src={staff.image.large} alt={staff.name.full} fill className="object-cover group-hover:scale-110 transition-transform" sizes="56px" />}
                        </div>
                        <div className="p-2 flex flex-col justify-center min-w-0">
                          <span className="font-semibold text-sm text-slate-200 truncate group-hover:text-blue-400 transition-colors" title={staff.name.full}>{staff.name.full}</span>
                          <span className="text-xs text-slate-400 truncate" title={edge.role}>{edge.role}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Media Section */}
            {anime.relations?.edges?.some((edge: Record<string, unknown>) => (edge.node as Record<string, unknown>)?.type === 'ANIME') && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-slate-100 border-b border-slate-800 pb-2">Related Media</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                  {anime.relations.edges
                    .filter((edge: Record<string, unknown>) => (edge.node as Record<string, unknown>)?.type === 'ANIME')
                    .map((edge: Record<string, unknown>, i: number) => {
                      const relAnime = edge.node as Record<string, unknown>;
                      const titleNode = relAnime.title as Record<string, string>;
                      const coverImageNode = relAnime.coverImage as Record<string, string>;
                      const relTitle = titleNode?.english || titleNode?.romaji || titleNode?.native || 'Unknown';
                      return (
                        <Link 
                          key={`${relAnime.id}-${i}`} 
                          href={`/anime/${relAnime.id}`}
                          className="flex-shrink-0 w-36 sm:w-40 group snap-start"
                        >
                          <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-slate-800 shadow-lg group-hover:ring-2 ring-blue-500 transition-all">
                            {coverImageNode?.large && (
                              <Image 
                                src={coverImageNode.large} 
                                alt={relTitle} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="160px"
                              />
                            )}
                            {!!relAnime.averageScore && (
                              <div className="absolute top-1 right-1 bg-green-500/90 backdrop-blur-sm text-white font-bold px-1.5 py-0.5 rounded text-[10px] shadow-md z-10">
                                ★ {String(relAnime.averageScore)}
                              </div>
                            )}
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-900/80 to-transparent p-1.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700 shadow-sm backdrop-blur-md">
                                {normalizeText(edge.relationType as string)}
                              </span>
                            </div>
                          </div>
                          <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors" title={relTitle}>
                            {relTitle}
                          </h4>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {normalizeText(relAnime.format as string)}
                          </div>
                        </Link>
                      );
                  })}
                </div>
              </div>
            )}
            
            {/* Trailer Section */}
            {anime.trailer?.site === "youtube" && anime.trailer?.id && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-slate-100 border-b border-slate-800 pb-2">Trailer</h3>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900">
                  <iframe 
                    src={`https://www.youtube.com/embed/${anime.trailer.id}`} 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {anime.recommendations?.nodes?.some((node: Record<string, unknown>) => (node.mediaRecommendation as Record<string, unknown>)?.type === 'ANIME') && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6 text-slate-100 border-b border-slate-800 pb-2">Recommendations</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {anime.recommendations.nodes
                    .filter((node: Record<string, unknown>) => (node.mediaRecommendation as Record<string, unknown>)?.type === 'ANIME')
                    .slice(0, 10)
                    .map((node: Record<string, unknown>, i: number) => {
                      const recAnime = node.mediaRecommendation as Record<string, unknown>;
                      const titleNode = recAnime.title as Record<string, string>;
                      const coverImageNode = recAnime.coverImage as Record<string, string>;
                      const recTitle = titleNode?.english || titleNode?.romaji || titleNode?.native || 'Unknown';
                      return (
                        <Link 
                          key={`${recAnime.id}-${i}`} 
                          href={`/anime/${recAnime.id}`}
                          className="group"
                        >
                          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-slate-800 shadow-md group-hover:shadow-blue-500/20 transition-all">
                            {coverImageNode?.large && (
                              <Image 
                                src={coverImageNode.large} 
                                alt={recTitle} 
                                fill 
                                className="object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-300"
                                sizes="200px"
                              />
                            )}
                            {!!recAnime.averageScore && (
                              <div className="absolute top-1 left-1 bg-green-500/90 backdrop-blur-sm text-white font-bold px-1.5 py-0.5 rounded text-[10px] shadow-md z-10">
                                ★ {String(recAnime.averageScore)}
                              </div>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-slate-200 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors" title={recTitle}>
                            {recTitle}
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
