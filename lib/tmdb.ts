const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  number_of_seasons: number;
}

export interface Episode {
  season: number;
  episode: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

export interface SeasonData {
  season_number: number;
  episodes: {
    episode_number: number;
    name: string;
    overview: string;
    still_path: string | null;
    air_date: string;
    runtime: number | null;
  }[];
}

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY is not configured");
  }
  return key;
}

export function getPosterUrl(path: string | null, size: "w200" | "w500" = "w500"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getStillUrl(path: string | null, size: "w300" | "w500" = "w300"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export async function searchTVShow(query: string): Promise<TVShow | null> {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }
  
  const data = await res.json();
  
  if (!data.results || data.results.length === 0) {
    return null;
  }
  
  const show = data.results[0];
  
  // Fetch full details to get number_of_seasons
  const detailsUrl = `${TMDB_BASE}/tv/${show.id}?api_key=${apiKey}&language=en-US`;
  const detailsRes = await fetch(detailsUrl);
  
  if (!detailsRes.ok) {
    return show;
  }
  
  const details = await detailsRes.json();
  
  return {
    id: details.id,
    name: details.name,
    overview: details.overview,
    poster_path: details.poster_path,
    first_air_date: details.first_air_date,
    vote_average: details.vote_average,
    number_of_seasons: details.number_of_seasons,
  };
}

export async function getSeasonEpisodes(tvId: number, seasonNumber: number): Promise<Episode[]> {
  const apiKey = getApiKey();
  const url = `${TMDB_BASE}/tv/${tvId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`;
  
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      return [];
    }
    throw new Error(`TMDB season fetch failed: ${res.status}`);
  }
  
  const data: SeasonData = await res.json();
  
  return data.episodes.map((ep) => ({
    season: seasonNumber,
    episode: ep.episode_number,
    name: ep.name,
    overview: ep.overview,
    still_path: ep.still_path,
    air_date: ep.air_date,
    runtime: ep.runtime,
  }));
}

export async function getEpisodesBefore(
  tvId: number,
  season: number,
  episode: number
): Promise<Episode[]> {
  const episodes: Episode[] = [];
  
  // Fetch all seasons up to and including the target season
  for (let s = 1; s <= season; s++) {
    const seasonEpisodes = await getSeasonEpisodes(tvId, s);
    
    if (s < season) {
      // Include all episodes from previous seasons
      episodes.push(...seasonEpisodes);
    } else {
      // For the target season, include episodes before the target
      episodes.push(...seasonEpisodes.filter((ep) => ep.episode < episode));
    }
  }
  
  return episodes;
}

export async function getEpisodesInRange(
  tvId: number,
  startSeason: number,
  startEpisode: number,
  endSeason: number,
  endEpisode: number
): Promise<Episode[]> {
  const episodes: Episode[] = [];
  
  for (let s = startSeason; s <= endSeason; s++) {
    const seasonEpisodes = await getSeasonEpisodes(tvId, s);
    
    for (const ep of seasonEpisodes) {
      const isAfterStart = s > startSeason || (s === startSeason && ep.episode >= startEpisode);
      const isBeforeEnd = s < endSeason || (s === endSeason && ep.episode <= endEpisode);
      
      if (isAfterStart && isBeforeEnd) {
        episodes.push(ep);
      }
    }
  }
  
  return episodes;
}

export async function getSingleEpisode(
  tvId: number,
  season: number,
  episode: number
): Promise<Episode | null> {
  const seasonEpisodes = await getSeasonEpisodes(tvId, season);
  return seasonEpisodes.find((ep) => ep.episode === episode) || null;
}

export async function getSeasonEpisodesAll(tvId: number, season: number): Promise<Episode[]> {
  return getSeasonEpisodes(tvId, season);
}
