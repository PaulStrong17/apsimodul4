import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcShell } from "../../../../../components/karyawan-qc/employee-shell";
import { getQualityResult } from "../../../../../components/karyawan-qc/data";
import { QualityResultForm } from "../../../../../components/karyawan-qc/hasil-qc";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KaryawanQcResultEditPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanQcResultEditContent params={params} />
    </Suspense>
  );
}

async function KaryawanQcResultEditContent({ params }: PageProps) {
  const { kode } = await params;
  const result = getQualityResult(kode);
  if (!result) notFound();

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb={`Hasil QC / Update / Edit ${result.code}`}
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultForm mode="edit" result={result} />
    </EmployeeQcShell>
  );
}
