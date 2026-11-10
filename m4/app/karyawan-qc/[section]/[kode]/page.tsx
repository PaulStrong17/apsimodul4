import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcHeading, EmployeeQcShell } from "../../../../components/karyawan-qc/employee-shell";
import { isKaryawanQcSection } from "../../../../components/karyawan-qc/data";
import {
  QualityResultDetails,
  ReferenceDetails,
} from "../../../../components/karyawan-qc/reference-data";
import { requireKaryawanQcPage } from "../../../../lib/karyawan-qc/authorization";
import { getQcResult } from "../../../../lib/karyawan-qc/hasil-qc";
import {
  getReferenceRowData,
  getReferenceSectionData,
} from "../../../../lib/karyawan-qc/reference";

export const instant = false;

type PageProps = {
  params: Promise<{ section: string; kode: string }>;
};

export default function KaryawanQcDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanQcDetailContent params={params} />
    </Suspense>
  );
}

async function KaryawanQcDetailContent({ params }: PageProps) {
  const { section, kode } = await params;
  const karyawan = await requireKaryawanQcPage();

  if (section === "hasil-qc") {
    const result = await getQcResult(karyawan.id_karyawanqc, kode);
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

  if (!isKaryawanQcSection(section)) notFound();
  const [data, row] = await Promise.all([
    getReferenceSectionData(section, karyawan.id_karyawanqc),
    getReferenceRowData(section, kode, karyawan.id_karyawanqc),
  ]);
  if (!data || !row) notFound();

  return (
    <EmployeeQcShell
      activeSection={section}
      breadcrumb={`${data.title.replace("Daftar ", "")} / Lihat Detail / ${row.code}`}
      backgroundImage={data.backgroundImage}
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <EmployeeQcHeading
          title={`Detail ${data.title.replace("Daftar ", "")}`}
          description="Informasi ditampilkan hanya untuk dilihat dan tidak dapat diubah pada halaman ini."
        />
        <ReferenceDetails section={section} row={row} />
      </div>
    </EmployeeQcShell>
  );
}
