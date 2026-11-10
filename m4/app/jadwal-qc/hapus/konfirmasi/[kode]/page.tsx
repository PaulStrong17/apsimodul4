import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { QualityDeleteConfirmation } from "../../../../../components/jadwal-qc/quality-delete-confirmation";
import { getQualitySchedule } from "../../../../../components/jadwal-qc/data";
import { QualityPageHeading } from "../../../../../components/jadwal-qc/page-heading";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KonfirmasiHapusJadwalQcPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <KonfirmasiHapusJadwalQcContent params={params} />
    </Suspense>
  );
}

async function KonfirmasiHapusJadwalQcContent({ params }: PageProps) {
  const { kode } = await params;
  const schedule = getQualitySchedule(kode);

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
          <QualityDeleteConfirmation code={schedule.code} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
