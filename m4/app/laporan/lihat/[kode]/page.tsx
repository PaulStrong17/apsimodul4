import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { getReport } from "../../../../components/laporan/data";
import { ReportDetail } from "../../../../components/laporan/report-detail";
import { ReportPageHeading } from "../../../../components/laporan/page-heading";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function LihatDetailLaporanPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <LihatDetailLaporanContent params={params} />
    </Suspense>
  );
}

async function LihatDetailLaporanContent({ params }: PageProps) {
  const { kode } = await params;
  const report = getReport(kode);

  if (!report) notFound();

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Laporan / Lihat Detail / ${report.code}`}
      activeSection="laporan"
      backgroundImage="/images/laporan/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Detail Laporan"
          description="Informasi laporan hanya untuk dilihat dan tidak dapat diubah pada halaman ini."
        />
        <div className="mt-7">
          <ReportDetail report={report} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
