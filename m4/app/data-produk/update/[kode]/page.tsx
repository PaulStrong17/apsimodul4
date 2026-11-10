import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { ProductForm } from "../../../../components/data-produk/product-form";
import { getAdminProduct } from "../../../../lib/admin/products";
import { requireAdminPage } from "../../../../lib/admin/authorization";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function EditProdukPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <EditProdukContent params={params} />
    </Suspense>
  );
}

async function EditProdukContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const product = await getAdminProduct(admin.id_admin, kode);

  if (!product) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb={`Admin / Data Produk / Update Produk / ${product.code}`}
    >
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="mb-6 flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Perbarui Data Produk
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[16px]">
            Form terisi dengan data yang sudah ada.
          </p>
        </div>
        <ProductForm mode="edit" product={product} />
      </div>
    </BahanBakuPageShell>
  );
}
