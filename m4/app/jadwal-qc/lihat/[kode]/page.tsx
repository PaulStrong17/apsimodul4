import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { QualityDetail } from "../../../../components/jadwal-qc/quality-detail";
import { QualityPageHeading } from "../../../../components/jadwal-qc/page-heading";
import { requireAdminPage } from "../../../../lib/admin/authorization";
import { getAdminQcSchedule } from "../../../../lib/admin/qc-schedules";

export const instant = false;

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function LihatDetailJadwalQcPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <LihatDetailJadwalQcContent params={params} />
    </Suspense>
  );
}

async function LihatDetailJadwalQcContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const schedule = await getAdminQcSchedule(
    admin.id_admin,
    decodeURIComponent(kode),
  );

  if (!schedule) notFound();

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Jadwal QC / Lihat Detail / ${schedule.code}`}
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Detail Jadwal QC"
          description="Informasi jadwal pemeriksaan QC hanya untuk dilihat dan tidak dapat diubah pada halaman ini."
        />
        <div className="mt-7">
          <QualityDetail schedule={schedule} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
