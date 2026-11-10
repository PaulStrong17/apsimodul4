import Link from "next/link";
import { BahanBakuDataTable } from "../../../components/bahan-baku/data-table";
import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";

export default function UpdateBahanBakuPage() {
  return (
    <BahanBakuPageShell breadcrumb="Admin / Bahan Baku / Update / Daftar">
      <div className="relative flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Update Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Cari dan pilih bahan baku, lalu klik Edit pada baris data yang ingin
            diperbarui.
          </p>
        </div>

        <BahanBakuDataTable action="edit" />

        <Link
          href="/menu-bahan-baku"
          className="inline-flex h-11 w-fit items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] text-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:text-[17px]"
        >
          Kembali ke Menu Bahan Baku
        </Link>
      </div>
    </BahanBakuPageShell>
  );
}
