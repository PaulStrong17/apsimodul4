import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ReportDeleteConfirmation } from "../../../../../components/laporan/report-delete-confirmation";
import { ReportPageHeading } from "../../../../../components/laporan/page-heading";
import { requireAdminPage } from "../../../../../lib/admin/authorization";
import { getAdminReport } from "../../../../../lib/admin/reports";

export const instant = false;

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KonfirmasiHapusLaporanPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KonfirmasiHapusLaporanContent params={params} />
    </Suspense>
  );
}

async function KonfirmasiHapusLaporanContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const report = await getAdminReport(
    admin.id_admin,
    decodeURIComponent(kode),
  );

  if (!report) notFound();

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Laporan / Hapus / Konfirmasi"
      activeSection="laporan"
      backgroundImage="/images/laporan/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Hapus Laporan"
          description="Tindakan ini perlu konfirmasi."
        />
        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <ReportDeleteConfirmation code={report.code} type={report.type} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
