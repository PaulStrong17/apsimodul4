import Link from "next/link";
import {
  formatFullReportPeriod,
  formatRejectRate,
  formatReportNumber,
  type ProductionReport,
} from "./data";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <dt className="text-[14px] text-[#61738a] md:text-[16px]">{label}</dt>
      <dd className="text-[16px] font-bold leading-[1.4] text-[#17263b] md:text-[18px]">
        {value}
      </dd>
    </div>
  );
}

export function ReportDetail({ report }: { report: ProductionReport }) {
  return (
    <section className="relative z-10 w-full max-w-[900px] rounded-[14px] border border-[#d6e3ed] bg-white p-5 md:gap-7 md:p-6">
      <div>
        <h2 className="text-[18px] font-bold text-[#17263b] md:text-[24px]">
          {report.type}
        </h2>
        <p className="mt-1 text-[14px] text-[#61738a] md:text-[17px]">
          {report.code}
        </p>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#d6e3ed] pt-5 sm:grid-cols-2 md:mt-6 md:gap-y-6 md:pt-6">
        <DetailField label="Periode" value={formatFullReportPeriod(report)} />
        <DetailField
          label="Total Produksi"
          value={`${formatReportNumber(report.totalProduction)} pcs`}
        />
        <DetailField
          label="Jumlah Pemeriksaan"
          value={`${formatReportNumber(report.inspectionCount)} pemeriksaan`}
        />
        <DetailField
          label="Reject Rate"
          value={formatRejectRate(report.rejectRate)}
        />
        <DetailField
          label="Target Reject Rate"
          value={formatRejectRate(report.targetRejectRate)}
        />
        <DetailField
          label="Status Pencapaian"
          value={report.achievement}
        />
        <DetailField
          label="Owner Penerima Laporan"
          value={report.owner}
        />
        <DetailField label="Dicatat oleh" value={report.createdBy} />
      </dl>
      <div className="mt-5 border-t border-[#d6e3ed] pt-5">
        <h3 className="text-[14px] text-[#61738a] md:text-[16px]">
          Hasil Tindakan Perbaikan
        </h3>
        <p className="mt-2 text-[15px] leading-[1.5] text-[#17263b] md:text-[17px]">
          {report.correctiveAction}
        </p>
      </div>
      <Link
        href="/laporan/lihat"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] font-semibold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
      >
        Kembali
      </Link>
    </section>
  );
}
