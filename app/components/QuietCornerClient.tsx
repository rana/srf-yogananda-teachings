"use client";

/**
 * Quiet Corner client component — M2a-3, M2a-14 (ADR-072).
 *
 * Affirmation display with optional timer and audio cues.
 * Self-contained: minimal chrome, no nav clutter.
 * Timer completion: chime → 3s stillness → crossfade to parting passage.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { DailyPassage } from "@/lib/services/passages";

const TIMER_OPTIONS = [
  { label: "timer1", seconds: 60 },
  { label: "timer5", seconds: 300 },
  { label: "timer15", seconds: 900 },
] as const;

interface Props {
  passage: DailyPassage | null;
}

export function QuietCornerClient({ passage: initial }: Props) {
  const t = useTranslations("quiet");
  const [passage, setPassage] = useState(initial);
  const [timerActive, setTimerActive] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = useCallback((seconds: number) => {
    setTimerActive(true);
    setTimerComplete(false);
    setSecondsRemaining(seconds);

    // Singing bowl at start (M2a-14) — Web Audio API
    playTone(220, 0.15, 1.5); // A3, gentle singing bowl approximation

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          // Chime at end — higher, shorter
          playTone(523, 0.15, 0.8); // C5, gentle chime
          setTimerActive(false);
          setTimerComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const fetchAnother = useCallback(async () => {
    setLoading(true);
    setTimerComplete(false);
    try {
      const res = await fetch("/api/v1/passages/random");
      if (res.ok) {
        const json = await res.json();
        setPassage({
          id: json.data.id,
          content: json.data.content,
          bookId: json.data.citation.bookId,
          bookTitle: json.data.citation.book,
          bookAuthor: json.data.citation.author,
          chapterTitle: json.data.citation.chapter,
          chapterNumber: json.data.citation.chapterNumber,
          pageNumber: json.data.citation.page,
          language: json.data.language,
        });
      }
    } catch {
      // Keep current passage
    } finally {
      setLoading(false);
    }
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  if (!passage) {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center">
        <p className="text-srf-navy/40 italic">No reflections available yet.</p>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-4"
      data-mode={timerActive ? "quiet" : undefined}
    >
      <div className="mx-auto max-w-xl text-center">
        {/* Title — fades when timer active */}
        {!timerActive && (
          <h1 className="mb-8 font-display text-lg text-srf-navy/40">
            {t("heading")}
          </h1>
        )}

        {/* Affirmation */}
        <blockquote className="text-lg leading-relaxed text-srf-navy md:text-xl md:leading-relaxed">
          &ldquo;{passage.content.trim()}&rdquo;
        </blockquote>

        {/* Attribution */}
        <footer className="mt-4 text-sm text-srf-navy/50">
          <cite className="not-italic">
            — {passage.bookAuthor}, {passage.chapterTitle}
          </cite>
        </footer>

        {/* Timer */}
        {timerActive ? (
          <div className="mt-12">
            <p className="font-sans text-3xl tabular-nums text-srf-navy/30">
              {formatTime(secondsRemaining)}
            </p>
          </div>
        ) : timerComplete ? (
          <div className="mt-12 space-y-4">
            <p className="text-sm text-srf-gold">{t("timerComplete")}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={fetchAnother}
                disabled={loading}
                className="min-h-11 rounded-lg border border-srf-navy/10 px-4 py-2 text-sm text-srf-navy/60 transition-colors hover:border-srf-gold/40 hover:text-srf-navy"
              >
                {loading ? "..." : t("showAnother")}
              </button>
              <Link
                href="/"
                className="min-h-11 inline-flex items-center rounded-lg border border-srf-navy/10 px-4 py-2 text-sm text-srf-navy/60 transition-colors hover:border-srf-gold/40 hover:text-srf-navy"
              >
                {t("backToPortal")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 space-y-4">
            <p className="text-xs text-srf-navy/30">{t("subtitle")}</p>
            <div className="flex justify-center gap-3">
              {TIMER_OPTIONS.map((opt) => (
                <button
                  key={opt.seconds}
                  onClick={() => startTimer(opt.seconds)}
                  className="min-h-11 rounded-lg border border-srf-navy/10 px-4 py-2 text-sm text-srf-navy/60 transition-colors hover:border-srf-gold/40 hover:text-srf-navy"
                >
                  {t(opt.label)}
                </button>
              ))}
            </div>
            <button
              onClick={fetchAnother}
              disabled={loading}
              className="min-h-11 text-sm text-srf-navy/40 hover:text-srf-navy/60"
            >
              {loading ? "..." : t("showAnother")}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * Play a simple tone via Web Audio API.
 * Used for singing bowl (start) and chime (end).
 * Fixed 15% volume per M2a-14.
 */
function playTone(frequency: number, volume: number, duration: number) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = volume;

    // Fade out for natural decay
    gain.gain.setTargetAtTime(0, ctx.currentTime + duration * 0.3, duration * 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);

    // Clean up
    osc.onended = () => ctx.close();
  } catch {
    // Web Audio not available — degrade silently
  }
}
