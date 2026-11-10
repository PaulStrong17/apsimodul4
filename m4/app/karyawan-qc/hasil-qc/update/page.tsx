import { EmployeeQcShell } from "../../../../components/karyawan-qc/employee-shell";
import { QualityResultList } from "../../../../components/karyawan-qc/hasil-qc";
import { requireKaryawanQcPage } from "../../../../lib/karyawan-qc/authorization";
import { listQcResults } from "../../../../lib/karyawan-qc/hasil-qc";

export const instant = false;

export default async function KaryawanQcResultUpdatePage() {
  const karyawan = await requireKaryawanQcPage();
  const results = await listQcResults(karyawan.id_karyawanqc);

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Update / Daftar"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultList mode="update" results={results} />
    </EmployeeQcShell>
  );
}
