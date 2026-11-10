import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { SchedulePageHeading } from "../../../../../components/jadwal-produksi/page-heading";
import { ScheduleSuccess } from "../../../../../components/jadwal-produksi/schedule-success";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function HapusJadwalBerhasilPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <HapusJadwalBerhasilContent params={params} />
    </Suspense>
  );
}

async function HapusJadwalBerhasilContent({ params }: PageProps) {
  const { kode } = await params;

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal Produksi / Hapus / Berhasil"
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Hapus Jadwal Produksi"
          description="Penghapusan jadwal produksi."
        />
        <div className="relative z-10 mt-6 flex justify-center md:mt-7">
          <ScheduleSuccess action="deleted" code={kode} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
