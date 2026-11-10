import { prisma } from "@/lib/prisma";

export type AdminMaterial = {
  code: string;
  name: string;
  unit: string;
  stock: number;
  minimumStock: number;
};

function toAdminMaterial(material: {
  id_bahan: string;
  nama_bahan: string;
  satuan: string;
  stok: { toNumber(): number };
  stok_minimum: { toNumber(): number };
}): AdminMaterial {
  return {
    code: material.id_bahan,
    name: material.nama_bahan,
    unit: material.satuan,
    stock: material.stok.toNumber(),
    minimumStock: material.stok_minimum.toNumber(),
  };
}

export async function listAdminMaterials(adminId: string) {
  const materials = await prisma.bahan_baku.findMany({
    where: { id_admin: adminId },
    orderBy: { id_bahan: "asc" },
    select: {
      id_bahan: true,
      nama_bahan: true,
      satuan: true,
      stok: true,
      stok_minimum: true,
    },
  });

  return materials.map(toAdminMaterial);
}

export async function getAdminMaterial(adminId: string, code: string) {
  const material = await prisma.bahan_baku.findFirst({
    where: { id_admin: adminId, id_bahan: code },
    select: {
      id_bahan: true,
      nama_bahan: true,
      satuan: true,
      stok: true,
      stok_minimum: true,
    },
  });

  return material ? toAdminMaterial(material) : null;
}
