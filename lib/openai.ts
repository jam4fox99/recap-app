import OpenAI from "openai";
import type { Episode } from "./tmdb";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export interface ParsedQuery {
  show: string;
  type: "before" | "single" | "range" | "season";
  season: number;
  episode?: number;
  endSeason?: number;
  endEpisode?: number;
}

export async function parseUserQuery(query: string): Promise<ParsedQuery> {
  const openai = getOpenAIClient();
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a TV show query parser. Extract the TV show name and episode information from user input.

Return a JSON object with these fields:
- "show": The TV show name (expand abbreviations like GOT to "Game of Thrones", BB to "Breaking Bad")
- "type": One of "before", "single", "range", or "season"
  - "before": User wants recap of everything BEFORE a specific episode (e.g., "I'm on S3E5" means recap S1E1 through S3E4)
  - "single": User wants recap of just ONE specific episode
  - "range": User wants recap of a range of episodes (e.g., "episodes 5-10")
  - "season": User wants recap of an entire season
- "season": The season number (default to 1 if not specified)
- "episode": The episode number (required for "before", "single", and "range" types)
- "endSeason": End season for ranges that span seasons (optional)
- "endEpisode": End episode for range type (required for "range")

Examples:
- "I'm on season 3 episode 5 of Game of Thrones" → {"show":"Game of Thrones","type":"before","season":3,"episode":5}
- "recap GOT s2e3" → {"show":"Game of Thrones","type":"single","season":2,"episode":3}
- "what happened in season 2 of breaking bad" → {"show":"Breaking Bad","type":"season","season":2}
- "recap episodes 5-10 of stranger things season 1" → {"show":"Stranger Things","type":"range","season":1,"episode":5,"endEpisode":10}
- "I forgot what happened before episode 8 of The Office" → {"show":"The Office","type":"before","season":1,"episode":8}

Common abbreviations:
- GOT = Game of Thrones
- BB = Breaking Bad
- BCS = Better Call Saul
- HIMYM = How I Met Your Mother
- TBBT = The Big Bang Theory
- TWD = The Walking Dead`,
      },
      {
        role: "user",
        content: query,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to parse query - no response from OpenAI");
  }

  const parsed = JSON.parse(content) as ParsedQuery;
  
  // Validate required fields
  if (!parsed.show) {
    throw new Error("Could not identify the TV show name");
  }
  if (!parsed.type) {
    parsed.type = "before";
  }
  if (!parsed.season) {
    parsed.season = 1;
  }
  
  return parsed;
}

export async function generateRecap(
  showName: string,
  episodes: Episode[],
  recapType: string
): Promise<string> {
  const openai = getOpenAIClient();
  
  if (episodes.length === 0) {
    return "No episodes found to recap.";
  }

  const episodeList = episodes
    .map((ep) => {
      const epId = `S${ep.season}E${ep.episode}`;
      const overview = ep.overview || "No overview available.";
      return `${epId} "${ep.name}": ${overview}`;
    })
    .join("\n\n");

  const episodeRange =
    episodes.length === 1
      ? `S${episodes[0].season}E${episodes[0].episode}`
      : `S${episodes[0].season}E${episodes[0].episode} to S${episodes[episodes.length - 1].season}E${episodes[episodes.length - 1].episode}`;

  let systemPrompt = `You are a TV recap expert who helps viewers remember what happened in shows they're catching up on.

Your task is to generate a spoiler-free recap that:
- Summarizes the major plot points and story progression
- Highlights important character developments and relationships
- Mentions key events that will be relevant going forward
- Is conversational and engaging, like reminding a friend what happened
- Does NOT spoil anything that happens AFTER these episodes
- Is organized and easy to follow

Keep the recap concise but comprehensive - aim for 2-4 paragraphs depending on how many episodes are being covered.`;

  if (recapType === "before") {
    systemPrompt += `\n\nThis is a "catch-up" recap - the viewer is about to watch the next episode and needs to remember what happened previously.`;
  } else if (recapType === "single") {
    systemPrompt += `\n\nThis is a single episode recap - focus on the main events of just this one episode.`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Show: ${showName}
Episodes covered: ${episodeRange} (${episodes.length} episode${episodes.length > 1 ? "s" : ""})

Episode details:
${episodeList}

Please generate a recap of these episodes.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const recap = response.choices[0]?.message?.content;
  if (!recap) {
    throw new Error("Failed to generate recap - no response from OpenAI");
  }

  return recap;
}
