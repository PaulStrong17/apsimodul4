import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import {
  AddMaterialSuccessCard,
  AddMaterialSuccessMessage,
} from "../../../../components/bahan-baku/add-success";

export default function TambahBahanBakuBerhasilPage() {
  return (
    <BahanBakuPageShell breadcrumb="Admin / Bahan Baku / Tambah / Selesai">
      <div className="relative z-10 flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Tambah Data Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Penyimpanan tambahan data bahan baku.
          </p>
        </div>

        <div className="flex w-full justify-center pt-2 md:pt-4 lg:pt-10">
          <Suspense fallback={<AddMaterialSuccessCard code="BB-001" />}>
            <AddMaterialSuccessMessage />
          </Suspense>
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
