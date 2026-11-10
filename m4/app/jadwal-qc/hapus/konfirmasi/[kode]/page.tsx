import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { QualityDeleteConfirmation } from "../../../../../components/jadwal-qc/quality-delete-confirmation";
import { QualityPageHeading } from "../../../../../components/jadwal-qc/page-heading";
import { requireAdminPage } from "../../../../../lib/admin/authorization";
import { getAdminQcSchedule } from "../../../../../lib/admin/qc-schedules";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default async function KonfirmasiHapusJadwalQcPage({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const schedule = await getAdminQcSchedule(
    admin.id_admin,
    decodeURIComponent(kode),
  );

  if (!schedule) notFound();

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal QC / Hapus / Konfirmasi"
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Hapus Jadwal QC"
          description="Tindakan ini perlu konfirmasi."
        />
        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <QualityDeleteConfirmation
            code={schedule.code}
            type={schedule.type}
          />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
