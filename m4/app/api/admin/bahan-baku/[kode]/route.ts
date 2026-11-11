import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseMaterialUpdateInput } from "@/lib/admin/material-input";
import { getAdminMaterial, getAdminMaterialOptions } from "@/lib/admin/materials";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ kode: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;

  try {
    const [material, options] = await Promise.all([
      getAdminMaterial(authorization.adminId, kode),
      getAdminMaterialOptions(),
    ]);

    if (!material) {
      return NextResponse.json({ error: "Bahan baku tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({
      material,
      options,
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
    const existing = await prisma.bahan_baku.findFirst({
      where: {
        id_admin: authorization.adminId,
        id_bahan: { equals: kode, mode: "insensitive" },
      },
      select: { id_bahan: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bahan baku tidak ditemukan." }, { status: 404 });
    }

    await prisma.bahan_baku.update({
      where: { id_bahan: existing.id_bahan },
      data: {
        nama_bahan: material.name,
        satuan: material.unit,
        stok: material.stock,
        stok_minimum: material.minimumStock,
      },
    });

    // Update detail_resep jika recipeId diberikan
    if (material.recipeId) {
      const resep = await prisma.resep.findUnique({
        where: { id_resep: material.recipeId },
        select: { id_resep: true },
      });

      if (resep) {
        // Hapus relasi detail_resep lama bahan ini
        await prisma.detail_resep.deleteMany({
          where: { id_bahan: existing.id_bahan },
        });

        const detailCount = await prisma.detail_resep.count();
        let nextDrId = `DR${String(detailCount + 1).padStart(3, "0")}`;
        let counter = detailCount + 1;
        while (
          await prisma.detail_resep.findUnique({
            where: { id_detailresep: nextDrId },
          })
        ) {
          counter++;
          nextDrId = `DR${String(counter).padStart(3, "0")}`;
        }

        await prisma.detail_resep.create({
          data: {
            id_detailresep: nextDrId,
            id_resep: resep.id_resep,
            id_bahan: existing.id_bahan,
          },
        });
      }
    }

    // Catat penerimaan bahan baku baru jika diisi
    if (material.supplierId && material.receiptDate) {
      const supplier = await prisma.jenis_supplier.findUnique({
        where: { id_supplier: material.supplierId },
        select: { id_supplier: true },
      });

      if (supplier) {
        const penerimaanCount = await prisma.penerimaan_bahan_baku.count();
        let nextPbId = `PB${String(penerimaanCount + 1).padStart(3, "0")}`;
        let counter = penerimaanCount + 1;
        while (
          await prisma.penerimaan_bahan_baku.findUnique({
            where: { id_penerimaan: nextPbId },
          })
        ) {
          counter++;
          nextPbId = `PB${String(counter).padStart(3, "0")}`;
        }

        await prisma.penerimaan_bahan_baku.create({
          data: {
            id_penerimaan: nextPbId,
            tanggal_terima: material.receiptDate,
            jumlah_diterima: material.receiptAmount ?? material.stock,
            keterangan_penerimaan: material.receiptNote || "Penerimaan tambahan bahan baku",
            id_supplier: supplier.id_supplier,
            id_bahan: existing.id_bahan,
            id_admin: authorization.adminId,
          },
        });
      }
    }

    return NextResponse.json({ code: existing.id_bahan });
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
    const existing = await prisma.bahan_baku.findFirst({
      where: {
        id_admin: authorization.adminId,
        id_bahan: { equals: kode, mode: "insensitive" },
      },
      select: { id_bahan: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Bahan baku tidak ditemukan." }, { status: 404 });
    }

    // Hapus relasi detail_resep dan penerimaan_bahan_baku sebelum menghapus bahan_baku
    await prisma.detail_resep.deleteMany({
      where: { id_bahan: existing.id_bahan },
    });

    await prisma.penerimaan_bahan_baku.deleteMany({
      where: { id_bahan: existing.id_bahan },
    });

    await prisma.bahan_baku.delete({
      where: { id_bahan: existing.id_bahan },
    });

    return NextResponse.json({ code: existing.id_bahan });
  } catch (error) {
    console.error("Could not delete raw material:", error);
    return NextResponse.json(
      { error: "Bahan baku tidak dapat dihapus." },
      { status: 500 },
    );
  }
}
