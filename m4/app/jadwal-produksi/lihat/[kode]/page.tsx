import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { ScheduleDetail } from "../../../../components/jadwal-produksi/schedule-detail";
import { getProductionSchedule } from "../../../../components/jadwal-produksi/data";
import { SchedulePageHeading } from "../../../../components/jadwal-produksi/page-heading";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function LihatDetailJadwalPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <LihatDetailJadwalContent params={params} />
    </Suspense>
  );
}

async function LihatDetailJadwalContent({ params }: PageProps) {
  const { kode } = await params;
  const schedule = getProductionSchedule(kode);

  if (!schedule) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Jadwal Produksi / Lihat Detail / ${schedule.code}`}
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Detail Jadwal Produksi"
          description="Informasi jadwal produksi hanya untuk dilihat dan tidak dapat diubah pada halaman ini."
        />
        <div className="mt-7">
          <ScheduleDetail schedule={schedule} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
