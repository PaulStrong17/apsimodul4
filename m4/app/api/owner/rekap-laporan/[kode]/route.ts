import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireOwnerApi } from "@/lib/owner/authorization";
import {
  getOwnerReport,
  deleteOwnerReport,
} from "@/lib/owner/reports";

type RouteParams = {
  params: Promise<{ kode: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const authorization = await requireOwnerApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  try {
    const report = await getOwnerReport(authorization.ownerId, kode);
    if (!report) {
      return NextResponse.json(
        { error: "Laporan tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Could not load owner report:", error);
    return NextResponse.json(
      { error: "Detail laporan tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authorization = await requireOwnerApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  try {
    const success = await deleteOwnerReport(authorization.ownerId, kode);
    if (!success) {
      return NextResponse.json(
        { error: "Laporan yang ingin dihapus tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: `Laporan ${kode} berhasil dihapus.`,
      code: kode,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Laporan tidak dapat dihapus karena sudah berelasi dengan data pemeriksaan QC atau tindakan perbaikan.",
        },
        { status: 409 },
      );
    }

    console.error("Could not delete owner report:", error);
    return NextResponse.json(
      { error: "Laporan tidak dapat dihapus." },
      { status: 500 },
    );
  }
}
