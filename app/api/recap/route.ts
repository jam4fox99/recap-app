import { NextResponse } from "next/server";
import { parseUserQuery, generateRecap } from "@/lib/openai";
import {
  searchTVShow,
  getEpisodesBefore,
  getEpisodesInRange,
  getSingleEpisode,
  getSeasonEpisodesAll,
  getPosterUrl,
  getStillUrl,
  type Episode,
} from "@/lib/tmdb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // Step 1: Parse the user's natural language query
    const parsed = await parseUserQuery(query);

    // Step 2: Search for the TV show on TMDB
    const show = await searchTVShow(parsed.show);
    if (!show) {
      return NextResponse.json(
        { error: `Could not find TV show: "${parsed.show}"` },
        { status: 404 }
      );
    }

    // Step 3: Fetch the appropriate episodes based on query type
    let episodes: Episode[] = [];
    let recapDescription = "";

    switch (parsed.type) {
      case "before":
        if (!parsed.episode) {
          return NextResponse.json(
            { error: "Episode number required for 'before' type recap" },
            { status: 400 }
          );
        }
        episodes = await getEpisodesBefore(show.id, parsed.season, parsed.episode);
        recapDescription = `Everything before S${parsed.season}E${parsed.episode}`;
        break;

      case "single":
        if (!parsed.episode) {
          return NextResponse.json(
            { error: "Episode number required for single episode recap" },
            { status: 400 }
          );
        }
        const singleEp = await getSingleEpisode(show.id, parsed.season, parsed.episode);
        if (singleEp) {
          episodes = [singleEp];
        }
        recapDescription = `S${parsed.season}E${parsed.episode}`;
        break;

      case "season":
        episodes = await getSeasonEpisodesAll(show.id, parsed.season);
        recapDescription = `Season ${parsed.season}`;
        break;

      case "range":
        if (!parsed.episode || !parsed.endEpisode) {
          return NextResponse.json(
            { error: "Start and end episode required for range recap" },
            { status: 400 }
          );
        }
        const endSeason = parsed.endSeason || parsed.season;
        episodes = await getEpisodesInRange(
          show.id,
          parsed.season,
          parsed.episode,
          endSeason,
          parsed.endEpisode
        );
        if (parsed.season === endSeason) {
          recapDescription = `S${parsed.season}E${parsed.episode}-E${parsed.endEpisode}`;
        } else {
          recapDescription = `S${parsed.season}E${parsed.episode} to S${endSeason}E${parsed.endEpisode}`;
        }
        break;

      default:
        return NextResponse.json(
          { error: `Unknown recap type: ${parsed.type}` },
          { status: 400 }
        );
    }

    if (episodes.length === 0) {
      return NextResponse.json(
        { error: "No episodes found for the specified criteria" },
        { status: 404 }
      );
    }

    // Step 4: Generate the recap using OpenAI
    const recap = await generateRecap(show.name, episodes, parsed.type);

    // Step 5: Format and return the response
    return NextResponse.json({
      show: {
        id: show.id,
        name: show.name,
        overview: show.overview,
        poster_url: getPosterUrl(show.poster_path),
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
        number_of_seasons: show.number_of_seasons,
      },
      parsed: {
        type: parsed.type,
        season: parsed.season,
        episode: parsed.episode,
        endSeason: parsed.endSeason,
        endEpisode: parsed.endEpisode,
        description: recapDescription,
      },
      episodes: episodes.map((ep) => ({
        season: ep.season,
        episode: ep.episode,
        name: ep.name,
        overview: ep.overview,
        still_url: getStillUrl(ep.still_path),
        air_date: ep.air_date,
        runtime: ep.runtime,
      })),
      recap,
      episodeCount: episodes.length,
    });
  } catch (error) {
    console.error("Recap API error:", error);
    
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    const status = message.includes("not configured") ? 500 : 400;
    
    return NextResponse.json({ error: message }, { status });
  }
}
