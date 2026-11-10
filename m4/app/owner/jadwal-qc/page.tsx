import { OwnerReadOnlyTable } from "../../../components/owner/read-only";
import { OwnerPageHeading, OwnerShell } from "../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../lib/owner/authorization";
import { listOwnerQualitySchedules } from "../../../lib/owner/read-only";

export const instant = false;

export default async function OwnerJadwalQcPage() {
  const owner = await requireOwnerPage();
  const schedules = await listOwnerQualitySchedules(owner.id_owner);

  return (
    <OwnerShell
      activeSection="jadwal-qc"
      breadcrumb="Jadwal QC / Daftar"
      backgroundImage="/images/owner/background-jadwal-qc.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Jadwal QC"
          description="Daftar jadwal pemeriksaan QC hanya untuk dilihat. Klik Lihat untuk membuka rincian."
        />
        <OwnerReadOnlyTable kind="jadwal-qc" rows={schedules} />
      </div>
    </OwnerShell>
  );
}
