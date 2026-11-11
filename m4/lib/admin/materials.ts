import { prisma } from "@/lib/prisma";

export type MaterialReceiptItem = {
  id: string;
  receiptDate: string;
  amount: number;
  supplierCode: string;
  supplierName: string;
  supplierType: string;
  note: string;
};

export type MaterialRecipeItem = {
  recipeCode: string;
  recipeDesc: string;
  productCode: string;
  productName: string;
  productVariant: string;
};

export type AdminMaterial = {
  code: string;
  name: string;
  unit: string;
  stock: number;
  minimumStock: number;
  recipes: MaterialRecipeItem[];
  receipts: MaterialReceiptItem[];
  recipeNames: string;
  lastSupplierName: string;
  lastReceiptDate: string;
};

export type MaterialFormOptions = {
  suppliers: {
    code: string;
    label: string;
    name: string;
    type: string;
  }[];
  recipes: {
    code: string;
    label: string;
    productName: string;
  }[];
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function toAdminMaterial(material: {
  id_bahan: string;
  nama_bahan: string;
  satuan: string;
  stok: { toNumber(): number };
  stok_minimum: { toNumber(): number };
  detail_resep?: {
    id_detailresep: string;
    resep: {
      id_resep: string;
      deskripsi_resep: string;
      id_produk: string;
      produk: {
        id_produk: string;
        nama_produk: string;
        varian: string;
      };
    };
  }[];
  penerimaan_bahan_baku?: {
    id_penerimaan: string;
    tanggal_terima: Date;
    jumlah_diterima: { toNumber(): number };
    keterangan_penerimaan: string;
    id_supplier: string;
    jenis_supplier: {
      id_supplier: string;
      jenis_supplier: string;
      nama_supplier: string;
    };
  }[];
}): AdminMaterial {
  const recipes: MaterialRecipeItem[] = (material.detail_resep ?? []).map((dr) => ({
    recipeCode: dr.resep.id_resep,
    recipeDesc: dr.resep.deskripsi_resep,
    productCode: dr.resep.id_produk,
    productName: dr.resep.produk.nama_produk,
    productVariant: dr.resep.produk.varian,
  }));

  const receipts: MaterialReceiptItem[] = (
    material.penerimaan_bahan_baku ?? []
  ).map((pb) => ({
    id: pb.id_penerimaan,
    receiptDate: formatDate(pb.tanggal_terima),
    amount: pb.jumlah_diterima.toNumber(),
    supplierCode: pb.id_supplier,
    supplierName: pb.jenis_supplier.nama_supplier,
    supplierType: pb.jenis_supplier.jenis_supplier,
    note: pb.keterangan_penerimaan,
  }));

  const recipeNames =
    recipes.map((r) => `${r.productName} (${r.productVariant})`).join(", ") || "—";
  const lastSupplierName = receipts[0]?.supplierName || "—";
  const lastReceiptDate = receipts[0]?.receiptDate || "—";

  return {
    code: material.id_bahan,
    name: material.nama_bahan,
    unit: material.satuan,
    stock: material.stok.toNumber(),
    minimumStock: material.stok_minimum.toNumber(),
    recipes,
    receipts,
    recipeNames,
    lastSupplierName,
    lastReceiptDate,
  };
}

const materialInclude = {
  detail_resep: {
    include: {
      resep: {
        include: {
          produk: true,
        },
      },
    },
  },
  penerimaan_bahan_baku: {
    orderBy: {
      tanggal_terima: "desc" as const,
    },
    include: {
      jenis_supplier: true,
    },
  },
};

export async function listAdminMaterials(adminId: string) {
  const materials = await prisma.bahan_baku.findMany({
    where: { id_admin: adminId },
    orderBy: { id_bahan: "asc" },
    include: materialInclude,
  });

  return materials.map(toAdminMaterial);
}

export async function getAdminMaterial(adminId: string, code: string) {
  const material = await prisma.bahan_baku.findFirst({
    where: {
      id_admin: adminId,
      id_bahan: { equals: code, mode: "insensitive" },
    },
    include: materialInclude,
  });

  return material ? toAdminMaterial(material) : null;
}

export async function getAdminMaterialOptions(): Promise<MaterialFormOptions> {
  const [suppliers, recipes] = await Promise.all([
    prisma.jenis_supplier.findMany({
      orderBy: { id_supplier: "asc" },
      select: {
        id_supplier: true,
        nama_supplier: true,
        jenis_supplier: true,
      },
    }),
    prisma.resep.findMany({
      orderBy: { id_resep: "asc" },
      include: {
        produk: {
          select: { nama_produk: true, varian: true },
        },
      },
    }),
  ]);

  return {
    suppliers: suppliers.map((s) => ({
      code: s.id_supplier,
      label: `${s.nama_supplier} (${s.jenis_supplier})`,
      name: s.nama_supplier,
      type: s.jenis_supplier,
    })),
    recipes: recipes.map((r) => ({
      code: r.id_resep,
      label: `${r.id_resep} — ${r.produk.nama_produk} (${r.produk.varian})`,
      productName: `${r.produk.nama_produk} ${r.produk.varian}`.trim(),
    })),
  };
}
