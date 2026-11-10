import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ProductSuccess } from "../../../../../components/data-produk/product-success";

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
