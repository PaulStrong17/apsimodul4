import { Suspense } from "react";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ReportPageHeading } from "../../../../../components/laporan/page-heading";
import { ReportSuccess } from "../../../../../components/laporan/report-success";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function UpdateLaporanBerhasilPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <UpdateLaporanBerhasilContent params={params} />
    </Suspense>
  );
}

async function UpdateLaporanBerhasilContent({ params }: PageProps) {
  const { kode } = await params;

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Laporan / Update / Berhasil"
      activeSection="laporan"
      backgroundImage="/images/laporan/background-success.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Edit Laporan"
          description="Pengeditan laporan."
        />
        <div className="relative z-10 mt-6 flex justify-center md:mt-7">
          <ReportSuccess action="updated" code={kode} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
