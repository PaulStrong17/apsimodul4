import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { QualityPageHeading } from "../../../../../components/jadwal-qc/page-heading";
import { QualitySuccess } from "../../../../../components/jadwal-qc/quality-success";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function TambahJadwalQcBerhasilPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <TambahJadwalQcBerhasilContent params={params} />
    </Suspense>
  );
}

async function TambahJadwalQcBerhasilContent({ params }: PageProps) {
  const { kode } = await params;

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal QC / Tambah / Berhasil"
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Tambah Jadwal QC"
          description="Penambahan jadwal pemeriksaan QC."
        />
        <div className="relative z-10 mt-6 flex justify-center md:mt-7">
          <QualitySuccess action="added" code={kode} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
