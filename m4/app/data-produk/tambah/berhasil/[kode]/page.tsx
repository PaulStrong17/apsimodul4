import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ProductSuccess } from "../../../../../components/data-produk/product-success";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function TambahProdukBerhasilPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <TambahProdukBerhasilContent params={params} />
    </Suspense>
  );
}

async function TambahProdukBerhasilContent({ params }: PageProps) {
  const { kode } = await params;

  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Data Produk / Tambah Produk"
    >
      <div className="relative z-10 flex flex-1 items-center justify-center p-5 md:p-9">
        <ProductSuccess action="added" code={kode} />
      </div>
    </BahanBakuPageShell>
  );
}
