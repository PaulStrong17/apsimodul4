import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../components/bahan-baku/page-shell";
import { ScheduleForm } from "../../../../components/jadwal-produksi/schedule-form";
import { SchedulePageHeading } from "../../../../components/jadwal-produksi/page-heading";
import { getAdminSchedule, getAdminScheduleOptions } from "../../../../lib/admin/schedules";
import { requireAdminPage } from "../../../../lib/admin/authorization";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function EditJadwalProduksiPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <EditJadwalProduksiContent params={params} />
    </Suspense>
  );
}

async function EditJadwalProduksiContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const [schedule, options] = await Promise.all([
    getAdminSchedule(admin.id_admin, kode),
    getAdminScheduleOptions(admin.id_admin),
  ]);

  if (!schedule) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      breadcrumb={`Admin / Jadwal Produksi / Update / Edit ${schedule.code}`}
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Edit Data Jadwal Produksi"
          description={`Data terpilih: ${schedule.code} — Produksi ${schedule.productName}. Ubah informasi yang diperlukan, lalu simpan perubahan.`}
        />
        <div className="mt-7 md:mt-[clamp(28px,3.2vw,46px)]">
          <ScheduleForm mode="edit" schedule={schedule} options={options} />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
