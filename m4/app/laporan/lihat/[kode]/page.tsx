import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { ReportDetail } from "../../../../components/laporan/report-detail";
import { ReportPageHeading } from "../../../../components/laporan/page-heading";
import { requireAdminPage } from "../../../../lib/admin/authorization";
import { getAdminReport } from "../../../../lib/admin/reports";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default async function LihatDetailLaporanPage({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const report = await getAdminReport(admin.id_admin, decodeURIComponent(kode));

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
