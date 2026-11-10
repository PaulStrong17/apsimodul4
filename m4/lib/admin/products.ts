import { prisma } from "@/lib/prisma";
import type { AdminProduct } from "@/components/data-produk/data";

function toAdminProduct(product: {
  id_produk: string;
  nama_produk: string;
  varian: string;
  stok_produk: number;
  resep_produk: string;
}): AdminProduct {
  return {
    code: product.id_produk,
    name: product.nama_produk,
    variation: product.varian,
    stock: product.stok_produk,
    recipe: product.resep_produk,
  };
}

export async function listAdminProducts(adminId: string) {
  const products = await prisma.produk.findMany({
    where: { id_admin: adminId },
    orderBy: { id_produk: "asc" },
    select: {
      id_produk: true,
      nama_produk: true,
      varian: true,
      stok_produk: true,
      resep_produk: true,
    },
  });

  return products.map(toAdminProduct);
}

export async function getAdminProduct(adminId: string, code: string) {
  const product = await prisma.produk.findFirst({
    where: { id_admin: adminId, id_produk: code },
    select: {
      id_produk: true,
      nama_produk: true,
      varian: true,
      stok_produk: true,
      resep_produk: true,
    },
  });

  return product ? toAdminProduct(product) : null;
}
