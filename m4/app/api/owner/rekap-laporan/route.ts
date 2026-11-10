import { NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/owner/authorization";
import { listOwnerReports } from "@/lib/owner/reports";

export async function GET() {
  const authorization = await requireOwnerApi();
  if (authorization.error) return authorization.error;

  try {
    const reports = await listOwnerReports(authorization.ownerId);
    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Could not load owner reports:", error);
    return NextResponse.json(
      { error: "Rekap laporan tidak dapat dimuat." },
      { status: 500 },
    );
  }
}
