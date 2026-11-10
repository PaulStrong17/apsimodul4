import { NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/owner/authorization";
import { listOwnerVerifications } from "@/lib/owner/verification";

export async function GET() {
  const authorization = await requireOwnerApi();
  if (authorization.error) return authorization.error;

  try {
    const verifications = await listOwnerVerifications(authorization.ownerId);
    return NextResponse.json({ verifications });
  } catch (error) {
    console.error("Could not load owner verifications:", error);
    return NextResponse.json(
      { error: "Daftar verifikasi jadwal tidak dapat dimuat." },
      { status: 500 },
    );
  }
}
