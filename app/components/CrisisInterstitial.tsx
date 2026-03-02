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
      className="mb-6 rounded-lg border border-[#dcbd23]/30 bg-[#dcbd23]/5 p-4 md:p-5"
    >
      <p className="text-sm font-medium text-[#1a2744]">
        If you or someone you know is struggling, help is available.
      </p>
      <p className="mt-2 text-sm text-[#1a2744]/80">
        <strong>{crisis.helpline.action}</strong> — {crisis.helpline.name}
      </p>
      <p className="mt-1 text-xs text-[#1a2744]/50">
        {crisis.helpline.available} &middot;{" "}
        <a
          href={crisis.helpline.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-[#dcbd23]/40 underline-offset-2 hover:text-[#1a2744]"
        >
          {crisis.helpline.url}
        </a>
      </p>
    </div>
  );
}
