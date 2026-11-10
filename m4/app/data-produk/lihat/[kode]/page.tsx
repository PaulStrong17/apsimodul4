import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { getProduct } from "../../../../components/data-produk/data";
import { ProductDetail } from "../../../../components/data-produk/product-detail";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function LihatProdukPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <LihatProdukContent params={params} />
    </Suspense>
  );
}

async function LihatProdukContent({ params }: PageProps) {
  const { kode } = await params;
  const product = getProduct(kode);

  if (!product) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb={`Admin / Data Produk / Lihat Detail / ${product.code}`}
    >
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="mb-6 flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Detail Data Produk
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[16px]">
            Contoh detail berdasarkan entitas Produk.
          </p>
        </div>
        <ProductDetail product={product} />
      </div>
    </BahanBakuPageShell>
  );
}
