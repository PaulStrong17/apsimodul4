import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseProductCreateInput } from "@/lib/admin/product-input";
import { listAdminProducts } from "@/lib/admin/products";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  try {
    return NextResponse.json({
      products: await listAdminProducts(authorization.adminId),
    });
  } catch (error) {
    console.error("Could not load products:", error);
    return NextResponse.json(
      { error: "Data produk tidak dapat dimuat." },
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
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const product = parseProductCreateInput(body);
  if (!product) {
    return NextResponse.json(
      { error: "Periksa kode, nama, varian, stok, dan resep produk." },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.produk.create({
      data: {
        id_produk: product.code,
        nama_produk: product.name,
        varian: product.variation,
        stok_produk: product.stock,
        resep_produk: product.recipe,
        admin: { connect: { id_admin: authorization.adminId } },
      },
      select: { id_produk: true },
    });

    return NextResponse.json({ code: created.id_produk }, { status: 201 });
  } catch (error) {
    console.error("Could not create product:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Kode produk tersebut sudah digunakan." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan produk." },
      { status: 500 },
    );
  }
}
