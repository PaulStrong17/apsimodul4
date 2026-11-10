import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuDetail } from "../../../../components/bahan-baku/material-detail";
import { getBahanBaku } from "../../../../components/bahan-baku/data";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function LihatBahanBakuPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <LihatBahanBakuContent params={params} />
    </Suspense>
  );
}

async function LihatBahanBakuContent({ params }: PageProps) {
  const { kode } = await params;
  const material = getBahanBaku(kode);

  if (!material) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Bahan Baku / Lihat Detail / ${material.code}`}
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <BahanBakuDetail material={material} />
      </div>
    </BahanBakuPageShell>
  );
}
