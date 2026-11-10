import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { ScheduleForm } from "../../../components/jadwal-produksi/schedule-form";
import { SchedulePageHeading } from "../../../components/jadwal-produksi/page-heading";
import { getAdminScheduleOptions } from "../../../lib/admin/schedules";
import { requireAdminPage } from "../../../lib/admin/authorization";

export const instant = false;

export default async function TambahJadwalProduksiPage() {
  const admin = await requireAdminPage();
  const options = await getAdminScheduleOptions(admin.id_admin);

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal Produksi / Tambah"
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Tambah Jadwal Produksi"
          description="Isi informasi jadwal produksi baru sebelum menyimpan data."
        />
        <div className="mt-7 md:mt-[clamp(28px,3.2vw,46px)]">
          <ScheduleForm mode="create" options={options} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
