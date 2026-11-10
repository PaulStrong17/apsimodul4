import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuDeleteConfirmation } from "../../../../../components/bahan-baku/delete-confirmation";
import { getBahanBaku } from "../../../../../components/bahan-baku/data";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KonfirmasiHapusBahanBakuPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KonfirmasiHapusBahanBakuContent params={params} />
    </Suspense>
  );
}

async function KonfirmasiHapusBahanBakuContent({ params }: PageProps) {
  const { kode } = await params;
  const material = getBahanBaku(kode);

  if (!material) {
    notFound();
  }

  return (
    <BahanBakuPageShell breadcrumb="Admin / Pengelolaan Data">
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Hapus Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[16px]">
            Tindakan ini perlu konfirmasi.
          </p>
        </div>
        <div className="mt-[clamp(80px,10.4vw,150px)] flex w-full justify-center">
          <BahanBakuDeleteConfirmation material={material} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
