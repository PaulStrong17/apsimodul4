import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BahanBakuPageShell } from "../../../../../components/bahan-baku/page-shell";
import { ScheduleDeleteConfirmation } from "../../../../../components/jadwal-produksi/schedule-delete-confirmation";
import { SchedulePageHeading } from "../../../../../components/jadwal-produksi/page-heading";
import { getAdminSchedule } from "../../../../../lib/admin/schedules";
import { requireAdminPage } from "../../../../../lib/admin/authorization";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KonfirmasiHapusJadwalPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}
    >
      <KonfirmasiHapusJadwalContent params={params} />
    </Suspense>
  );
}

async function KonfirmasiHapusJadwalContent({ params }: PageProps) {
  const { kode } = await params;
  const admin = await requireAdminPage();
  const schedule = await getAdminSchedule(admin.id_admin, kode);

  if (!schedule) {
    notFound();
  }

  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal Produksi / Hapus / Konfirmasi"
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Hapus Jadwal Produksi"
          description="Tindakan ini perlu konfirmasi."
        />
        <div className="relative z-10 flex flex-1 items-center justify-center py-8">
          <ScheduleDeleteConfirmation
            code={schedule.code}
            productName={schedule.productName}
          />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
