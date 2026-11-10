import { ownerMaterials } from "../../../components/owner/data";
import { OwnerReadOnlyTable } from "../../../components/owner/read-only";
import { OwnerPageHeading, OwnerShell } from "../../../components/owner/owner-shell";

export default function OwnerBahanBakuPage() {
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
        <OwnerReadOnlyTable kind="bahan-baku" rows={ownerMaterials} />
      </div>
    </OwnerShell>
  );
}
