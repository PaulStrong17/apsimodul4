import { OwnerReadOnlyTable } from "../../../components/owner/read-only";
import { OwnerPageHeading, OwnerShell } from "../../../components/owner/owner-shell";
import { listOwnerMaterials } from "../../../lib/owner/read-only";

export const instant = false;

export default async function OwnerBahanBakuPage() {
  const materials = await listOwnerMaterials();

  return (
    <OwnerShell
      activeSection="bahan-baku"
      breadcrumb="Bahan Baku / Daftar"
      backgroundImage="/images/owner/background-bahan-baku.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Data Bahan Baku"
          description="Daftar bahan baku hanya untuk dilihat. Klik Lihat untuk membuka rincian."
        />
        <OwnerReadOnlyTable kind="bahan-baku" rows={materials} />
      </div>
    </OwnerShell>
  );
}
