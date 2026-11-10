import Image from "next/image";
import Link from "next/link";
import type { AdminQcSchedule } from "../../lib/admin/qc-schedules";
import { formatShortInspectionDate } from "./data";

type QualityTableProps = {
  mode: "view" | "update" | "delete";
  schedules: AdminQcSchedule[];
};

export function QualityTable({ mode, schedules }: QualityTableProps) {
  return (
    <section className="relative z-10 mt-7 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <h2 className="px-6 py-[18px] text-[17px] font-bold text-[#17263b] md:text-[20px]">
        Data Jadwal QC
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] border-collapse text-left text-[14px] text-[#17263b]">
          <thead className="bg-[#f6f9fc] font-bold">
            <tr>
              <th scope="col" className="w-[90px] px-4 py-4">
                Kode
              </th>
              <th scope="col" className="w-[120px] px-4 py-4">
                Tanggal
              </th>
              <th scope="col" className="w-[190px] px-4 py-4">
                Jenis Pemeriksaan
              </th>
              <th scope="col" className="w-[110px] px-4 py-4">
                Jadwal Produksi
              </th>
              <th scope="col" className="w-[140px] px-4 py-4">
                Karyawan QC
              </th>
              <th scope="col" className="w-[150px] px-4 py-4">
                Status Pemeriksaan
              </th>
              <th scope="col" className="w-[100px] px-4 py-4">
                {mode === "delete" ? "Hapus" : "Aksi"}
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-[#61738a]"
                >
                  Belum ada data jadwal QC.
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr
                  key={schedule.code}
                  className="h-[68px] border-t border-[#d6e3ed] align-middle"
                >
                  <td className="px-4 py-3 text-[#61738a]">{schedule.code}</td>
                  <td className="px-4 py-3 font-bold">
                    {schedule.inspectionDate
                      ? formatShortInspectionDate(schedule.inspectionDate)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{schedule.type}</td>
                  <td className="px-4 py-3">{schedule.productionCode}</td>
                  <td className="px-4 py-3">{schedule.qualityControlEmployee}</td>
                  <td className="px-4 py-3">{schedule.status}</td>
                  <td className="px-4 py-3">
                    {mode === "delete" ? (
                      <Link
                        href={`/jadwal-qc/hapus/konfirmasi/${encodeURIComponent(schedule.code)}`}
                        aria-label={`Hapus jadwal QC ${schedule.code}`}
                        className="inline-flex h-11 w-[52px] items-center justify-center rounded-[9px] bg-[#c9302c]/85 transition-colors hover:bg-[#a72522] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926]"
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
                            ? `/jadwal-qc/update/${encodeURIComponent(schedule.code)}`
                            : `/jadwal-qc/lihat/${encodeURIComponent(schedule.code)}`
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
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex min-h-[62px] items-center justify-between border-t border-[#d6e3ed] px-6 text-[14px] text-[#61738a]">
        <p>Menampilkan {schedules.length} jadwal QC</p>
        <p className="text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}
