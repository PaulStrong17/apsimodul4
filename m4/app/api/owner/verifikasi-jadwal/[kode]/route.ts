import { NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/owner/authorization";
import {
  getOwnerVerificationDetail,
  verifySchedule,
} from "@/lib/owner/verification";

type RouteParams = {
  params: Promise<{ kode: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const authorization = await requireOwnerApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  try {
    const detail = await getOwnerVerificationDetail(authorization.ownerId, kode);
    if (!detail) {
      return NextResponse.json(
        { error: "Jadwal yang dicari tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ detail });
  } catch (error) {
    console.error("Could not load verification detail:", error);
    return NextResponse.json(
      { error: "Detail verifikasi jadwal tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const authorization = await requireOwnerApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const decision = (body as { decision?: string })?.decision;
  if (decision !== "setujui" && decision !== "tolak") {
    return NextResponse.json(
      { error: "Keputusan harus berupa 'setujui' atau 'tolak'." },
      { status: 400 },
    );
  }

  try {
    const result = await verifySchedule(
      authorization.ownerId,
      kode,
      decision,
    );

    if (!result) {
      return NextResponse.json(
        { error: "Jadwal tidak ditemukan atau tidak dapat diperbarui." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `Jadwal ${kode} berhasil ${decision === "setujui" ? "disetujui" : "ditolak"}.`,
      result,
    });
  } catch (error) {
    console.error("Could not process verification decision:", error);
    return NextResponse.json(
      { error: "Keputusan verifikasi tidak dapat disimpan." },
      { status: 500 },
    );
  }
}
