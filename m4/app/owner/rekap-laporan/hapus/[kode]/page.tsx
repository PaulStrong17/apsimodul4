import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OwnerReportDeleteConfirmation } from "../../../../../components/owner/reports";
import { OwnerPageHeading, OwnerShell } from "../../../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../../../lib/owner/authorization";
import { getOwnerReport } from "../../../../../lib/owner/reports";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function OwnerReportDeletePage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <OwnerReportDeleteContent params={params} />
    </Suspense>
  );
}

async function OwnerReportDeleteContent({ params }: PageProps) {
  const { kode } = await params;
  const owner = await requireOwnerPage();
  const report = await getOwnerReport(owner.id_owner, kode);

  if (!report) notFound();

  return (
    <OwnerShell
      activeSection="rekap-laporan"
      breadcrumb="Rekap Laporan / Hapus / Konfirmasi"
      backgroundImage="/images/owner/background-laporan.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Hapus Rekap Laporan"
          description="Tindakan ini perlu konfirmasi."
        />
        <OwnerReportDeleteConfirmation code={report.code} />
      </div>
    </OwnerShell>
  );
}
