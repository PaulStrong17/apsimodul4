import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseMaterialCreateInput } from "@/lib/admin/material-input";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  try {
    const materials = await prisma.bahan_baku.findMany({
      where: { id_admin: authorization.adminId },
      orderBy: { id_bahan: "asc" },
      select: {
        id_bahan: true,
        nama_bahan: true,
        satuan: true,
        stok: true,
        stok_minimum: true,
      },
    });

    return NextResponse.json({
      materials: materials.map((material) => ({
        code: material.id_bahan,
        name: material.nama_bahan,
        unit: material.satuan,
        stock: material.stok.toNumber(),
        minimumStock: material.stok_minimum.toNumber(),
      })),
    });
  } catch (error) {
    console.error("Could not load raw materials:", error);
    return NextResponse.json(
      { error: "Data bahan baku tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const material = parseMaterialCreateInput(body);
  if (!material) {
    return NextResponse.json(
      { error: "Periksa kode, nama, satuan, stok, dan stok minimum." },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.bahan_baku.create({
      data: {
        id_bahan: material.code,
        nama_bahan: material.name,
        satuan: material.unit,
        stok: material.stock,
        stok_minimum: material.minimumStock,
        admin: { connect: { id_admin: authorization.adminId } },
      },
      select: { id_bahan: true },
    });

    return NextResponse.json({ code: created.id_bahan }, { status: 201 });
  } catch (error) {
    console.error("Could not create raw material:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Kode bahan baku tersebut sudah digunakan." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan bahan baku." },
      { status: 500 },
    );
  }
}
