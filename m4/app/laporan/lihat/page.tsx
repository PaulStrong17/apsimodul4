import Link from "next/link";
import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { ReportPageHeading } from "../../../components/laporan/page-heading";
import { ReportTable } from "../../../components/laporan/report-table";

export default function LihatLaporanPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Laporan / Lihat Laporan"
      activeSection="laporan"
      backgroundImage="/images/laporan/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Lihat Laporan"
          description="Pilih laporan untuk melihat informasi lengkapnya."
        />
        <ReportTable mode="view" />
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
