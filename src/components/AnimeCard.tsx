import Image from 'next/image';
import Link from 'next/link';

interface AnimeCardProps {
  anime: {
    id: number;
    title: {
      english: string | null;
      romaji: string;
      native: string | null;
    };
    coverImage: {
      large: string;
      color: string | null;
    };
    description: string | null;
    studios: {
      nodes: { name: string }[];
    } | null;
    format: string;
    episodes: number | null;
    genres: string[];
    averageScore: number | null;
    season: string | null;
    seasonYear: number | null;
    nextAiringEpisode?: {
      episode: number;
      timeUntilAiring: number;
    };
  };
  view?: 'grid' | 'list';
  userProgress?: number;
  userScore?: number;
}

function hexToRgba(hex: string | null, alpha: number) {
  if (!hex) return `rgba(96, 165, 250, ${alpha})`; // fallback blue-400
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ensureReadableColor(hex: string | null) {
  if (!hex) return '#60a5fa';
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance < 0.35) {
    // Lighten dark colors
    r = Math.floor(r + (255 - r) * 0.5);
    g = Math.floor(g + (255 - g) * 0.5);
    b = Math.floor(b + (255 - b) * 0.5);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return hex;
}

function formatEnum(text: string | null) {
  if (!text) return '';
  const acronyms = ['TV', 'OVA', 'ONA'];
  return text.split('_').map(word => 
    acronyms.includes(word.toUpperCase()) 
      ? word.toUpperCase() 
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

function formatTimeUntilAiring(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function AnimeCard({ anime, view = 'grid', userProgress, userScore }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji || anime.title.native || 'Unknown Title';
  const mainStudio = anime.studios?.nodes?.[0]?.name || 'Unknown Studio';
  const rawColor = anime.coverImage.color;
  const themeColor = ensureReadableColor(rawColor);
  const pillBgColor = hexToRgba(rawColor, 0.2);
  const pillTextColor = themeColor;

  const description = anime.description || 'No description available.';
  const formattedFormat = formatEnum(anime.format);
  const formattedSeason = formatEnum(anime.season);

  if (view === 'list') {
    return (
      <Link href={`/anime/${anime.id}`} className="flex flex-row bg-slate-800/80 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:bg-slate-800 transition-colors h-72 group/card">
        {/* Cover Image with Title Overlay */}
        <div className="relative w-40 sm:w-48 h-full flex-shrink-0 group">
          <Image
            src={anime.coverImage.large}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
          
          {anime.averageScore && (
            <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-md text-xs shadow-md z-10">
              ★ {anime.averageScore}
            </div>
          )}

          {/* Title & Studio Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end z-10 pointer-events-none">
            <h3 className="text-sm sm:text-base font-bold mb-0.5 line-clamp-3 leading-tight drop-shadow-lg" style={{ color: themeColor }} title={title}>
              {title}
            </h3>
            <div className="text-[10px] font-semibold drop-shadow-md" style={{ color: themeColor }}>
              {mainStudio}
            </div>
          </div>
        </div>
        
        {/* Right Side Content */}
        <div className="p-4 flex flex-col flex-grow min-w-0">
          <div className="flex justify-end items-start mb-3 gap-2">
            {anime.nextAiringEpisode && (
              <div className="text-[10px] sm:text-xs font-semibold text-blue-400 text-right whitespace-nowrap bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-800/30 shadow-inner flex flex-col justify-center">
                <span>Ep {anime.nextAiringEpisode.episode}</span>
                <span className="text-blue-300">{formatTimeUntilAiring(anime.nextAiringEpisode.timeUntilAiring)}</span>
              </div>
            )}
            <div className="text-[10px] sm:text-xs font-semibold text-slate-300 text-right whitespace-nowrap bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-inner">
              <span className="block text-slate-200">{formattedFormat} {anime.episodes ? `• ${anime.episodes} eps` : ''}</span>
              {anime.seasonYear && <span className="block mt-0.5 text-slate-400">{formattedSeason} {anime.seasonYear}</span>}
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto mb-3 pr-2 text-slate-300 text-xs leading-relaxed scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {anime.genres?.slice(0, 4).map((genre) => (
              <span 
                key={genre} 
                className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-600/30"
                style={{ backgroundColor: pillBgColor, color: pillTextColor }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link href={`/anime/${anime.id}`} className="group relative flex flex-col bg-slate-800 rounded-xl overflow-visible shadow-lg transition-transform hover:scale-105 hover:z-50 cursor-pointer">
      <div className="relative w-full aspect-[2/3] rounded-t-xl overflow-hidden">
        <Image
          src={anime.coverImage.large}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        {anime.averageScore && (
          <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-md text-xs shadow-md">
            ★ {anime.averageScore}
          </div>
        )}
        {userProgress !== undefined && (
          <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white font-bold px-2 py-1 rounded-md text-[10px] shadow-md z-10">
            EP {userProgress}
          </div>
        )}
      </div>
      
      {/* Fixed height container for consistent alignment */}
      <div className="p-3 bg-slate-900/80 rounded-b-xl border-t border-slate-700/50 flex flex-col justify-center min-h-[4.5rem]">
        <h3 className="text-sm font-semibold line-clamp-2 text-center" style={{ color: themeColor }} title={title}>
          {title}
        </h3>
      </div>

      {/* Hover Overlay Tooltip */}
      <div className="absolute inset-0 bg-slate-900/95 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        <h4 className="text-sm font-bold mb-1 line-clamp-3" style={{ color: themeColor }}>
          {title}
        </h4>
        <div className="text-xs font-semibold mb-3" style={{ color: themeColor }}>
          {mainStudio}
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-3 pb-3 border-b border-slate-700/50">
          <div className="flex flex-col gap-1">
            <span className="text-slate-100">{formattedFormat}</span>
            <span>{anime.episodes ? `${anime.episodes} Eps` : 'TBA'}</span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-slate-100">{formattedSeason} {anime.seasonYear}</span>
            {anime.averageScore && <span className="text-green-400 font-bold">{anime.averageScore}%</span>}
          </div>
        </div>

        {(userProgress !== undefined || userScore !== undefined) && (
          <div className="flex justify-between items-center text-[10px] bg-slate-800/80 rounded px-2 py-1.5 mb-3 border border-slate-700 text-slate-200 shadow-inner">
            {userProgress !== undefined && (
              <span>EP: <span className="text-white font-bold">{userProgress}</span> {anime.episodes ? `/ ${anime.episodes}` : ''}</span>
            )}
            {userScore !== undefined && userScore > 0 && (
              <span className="text-blue-400 font-bold ml-auto">★ {userScore}</span>
            )}
          </div>
        )}

        {anime.nextAiringEpisode && (
          <div className="mb-3 text-[10px] font-semibold text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-800/30 text-center uppercase tracking-wider">
            Ep {anime.nextAiringEpisode.episode} in {formatTimeUntilAiring(anime.nextAiringEpisode.timeUntilAiring)}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {anime.genres?.slice(0, 5).map((genre) => (
            <span 
              key={genre} 
              className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-600/30"
              style={{ backgroundColor: pillBgColor, color: pillTextColor }}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
