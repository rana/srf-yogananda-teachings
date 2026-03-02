import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    version: "0.0.0",
    milestone: "1a",
    timestamp: new Date().toISOString(),
  });
}
