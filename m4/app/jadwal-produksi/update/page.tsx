import Link from "next/link";
import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { SchedulePageHeading } from "../../../components/jadwal-produksi/page-heading";
import { ScheduleTable } from "../../../components/jadwal-produksi/schedule-table";
import { listAdminSchedules } from "../../../lib/admin/schedules";
import { requireAdminPage } from "../../../lib/admin/authorization";

export const instant = false;

export default async function DaftarUpdateJadwalProduksiPage() {
  const admin = await requireAdminPage();
  const schedules = await listAdminSchedules(admin.id_admin);

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal Produksi / Update / Daftar"
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Update Jadwal Produksi"
          description="Cari dan pilih jadwal produksi, lalu klik Edit pada baris data yang ingin diperbarui."
        />
        <ScheduleTable mode="update" schedules={schedules} />
        <div className="relative z-10 mt-[18px]">
          <Link
            href="/menu-jadwal-produksi"
            className="inline-flex min-h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white/85 px-[18px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
          >
            Kembali ke Menu Jadwal Produksi
          </Link>
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
