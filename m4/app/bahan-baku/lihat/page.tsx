import { BahanBakuDataTable } from "../../../components/bahan-baku/data-table";
import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { listAdminMaterials } from "../../../lib/admin/materials";
import { requireAdminPage } from "../../../lib/admin/authorization";

export const instant = false;

export default async function LihatBahanBakuListPage() {
  const admin = await requireAdminPage();
  const materials = await listAdminMaterials(admin.id_admin);

  return (
    <BahanBakuPageShell breadcrumb="Admin / Bahan Baku / Daftar">
      <div className="relative flex flex-1 flex-col gap-6 p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Daftar Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Data stok dan satuan yang tersimpan di database.
          </p>
        </div>

        <BahanBakuDataTable action="view" materials={materials} />
      </div>
    </BahanBakuPageShell>
  );
}
