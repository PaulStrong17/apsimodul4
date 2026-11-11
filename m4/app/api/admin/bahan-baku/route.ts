import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseMaterialCreateInput } from "@/lib/admin/material-input";
import {
  listAdminMaterials,
  getAdminMaterialOptions,
} from "@/lib/admin/materials";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  try {
    const [materials, options] = await Promise.all([
      listAdminMaterials(authorization.adminId),
      getAdminMaterialOptions(),
    ]);

    return NextResponse.json({
      materials,
      options,
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

    // Hubungkan dengan resep jika ada (Detail_Resep)
    if (material.recipeId) {
      const resep = await prisma.resep.findUnique({
        where: { id_resep: material.recipeId },
        select: { id_resep: true },
      });

      if (resep) {
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
            id_bahan: created.id_bahan,
          },
        });
      }
    }

    // Catat penerimaan bahan baku jika supplier dan tanggal penerimaan diisi
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
            keterangan_penerimaan: material.receiptNote || "Penerimaan awal bahan baku",
            id_supplier: supplier.id_supplier,
            id_bahan: created.id_bahan,
            id_admin: authorization.adminId,
          },
        });
      }
    }

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
