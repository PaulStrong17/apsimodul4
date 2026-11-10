import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { SchedulePageHeading } from "../../../components/jadwal-produksi/page-heading";
import { ScheduleTable } from "../../../components/jadwal-produksi/schedule-table";

export default function LihatJadwalProduksiPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal Produksi / Lihat Jadwal"
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Lihat Jadwal Produksi"
          description="Pilih jadwal produksi untuk melihat informasi lengkapnya."
        />
        <ScheduleTable mode="view" />
      </div>
    </BahanBakuPageShell>
  );
}
