import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ProductSuccess } from "../../../../../components/data-produk/product-success";
import { getAdminProduct } from "../../../../../lib/admin/products";
import { requireAdminPage } from "../../../../../lib/admin/authorization";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function UpdateProdukBerhasilPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <UpdateProdukBerhasilContent params={params} />
    </Suspense>
  );
}

async function UpdateProdukBerhasilContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const product = await getAdminProduct(admin.id_admin, kode);
  if (!product) notFound();

  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Data Produk / Update Produk"
    >
      <div className="relative z-10 flex flex-1 items-center justify-center p-5 md:p-9">
        <ProductSuccess action="updated" code={kode} />
      </div>
    </BahanBakuPageShell>
  );
}
