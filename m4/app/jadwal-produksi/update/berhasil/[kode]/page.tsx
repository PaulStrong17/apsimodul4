import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { SchedulePageHeading } from "../../../../../components/jadwal-produksi/page-heading";
import { ScheduleSuccess } from "../../../../../components/jadwal-produksi/schedule-success";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function EditJadwalBerhasilPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <EditJadwalBerhasilContent params={params} />
    </Suspense>
  );
}

async function EditJadwalBerhasilContent({ params }: PageProps) {
  const { kode } = await params;

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal Produksi / Update / Berhasil"
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Edit Jadwal Produksi"
          description="Pengeditan jadwal produksi."
        />
        <div className="relative z-10 mt-6 flex justify-center md:mt-7">
          <ScheduleSuccess action="updated" code={kode} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
