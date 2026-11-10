import Image from "next/image";
import Link from "next/link";
import {
  formatReportNumber,
  formatRejectRate,
  formatShortReportPeriod,
  reports,
} from "./data";

type ReportTableProps = {
  mode: "view" | "update" | "delete";
};

export function ReportTable({ mode }: ReportTableProps) {
  return (
    <section className="relative z-10 mt-7 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <h2 className="px-6 py-[18px] text-[17px] font-bold text-[#17263b] md:text-[20px]">
        Data Laporan
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left text-[14px] text-[#17263b]">
          <thead className="bg-[#f6f9fc] font-bold">
            <tr>
              <th scope="col" className="w-[90px] px-4 py-4">
                Kode
              </th>
              <th scope="col" className="w-[170px] px-4 py-4">
                Jenis Laporan
              </th>
              <th scope="col" className="w-[190px] px-4 py-4">
                Periode
              </th>
              <th scope="col" className="w-[120px] px-4 py-4">
                Total Produksi
              </th>
              <th scope="col" className="w-[100px] px-4 py-4">
                Reject Rate
              </th>
              <th scope="col" className="w-[160px] px-4 py-4">
                Status Pencapaian
              </th>
              <th scope="col" className="w-[100px] px-4 py-4">
                {mode === "delete" ? "Hapus" : "Aksi"}
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.code}
                className="h-[68px] border-t border-[#d6e3ed] align-middle"
              >
                <td className="px-4 py-3 text-[#61738a]">{report.code}</td>
                <td className="px-4 py-3 font-bold">{report.type}</td>
                <td className="px-4 py-3">
                  {formatShortReportPeriod(report)}
                </td>
                <td className="px-4 py-3">
                  {formatReportNumber(report.totalProduction)} pcs
                </td>
                <td className="px-4 py-3">
                  {formatRejectRate(report.rejectRate)}
                </td>
                <td className="px-4 py-3">{report.achievement}</td>
                <td className="px-4 py-3">
                  {mode === "delete" ? (
                    <Link
                      href={`/laporan/hapus/konfirmasi/${report.code}`}
                      aria-label={`Hapus laporan ${report.code}`}
                      className="inline-flex h-11 w-[52px] items-center justify-center rounded-[9px] bg-[#b82926] transition-colors hover:bg-[#9d201e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926]"
                    >
                      <Image
                        src="/images/bahan-baku/icon-trash.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="brightness-0 invert"
                      />
                    </Link>
                  ) : (
                    <Link
                      href={
                        mode === "update"
                          ? `/laporan/update/${report.code}`
                          : `/laporan/lihat/${report.code}`
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] border border-[#d6e3ed] bg-white px-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
                    >
                      <Image
                        src={
                          mode === "update"
                            ? "/images/bahan-baku/icon-edit.svg"
                            : "/images/bahan-baku/icon-eye.svg"
                        }
                        alt=""
                        width={16}
                        height={16}
                      />
                      {mode === "update" ? "Edit" : "Lihat"}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex min-h-[62px] items-center justify-between border-t border-[#d6e3ed] px-6 text-[14px] text-[#61738a]">
        <p>Menampilkan 1–5 dari 5 laporan</p>
        <p className="text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}
