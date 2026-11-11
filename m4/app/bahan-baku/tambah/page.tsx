import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { BahanBakuAddForm } from "../../../components/bahan-baku/add-form";
import { requireAdminPage } from "../../../lib/admin/authorization";
import { getAdminMaterialOptions } from "../../../lib/admin/materials";

export const instant = false;

export default async function TambahBahanBakuPage() {
  await requireAdminPage();
  const options = await getAdminMaterialOptions();

  return (
    <BahanBakuPageShell breadcrumb="Admin / Bahan Baku / Tambah">
      <div className="relative z-10 flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Tambah Data Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Isi informasi bahan baku baru beserta resep dan penerimaan supplier sesuai ERD.
          </p>
        </div>
        <BahanBakuAddForm options={options} />
      </div>
    </BahanBakuPageShell>
  );
}
