import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MaterialActionSuccessCard } from "../../../../../components/bahan-baku/material-action-success";
import { getBahanBaku } from "../../../../../components/bahan-baku/data";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function HapusBahanBakuBerhasilPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <HapusBahanBakuBerhasilContent params={params} />
    </Suspense>
  );
}

async function HapusBahanBakuBerhasilContent({ params }: PageProps) {
  const { kode } = await params;
  const material = getBahanBaku(kode);

  if (!material) {
    notFound();
  }

  return (
    <BahanBakuPageShell breadcrumb="Owner / Rekap Laporan / Hapus / Konfirmasi">
      <div className="relative z-10 flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Hapus Data Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Penghapusan data bahan baku.
          </p>
        </div>
        <div className="flex w-full justify-center pt-[40px]">
          <MaterialActionSuccessCard action="deleted" code={material.code} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
