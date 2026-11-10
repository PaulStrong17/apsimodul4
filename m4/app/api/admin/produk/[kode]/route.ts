import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseProductUpdateInput } from "@/lib/admin/product-input";
import { getAdminProduct } from "@/lib/admin/products";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ kode: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;

  try {
    const product = await getAdminProduct(authorization.adminId, kode);
    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Could not load product:", error);
    return NextResponse.json(
      { error: "Data produk tidak dapat dimuat." },
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
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const product = parseProductUpdateInput(body);
  if (!product) {
    return NextResponse.json(
      { error: "Periksa nama, varian, stok, dan resep produk." },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.produk.updateMany({
      where: { id_admin: authorization.adminId, id_produk: kode },
      data: {
        nama_produk: product.name,
        varian: product.variation,
        stok_produk: product.stock,
        resep_produk: product.recipe,
      },
    });
    if (result.count === 0) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ code: kode });
  } catch (error) {
    console.error("Could not update product:", error);
    return NextResponse.json(
      { error: "Produk tidak dapat diperbarui." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;

  try {
    const result = await prisma.produk.deleteMany({
      where: { id_admin: authorization.adminId, id_produk: kode },
    });
    if (result.count === 0) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ code: kode });
  } catch (error) {
    console.error("Could not delete product:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Produk tidak dapat dihapus karena masih digunakan oleh resep atau permintaan produksi.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus produk." },
      { status: 500 },
    );
  }
}
