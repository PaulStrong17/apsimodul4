import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcHeading, EmployeeQcShell } from "../../../../../components/karyawan-qc/employee-shell";
import { getQualityResult } from "../../../../../components/karyawan-qc/data";
import { QualityResultDetails } from "../../../../../components/karyawan-qc/reference-data";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KaryawanQcResultDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanQcResultDetailContent params={params} />
    </Suspense>
  );
}

async function KaryawanQcResultDetailContent({ params }: PageProps) {
  const { kode } = await params;
  const result = getQualityResult(kode);
  if (!result) notFound();

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb={`Hasil QC / Lihat Detail / ${result.code}`}
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <EmployeeQcHeading
          title="Detail Hasil QC"
          description="Informasi hasil pemeriksaan hanya untuk dilihat dan tidak dapat diubah pada halaman ini."
        />
        <QualityResultDetails result={result} />
      </div>
    </EmployeeQcShell>
  );
}
