export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Settings from "@/app/models/Settings";

export async function GET() {
  await connectDB();
  const settings = await Settings.findOne();
  return NextResponse.json({
    dropDate: settings?.dropDate ?? null,
    startDate: settings?.updatedAt ?? null,
  });
}
