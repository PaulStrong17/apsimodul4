import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseMaterialUpdateInput } from "@/lib/admin/material-input";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ kode: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;

  try {
    const material = await prisma.bahan_baku.findFirst({
      where: { id_admin: authorization.adminId, id_bahan: kode },
      select: {
        id_bahan: true,
        nama_bahan: true,
        satuan: true,
        stok: true,
        stok_minimum: true,
      },
    });
    if (!material) {
      return NextResponse.json({ error: "Bahan baku tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      material: {
        code: material.id_bahan,
        name: material.nama_bahan,
        unit: material.satuan,
        stock: material.stok.toNumber(),
        minimumStock: material.stok_minimum.toNumber(),
      },
    });
  } catch (error) {
    console.error("Could not load raw material:", error);
    return NextResponse.json(
      { error: "Data bahan baku tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const material = parseMaterialUpdateInput(body);
  if (!material) {
    return NextResponse.json(
      { error: "Periksa nama, satuan, stok, dan stok minimum." },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.bahan_baku.updateMany({
      where: { id_admin: authorization.adminId, id_bahan: kode },
      data: {
        nama_bahan: material.name,
        satuan: material.unit,
        stok: material.stock,
        stok_minimum: material.minimumStock,
      },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Bahan baku tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ code: kode });
  } catch (error) {
    console.error("Could not update raw material:", error);
    return NextResponse.json(
      { error: "Bahan baku tidak dapat diperbarui." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;

  try {
    const result = await prisma.bahan_baku.deleteMany({
      where: { id_admin: authorization.adminId, id_bahan: kode },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Bahan baku tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ code: kode });
  } catch (error) {
    console.error("Could not delete raw material:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Bahan baku tidak dapat dihapus karena masih digunakan oleh resep atau transaksi penerimaan.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus bahan baku." },
      { status: 500 },
    );
  }
}
