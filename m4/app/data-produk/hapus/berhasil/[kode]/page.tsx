import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ProductSuccess } from "../../../../../components/data-produk/product-success";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function HapusProdukBerhasilPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <HapusProdukBerhasilContent params={params} />
    </Suspense>
  );
}

async function HapusProdukBerhasilContent({ params }: PageProps) {
  const { kode } = await params;

  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Data Produk / Hapus Produk"
    >
      <div className="relative z-10 flex flex-1 items-center justify-center p-5 md:p-9">
        <ProductSuccess action="deleted" code={kode} />
      </div>
    </BahanBakuPageShell>
  );
}
