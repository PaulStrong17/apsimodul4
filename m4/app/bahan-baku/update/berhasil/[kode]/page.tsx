import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MaterialActionSuccessCard } from "../../../../../components/bahan-baku/material-action-success";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { getAdminMaterial } from "../../../../../lib/admin/materials";
import { requireAdminPage } from "../../../../../lib/admin/authorization";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function UpdateBahanBakuBerhasilPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <UpdateBahanBakuBerhasilContent params={params} />
    </Suspense>
  );
}

async function UpdateBahanBakuBerhasilContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const material = await getAdminMaterial(admin.id_admin, kode);

  if (!material) {
    notFound();
  }

  return (
    <BahanBakuPageShell breadcrumb="Admin / Bahan Baku / Update / Konfirmasi">
      <div className="relative z-10 flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Edit Data Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Penyimpanan tambahan data bahan baku.
          </p>
        </div>
        <div className="flex w-full justify-center pt-[40px]">
          <MaterialActionSuccessCard action="updated" code={material.code} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
