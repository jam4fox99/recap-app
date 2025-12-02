"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  animatePageLoad,
  animateInputFocus,
  animateInputBlur,
  animateResultsIn,
  animateEpisodesExpand,
  animateEpisodeHover,
} from "@/lib/animations";
import RetroTV from "./components/RetroTV";

interface Episode {
  season: number;
  episode: number;
  name: string;
  overview: string;
  still_url: string | null;
  air_date: string;
  runtime: number | null;
}

interface Show {
  id: number;
  name: string;
  overview: string;
  poster_url: string | null;
  first_air_date: string;
  vote_average: number;
  number_of_seasons: number;
}

interface RecapResponse {
  show: Show;
  parsed: {
    type: string;
    season: number;
    episode?: number;
    description: string;
  };
  episodes: Episode[];
  recap: string;
  episodeCount: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecapResponse | null>(null);
  const [episodesExpanded, setEpisodesExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const episodesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      animatePageLoad();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        animateResultsIn();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [result]);

  useEffect(() => {
    if (episodesExpanded && episodesContainerRef.current) {
      animateEpisodesExpand(episodesContainerRef.current);
    }
  }, [episodesExpanded]);

  const handleInputFocus = useCallback(() => {
    if (inputRef.current) {
      animateInputFocus(inputRef.current);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    if (inputRef.current) {
      animateInputBlur(inputRef.current);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setEpisodesExpanded(false);

    try {
      const res = await fetch("/api/recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate recap");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "I'm on season 3 episode 5 of Game of Thrones",
    "What happened in season 2 of Breaking Bad",
    "Recap Stranger Things s1e8",
    "Episodes 1-5 of The Office season 1",
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Vignette overlay */}
      <div className="vignette" />
      
      {/* VHS tracking line */}
      <div className="tracking-line" />

      <main className="relative min-h-screen p-4 md:p-8 z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 pt-12">
            <div className="animate-title opacity-0 mb-4">
              <h1 
                  className="vhs-title text-6xl md:text-7xl font-bold text-glow crt-flicker glitch-hover cursor-pointer"
                  style={{ color: 'var(--accent-primary)' }}
                  onClick={() => {
                    setResult(null);
                    setQuery("");
                    setEpisodesExpanded(false);
                    setTimeout(() => animatePageLoad(), 100);
                  }}>
                ReCap
              </h1>
            </div>
            <p className="animate-subtitle opacity-0 text-sm tracking-wide"
               style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Spoiler-free episode recaps
            </p>
            <div className="animate-subtitle opacity-0 mt-3 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-secondary)' }}></span>
              <span className="timestamp text-xs">REC</span>
            </div>
          </header>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8 animate-input opacity-0">
            <div className="relative">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="What show are you watching?"
                    className="w-full px-5 py-4 rounded-none text-sm transition-all duration-300 border-glow"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                    disabled={loading}
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 timestamp text-xs opacity-50">
                    {new Date().toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background: 'var(--accent-primary)',
                    color: 'var(--bg-deep)',
                  }}
                >
                  {loading ? "•••" : "Play"}
                </button>
              </div>
            </div>
          </form>

          {/* Example Queries */}
          {!result && !loading && (
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest mb-4 animate-example opacity-0"
                 style={{ color: 'var(--text-muted)' }}>
                Try these:
              </p>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={example}
                    onClick={() => setQuery(example)}
                    className={`animate-example opacity-0 stagger-${index + 1} px-4 py-2 text-xs transition-all duration-200 hover:scale-105 card-hover`}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 animate-fade-up"
                 style={{
                   background: 'rgba(255, 0, 110, 0.1)',
                   border: '1px solid var(--accent-secondary)',
                   color: 'var(--accent-secondary)',
                 }}>
              <span className="timestamp mr-2">ERR</span>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <RetroTV />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Show Info */}
              <div className="animate-show-card opacity-0 flex gap-5 p-5 card-hover"
                   style={{
                     background: 'var(--bg-surface)',
                     border: '1px solid var(--border-subtle)',
                   }}>
                {result.show.poster_url && (
                  <div className="flex-shrink-0">
                    <Image
                      src={result.show.poster_url}
                      alt={result.show.name}
                      width={100}
                      height={150}
                      className="transition-transform duration-300 hover:scale-105"
                      style={{ filter: 'saturate(0.9)' }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="serif-elegant text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                    {result.show.name}
                  </h2>
                  <p className="timestamp text-sm mb-3">
                    {result.parsed.description} • {result.episodeCount} episodes
                  </p>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {result.show.overview}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{result.show.number_of_seasons} seasons</span>
                    <span>•</span>
                    <span>Since {result.show.first_air_date?.split("-")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Recap */}
              <div className="animate-recap opacity-0 p-6"
                   style={{
                     background: 'var(--bg-surface)',
                     border: '1px solid var(--border-subtle)',
                   }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-secondary)' }}></span>
                  <span className="timestamp text-xs">PLAYBACK</span>
                </div>
                <p className="serif-elegant text-base leading-relaxed whitespace-pre-wrap"
                   style={{ color: 'var(--text-primary)' }}>
                  {result.recap}
                </p>
              </div>

              {/* Episodes - Collapsible */}
              <div className="animate-episodes-header opacity-0"
                   style={{
                     background: 'var(--bg-surface)',
                     border: '1px solid var(--border-subtle)',
                   }}>
                <button
                  onClick={() => setEpisodesExpanded(!episodesExpanded)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-[var(--bg-elevated)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="timestamp text-xs">CH {String(result.episodeCount).padStart(2, '0')}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Episodes</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${episodesExpanded ? "rotate-180" : ""}`}
                    style={{ color: 'var(--text-muted)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {episodesExpanded && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div ref={episodesContainerRef} className="p-3 space-y-2 max-h-80 overflow-y-auto">
                      {result.episodes.map((ep) => (
                        <div
                          key={`${ep.season}-${ep.episode}`}
                          className="animate-episode flex gap-4 p-3 transition-all duration-200 cursor-default card-hover"
                          style={{ background: 'var(--bg-elevated)' }}
                          onMouseEnter={(e) => animateEpisodeHover(e.currentTarget, true)}
                          onMouseLeave={(e) => animateEpisodeHover(e.currentTarget, false)}
                        >
                          {ep.still_url ? (
                            <Image
                              src={ep.still_url}
                              alt={ep.name}
                              width={120}
                              height={68}
                              className="flex-shrink-0 object-cover"
                              style={{ filter: 'saturate(0.85)' }}
                            />
                          ) : (
                            <div className="w-[120px] h-[68px] flex-shrink-0 flex items-center justify-center text-xs"
                                 style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                              No preview
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="timestamp text-xs">
                                S{String(ep.season).padStart(2, '0')}E{String(ep.episode).padStart(2, '0')}
                              </span>
                              <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                                {ep.name}
                              </span>
                            </div>
                            <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                              {ep.overview || "No overview available"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* New Search */}
              <div className="text-center pt-6">
                <button
                  onClick={() => {
                    setResult(null);
                    setQuery("");
                    setEpisodesExpanded(false);
                    setTimeout(() => animatePageLoad(), 100);
                  }}
                  className="text-sm transition-all duration-200 hover:scale-105 glitch-hover"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="timestamp mr-2">←</span>
                  New recap
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-20 pt-8 text-center text-xs"
                  style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
            <p>
              Data from{" "}
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
                 className="transition-colors hover:text-[var(--accent-primary)]">
                TMDB
              </a>
              {" "}• Built with{" "}
              <a href="https://openai.com" target="_blank" rel="noopener noreferrer"
                 className="transition-colors hover:text-[var(--accent-primary)]">
                OpenAI
              </a>
            </p>
            <p className="timestamp mt-2 opacity-50">
              © {new Date().getFullYear()} ReCap
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
