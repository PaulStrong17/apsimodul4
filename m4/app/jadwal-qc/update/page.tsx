import Link from "next/link";
import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { QualityPageHeading } from "../../../components/jadwal-qc/page-heading";
import { QualityTable } from "../../../components/jadwal-qc/quality-table";

export default function DaftarUpdateJadwalQcPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal QC / Update / Daftar"
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Update Jadwal QC"
          description="Cari dan pilih jadwal QC, lalu klik Edit pada baris data yang ingin diperbarui."
        />
        <QualityTable mode="update" />
        <div className="relative z-10 mt-[18px]">
          <Link
            href="/menu-jadwal-qc"
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white/85 px-[18px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
          >
            Kembali ke Menu Jadwal QC
          </Link>
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
