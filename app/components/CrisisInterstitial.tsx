/**
 * Crisis interstitial — M1c-9 (ADR-122).
 *
 * Calm, gentle banner displayed ABOVE search results when crisis
 * terms are detected. Does not suppress results.
 */

import type { CrisisInfo } from "@/lib/services/crisis";

interface Props {
  crisis: CrisisInfo;
}

export function CrisisInterstitial({ crisis }: Props) {
  if (!crisis.detected || !crisis.helpline) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-lg border border-srf-gold/30 bg-srf-gold/5 p-4 md:p-5"
    >
      <p className="text-sm font-medium text-srf-navy">
        If you or someone you know is struggling, help is available.
      </p>
      <p className="mt-2 text-sm text-srf-navy/80">
        <strong>{crisis.helpline.action}</strong> — {crisis.helpline.name}
      </p>
      <p className="mt-1 text-xs text-srf-navy/50">
        {crisis.helpline.available} &middot;{" "}
        <a
          href={crisis.helpline.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-srf-gold/40 underline-offset-2 hover:text-srf-navy"
        >
          {crisis.helpline.url}
        </a>
      </p>
    </div>
  );
}
