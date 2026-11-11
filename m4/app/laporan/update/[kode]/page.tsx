import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { ReportForm } from "../../../../components/laporan/report-form";
import { ReportPageHeading } from "../../../../components/laporan/page-heading";
import { requireAdminPage } from "../../../../lib/admin/authorization";
import {
  getAdminReport,
  getAdminReportOptions,
} from "../../../../lib/admin/reports";

export const instant = false;

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function EditLaporanPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <EditLaporanContent params={params} />
    </Suspense>
  );
}

async function EditLaporanContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const decodedKode = decodeURIComponent(kode);

  const [report, options] = await Promise.all([
    getAdminReport(admin.id_admin, decodedKode),
    getAdminReportOptions(),
  ]);

  if (!report) notFound();

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Laporan / Update / Edit ${report.code}`}
      activeSection="laporan"
      backgroundImage="/images/laporan/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Edit Data Laporan"
          description={`Data terpilih: ${report.code} — ${report.type}. Ubah informasi yang diperlukan, lalu simpan perubahan.`}
        />
        <div className="mt-7 md:mt-[clamp(28px,3.2vw,46px)]">
          <ReportForm mode="edit" report={report} options={options} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
