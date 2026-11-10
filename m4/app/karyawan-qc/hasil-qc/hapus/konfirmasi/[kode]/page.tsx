import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcShell } from "../../../../../../components/karyawan-qc/employee-shell";
import { getQualityResult } from "../../../../../../components/karyawan-qc/data";
import { QualityResultConfirmation } from "../../../../../../components/karyawan-qc/hasil-qc";
import { EmployeeQcHeading } from "../../../../../../components/karyawan-qc/employee-shell";

type PageProps = {
  params: Promise<{ kode: string }>;
};

export default function KaryawanQcResultDeleteConfirmationPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanQcResultDeleteConfirmationContent params={params} />
    </Suspense>
  );
}

async function KaryawanQcResultDeleteConfirmationContent({ params }: PageProps) {
  const { kode } = await params;
  const result = getQualityResult(kode);
  if (!result) notFound();

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Hapus / Konfirmasi"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <EmployeeQcHeading
          title="Hapus Hasil QC"
          description="Tindakan ini perlu konfirmasi."
        />
        <QualityResultConfirmation code={result.code} />
      </div>
    </EmployeeQcShell>
  );
}
