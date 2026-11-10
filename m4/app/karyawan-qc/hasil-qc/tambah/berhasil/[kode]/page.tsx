import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcShell } from "../../../../../../components/karyawan-qc/employee-shell";
import { QualityResultSuccess } from "../../../../../../components/karyawan-qc/hasil-qc";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KaryawanQcResultCreateSuccessPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanQcResultCreateSuccessContent params={params} />
    </Suspense>
  );
}

async function KaryawanQcResultCreateSuccessContent({ params }: PageProps) {
  const { kode } = await params;
  if (!/^HQC-\d{3}$/i.test(kode)) notFound();

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Konfirmasi"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultSuccess action="added" code={kode.toUpperCase()} />
    </EmployeeQcShell>
  );
}
