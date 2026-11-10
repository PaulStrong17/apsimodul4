import Link from "next/link";
import { formatProductionDate } from "./data";
import type { AdminProductionSchedule } from "../../lib/admin/schedules";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <dt className="text-[14px] text-[#61738a]">{label}</dt>
      <dd className="text-[16px] font-bold leading-[1.4] text-[#17263b] md:text-[17px]">
        {value}
      </dd>
    </div>
  );
}

export function ScheduleDetail({
  schedule,
}: {
  schedule: AdminProductionSchedule;
}) {
  return (
    <section className="relative z-10 w-full max-w-[900px] rounded-[14px] border border-[#d6e3ed] bg-white px-5 py-5 md:px-6 md:py-6">
      <h2 className="text-[18px] font-bold text-[#17263b] md:text-[22px]">
        Produksi {schedule.productName}
      </h2>
      <p className="mt-1 text-[14px] text-[#61738a]">{schedule.code}</p>
      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-[#d6e3ed] pt-6 sm:grid-cols-2">
        <DetailField
          label="Tanggal Produksi"
          value={formatProductionDate(schedule.productionDate)}
        />
        <DetailField label="Jumlah Target" value={`${schedule.target} pcs`} />
        <DetailField label="Permintaan Produk" value={schedule.requestLabel} />
        <DetailField label="Status Jadwal" value={schedule.status} />
        <DetailField
          label="Karyawan Produksi"
          value={schedule.productionEmployee}
        />
        <DetailField
          label="Karyawan QC"
          value={schedule.qualityControlEmployee}
        />
        <DetailField
          label="Status Verifikasi"
          value={schedule.verificationStatus}
        />
        <DetailField label="Owner Penanggung Jawab" value={schedule.owner} />
      </dl>
      <Link
        href="/jadwal-produksi/lihat"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] font-semibold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
      >
        Kembali
      </Link>
    </section>
  );
}
