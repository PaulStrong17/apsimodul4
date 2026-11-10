import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOwnerReport } from "../../../../../../components/owner/data";
import { OwnerReportDeleteSuccess } from "../../../../../../components/owner/reports";
import { OwnerPageHeading, OwnerShell } from "../../../../../../components/owner/owner-shell";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function OwnerReportDeleteSuccessPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <OwnerReportDeleteSuccessContent params={params} />
    </Suspense>
  );
}

async function OwnerReportDeleteSuccessContent({
  params,
}: PageProps) {
  const { kode } = await params;
  const report = getOwnerReport(kode);

  if (!report) notFound();

  return (
    <OwnerShell
      activeSection="rekap-laporan"
      breadcrumb="Rekap Laporan / Hapus / Berhasil"
      backgroundImage="/images/owner/background-laporan.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Hapus Rekap Laporan"
          description="Penghapusan rekap laporan."
        />
        <OwnerReportDeleteSuccess code={report.code} />
      </div>
    </OwnerShell>
  );
}
