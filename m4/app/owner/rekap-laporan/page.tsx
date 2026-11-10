import { OwnerReportTable } from "../../../components/owner/reports";
import { OwnerPageHeading, OwnerShell } from "../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../lib/owner/authorization";
import { listOwnerReports } from "../../../lib/owner/reports";

export const instant = false;

export default async function OwnerReportListPage() {
  const owner = await requireOwnerPage();
  const reports = await listOwnerReports(owner.id_owner);

  return (
    <OwnerShell
      activeSection="rekap-laporan"
      breadcrumb="Rekap Laporan / Daftar"
      backgroundImage="/images/owner/background-laporan.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Rekap Laporan"
          description="Lihat rekap laporan produksi dan mutu. Owner dapat melihat dan menghapus rekap laporan."
        />
        <OwnerReportTable reports={reports} />
      </div>
    </OwnerShell>
  );
}
