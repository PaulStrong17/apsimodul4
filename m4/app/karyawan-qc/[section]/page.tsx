import { Suspense } from "react";
import { notFound } from "next/navigation";
import { EmployeeQcHeading, EmployeeQcShell } from "../../../components/karyawan-qc/employee-shell";
import { isKaryawanQcSection } from "../../../components/karyawan-qc/data";
import { ReferenceTable } from "../../../components/karyawan-qc/reference-data";
import { requireKaryawanQcPage } from "../../../lib/karyawan-qc/authorization";
import { getReferenceSectionData } from "../../../lib/karyawan-qc/reference";

export const instant = false;

type PageProps = {
  params: Promise<{ section: string }>;
};

export default function KaryawanQcReferencePage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanQcReferenceContent params={params} />
    </Suspense>
  );
}

async function KaryawanQcReferenceContent({ params }: PageProps) {
  const { section } = await params;
  if (!isKaryawanQcSection(section)) notFound();

  const karyawan = await requireKaryawanQcPage();
  const data = await getReferenceSectionData(section, karyawan.id_karyawanqc);
  if (!data) notFound();

  return (
    <EmployeeQcShell
      activeSection={section}
      breadcrumb={`${data.title.replace("Daftar ", "")} / Daftar`}
      backgroundImage={data.backgroundImage}
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <EmployeeQcHeading title={data.title} description={data.description} />
        <ReferenceTable section={section} data={data} />
      </div>
    </EmployeeQcShell>
  );
}
