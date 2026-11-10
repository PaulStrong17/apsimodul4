import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OwnerVerificationResult } from "../../../../../components/owner/verification";
import { verificationItems } from "../../../../../components/owner/data";
import { OwnerPageHeading, OwnerShell } from "../../../../../components/owner/owner-shell";

type PageProps = {
  params: Promise<{ kode: string; keputusan: string }>;
};

export default function OwnerVerificationDecisionPage({
  params,
}: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <OwnerVerificationDecisionContent params={params} />
    </Suspense>
  );
}

async function OwnerVerificationDecisionContent({
  params,
}: PageProps) {
  const { kode, keputusan } = await params;
  const validCode = verificationItems.some(
    (item) =>
      item.code.toLowerCase() === kode.toLowerCase() &&
      item.status === "Menunggu Keputusan",
  );

  if (!validCode || (keputusan !== "setujui" && keputusan !== "tolak")) {
    notFound();
  }
  const decision = keputusan === "setujui" ? "setujui" : "tolak";

  return (
    <OwnerShell
      activeSection="verifikasi-jadwal"
      breadcrumb={`Verifikasi Jadwal / ${keputusan === "setujui" ? "Setujui" : "Tolak"}`}
      backgroundImage="/images/owner/background-verifikasi.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Verifikasi Jadwal"
          description="Keputusan verifikasi jadwal."
        />
        <OwnerVerificationResult
          code={kode}
          decision={decision}
        />
      </div>
    </OwnerShell>
  );
}
