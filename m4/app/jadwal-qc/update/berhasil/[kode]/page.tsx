import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { QualityPageHeading } from "../../../../../components/jadwal-qc/page-heading";
import { QualitySuccess } from "../../../../../components/jadwal-qc/quality-success";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function UpdateJadwalQcBerhasilPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <UpdateJadwalQcBerhasilContent params={params} />
    </Suspense>
  );
}

async function UpdateJadwalQcBerhasilContent({ params }: PageProps) {
  const { kode } = await params;

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal QC / Update / Berhasil"
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Edit Jadwal QC"
          description="Pengeditan jadwal pemeriksaan QC."
        />
        <div className="relative z-10 mt-6 flex justify-center md:mt-7">
          <QualitySuccess action="updated" code={kode} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
