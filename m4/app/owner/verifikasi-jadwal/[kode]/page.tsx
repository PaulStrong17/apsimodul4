import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OwnerVerificationDetail } from "../../../../components/owner/verification";
import { OwnerPageHeading, OwnerShell } from "../../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../../lib/owner/authorization";
import { getOwnerVerificationDetail } from "../../../../lib/owner/verification";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function OwnerVerificationDetailPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <OwnerVerificationDetailContent params={params} />
    </Suspense>
  );
}

async function OwnerVerificationDetailContent({
  params,
}: PageProps) {
  const { kode } = await params;
  const owner = await requireOwnerPage();
  const detail = await getOwnerVerificationDetail(owner.id_owner, kode);

  if (!detail) {
    notFound();
  }

  return (
    <OwnerShell
      activeSection="verifikasi-jadwal"
      breadcrumb={`Verifikasi Jadwal / Daftar / ${detail.code}`}
      backgroundImage="/images/owner/background-verifikasi.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Verifikasi Jadwal"
          description="Tinjau informasi jadwal dan riwayat keputusan Owner."
        />
        <OwnerVerificationDetail detail={detail} />
      </div>
    </OwnerShell>
  );
}
