import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { BahanBakuAddForm } from "../../../components/bahan-baku/add-form";

export default function TambahBahanBakuPage() {
  return (
    <BahanBakuPageShell breadcrumb="Admin / Bahan Baku / Tambah">
      <div className="relative z-10 flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Tambah Data Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Isi informasi bahan baku baru sebelum menyimpan data.
          </p>
        </div>
        <BahanBakuAddForm />
      </div>
    </BahanBakuPageShell>
  );
}
