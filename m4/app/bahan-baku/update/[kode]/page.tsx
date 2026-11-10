import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuEditForm } from "../../../../components/bahan-baku/edit-form";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { getAdminMaterial } from "../../../../lib/admin/materials";
import { requireAdminPage } from "../../../../lib/admin/authorization";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function EditBahanBakuPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <EditBahanBakuContent params={params} />
    </Suspense>
  );
}

async function EditBahanBakuContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const material = await getAdminMaterial(admin.id_admin, kode);

  if (!material) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Bahan Baku / Update / Edit ${material.code}`}
    >
      <div className="relative flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Edit Data Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Data terpilih: {material.code} — {material.name}. Ubah informasi
            yang diperlukan, lalu simpan perubahan.
          </p>
        </div>
        <BahanBakuEditForm material={material} />
      </div>
    </BahanBakuPageShell>
  );
}
