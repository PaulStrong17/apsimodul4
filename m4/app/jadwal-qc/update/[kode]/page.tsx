import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { QualityForm } from "../../../../components/jadwal-qc/quality-form";
import { QualityPageHeading } from "../../../../components/jadwal-qc/page-heading";
import { requireAdminPage } from "../../../../lib/admin/authorization";
import {
  getAdminQcSchedule,
  getAdminQcScheduleOptions,
} from "../../../../lib/admin/qc-schedules";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default async function EditJadwalQcPage({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const decodedKode = decodeURIComponent(kode);

  const [schedule, options] = await Promise.all([
    getAdminQcSchedule(admin.id_admin, decodedKode),
    getAdminQcScheduleOptions(admin.id_admin),
  ]);

  if (!schedule) notFound();

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Jadwal QC / Update / Edit ${schedule.code}`}
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Edit Data Jadwal QC"
          description={`Data terpilih: ${schedule.code} — ${schedule.type}. Ubah informasi yang diperlukan, lalu simpan perubahan.`}
        />
        <div className="mt-7 md:mt-[clamp(28px,3.2vw,46px)]">
          <QualityForm mode="edit" schedule={schedule} options={options} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
