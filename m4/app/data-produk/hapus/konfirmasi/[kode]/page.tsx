import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ProductDeleteConfirmation } from "../../../../../components/data-produk/delete-confirmation";
import { getProduct } from "../../../../../components/data-produk/data";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KonfirmasiHapusProdukPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KonfirmasiHapusProdukContent params={params} />
    </Suspense>
  );
}

async function KonfirmasiHapusProdukContent({ params }: PageProps) {
  const { kode } = await params;
  const product = getProduct(kode);

  if (!product) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Pengelolaan Data"
    >
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Hapus Produk
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[16px]">
            Tindakan ini perlu konfirmasi.
          </p>
        </div>
        <div className="mt-[clamp(80px,10.4vw,150px)] flex w-full justify-center">
          <ProductDeleteConfirmation product={product} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
