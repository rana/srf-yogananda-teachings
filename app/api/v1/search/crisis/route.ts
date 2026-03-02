/**
 * Crisis detection API — /api/v1/search/crisis (M1c-9)
 *
 * Returns crisis helpline info when query matches crisis terms.
 * Does NOT suppress search results — the client displays the
 * interstitial above results.
 */

import { NextRequest, NextResponse } from "next/server";
import { detectCrisis } from "@/lib/services/crisis";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const language = request.nextUrl.searchParams.get("language") || "en";

  const result = detectCrisis(query, language);
  return NextResponse.json(result);
}
