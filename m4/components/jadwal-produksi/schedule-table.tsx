import Image from "next/image";
import Link from "next/link";
import {
  formatProductionDate,
  getProductRequestLabel,
  productionSchedules,
} from "./data";

type ScheduleTableProps = {
  mode: "view" | "update" | "delete";
};

export function ScheduleTable({ mode }: ScheduleTableProps) {
  const actionHeading = mode === "delete" ? "Hapus" : "Aksi";

  return (
    <section className="relative z-10 mt-7 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.9)]">
      <h2 className="px-6 py-[18px] text-[17px] font-bold text-[#17263b] md:text-[19px]">
        Data Jadwal Produksi
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-left text-[14px] text-[#17263b]">
          <thead className="bg-[#eef5fa] font-bold">
            <tr>
              <th scope="col" className="w-[100px] px-4 py-4">
                Kode
              </th>
              <th scope="col" className="w-[145px] px-4 py-4">
                Tanggal Produksi
              </th>
              <th scope="col" className="w-[245px] px-4 py-4">
                Permintaan Produk
              </th>
              <th scope="col" className="w-[110px] px-4 py-4">
                Target
              </th>
              <th scope="col" className="w-[185px] px-4 py-4">
                Karyawan Produksi
              </th>
              <th scope="col" className="w-[175px] px-4 py-4">
                Status Jadwal
              </th>
              <th scope="col" className="w-[120px] px-4 py-4">
                {actionHeading}
              </th>
            </tr>
          </thead>
          <tbody>
            {productionSchedules.map((schedule) => (
              <tr
                key={schedule.code}
                className="h-[68px] border-t border-[#d6e3ed] align-middle"
              >
                <td className="px-4 py-3 text-[#61738a]">{schedule.code}</td>
                <td className="px-4 py-3 font-bold">
                  {formatProductionDate(schedule.productionDate)}
                </td>
                <td className="px-4 py-3">
                  {getProductRequestLabel(schedule)}
                </td>
                <td className="px-4 py-3">{schedule.target} pcs</td>
                <td className="px-4 py-3">{schedule.productionEmployee}</td>
                <td className="px-4 py-3">{schedule.status}</td>
                <td className="px-4 py-3">
                  {mode === "delete" ? (
                    <Link
                      href={`/jadwal-produksi/hapus/konfirmasi/${schedule.code}`}
                      aria-label={`Hapus jadwal ${schedule.code}`}
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
                          ? `/jadwal-produksi/update/${schedule.code}`
                          : `/jadwal-produksi/lihat/${schedule.code}`
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] border border-[#d6e3ed] bg-white/70 px-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
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
        <p>Menampilkan 1–5 dari 5 jadwal produksi</p>
        <p className="text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}
