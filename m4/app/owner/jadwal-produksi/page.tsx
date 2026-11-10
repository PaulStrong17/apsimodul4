import { OwnerReadOnlyTable } from "../../../components/owner/read-only";
import { OwnerPageHeading, OwnerShell } from "../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../lib/owner/authorization";
import { listOwnerProductionSchedules } from "../../../lib/owner/read-only";

export const instant = false;

export default async function OwnerJadwalProduksiPage() {
  const owner = await requireOwnerPage();
  const schedules = await listOwnerProductionSchedules(owner.id_owner);

  return (
    <OwnerShell
      activeSection="jadwal-produksi"
      breadcrumb="Jadwal Produksi / Daftar"
      backgroundImage="/images/owner/background-jadwal-produksi.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Jadwal Produksi"
          description="Daftar jadwal produksi hanya untuk dilihat. Klik Lihat untuk membuka rincian."
        />
        <OwnerReadOnlyTable
          kind="jadwal-produksi"
          rows={schedules}
        />
      </div>
    </OwnerShell>
  );
}
