import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcShell } from "../../../../../../components/karyawan-qc/employee-shell";
import { QualityResultConfirmation } from "../../../../../../components/karyawan-qc/hasil-qc";
import { requireKaryawanQcPage } from "../../../../../../lib/karyawan-qc/authorization";
import { getQcResult } from "../../../../../../lib/karyawan-qc/hasil-qc";

export const instant = false;

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
  const karyawan = await requireKaryawanQcPage();
  const result = await getQcResult(karyawan.id_karyawanqc, kode);
  if (!result) notFound();

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Hapus / Konfirmasi"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultConfirmation code={result.code} />
    </EmployeeQcShell>
  );
}
