import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OwnerReportDetail } from "../../../../components/owner/reports";
import { OwnerPageHeading, OwnerShell } from "../../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../../lib/owner/authorization";
import { getOwnerReport } from "../../../../lib/owner/reports";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function OwnerReportDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <OwnerReportDetailContent params={params} />
    </Suspense>
  );
}

async function OwnerReportDetailContent({ params }: PageProps) {
  const { kode } = await params;
  const owner = await requireOwnerPage();
  const report = await getOwnerReport(owner.id_owner, kode);

  if (!report) notFound();

  return (
    <OwnerShell
      activeSection="rekap-laporan"
      breadcrumb={`Rekap Laporan / Lihat Detail / ${report.code}`}
      backgroundImage="/images/owner/background-laporan.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Detail Rekap Laporan"
          description="Rincian rekap laporan. Owner dapat melihat dan menghapus rekap laporan ini."
        />
        <OwnerReportDetail report={report} />
      </div>
    </OwnerShell>
  );
}
