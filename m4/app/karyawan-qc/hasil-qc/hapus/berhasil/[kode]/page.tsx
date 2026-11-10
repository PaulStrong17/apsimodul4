import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcShell } from "../../../../../../components/karyawan-qc/employee-shell";
import { QualityResultSuccess } from "../../../../../../components/karyawan-qc/hasil-qc";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KaryawanQcResultDeleteSuccessPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanQcResultDeleteSuccessContent params={params} />
    </Suspense>
  );
}

async function KaryawanQcResultDeleteSuccessContent({ params }: PageProps) {
  const { kode } = await params;
  const decoded = decodeURIComponent(kode).trim();
  if (!decoded) notFound();

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Konfirmasi"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultSuccess action="deleted" code={decoded.toUpperCase()} />
    </EmployeeQcShell>
  );
}
