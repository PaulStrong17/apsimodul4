import Link from "next/link";
import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { ReportPageHeading } from "../../../components/laporan/page-heading";
import { ReportTable } from "../../../components/laporan/report-table";
import { requireAdminPage } from "../../../lib/admin/authorization";
import { listAdminReports } from "../../../lib/admin/reports";

export const instant = false;

export default async function HapusLaporanPage() {
  const admin = await requireAdminPage();
  const reports = await listAdminReports(admin.id_admin);

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Laporan / Hapus / Daftar"
      activeSection="laporan"
      backgroundImage="/images/laporan/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Hapus Laporan"
          description="Pilih laporan dari daftar sebelum melakukan penghapusan."
        />
        <ReportTable mode="delete" reports={reports} />
        <div className="relative z-10 mt-[18px]">
          <Link
            href="/menu-laporan"
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white/85 px-[18px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
          >
            Kembali ke Menu Laporan
          </Link>
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
