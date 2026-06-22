export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/app/lib/db";
import Settings from "@/app/models/Settings";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  await connectDB();
  const settings = await Settings.findOne();
  return NextResponse.json({
    dropDate: settings?.dropDate ?? null,
    startDate: settings?.updatedAt ?? null,
  });
}

export async function PATCH(req) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { dropDate } = await req.json();
  if (!dropDate) {
    return NextResponse.json({ error: "dropDate est requis" }, { status: 400 });
  }
  await connectDB();
  const settings = await Settings.findOneAndUpdate(
    {},
    { dropDate: new Date(dropDate) },
    { upsert: true, new: true }
  );
  return NextResponse.json({
    dropDate: settings.dropDate,
    startDate: settings.updatedAt,
  });
}
