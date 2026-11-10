import { EmployeeQcShell } from "../../../../components/karyawan-qc/employee-shell";
import { QualityResultForm } from "../../../../components/karyawan-qc/hasil-qc";
import { requireKaryawanQcPage } from "../../../../lib/karyawan-qc/authorization";
import { getQcResultOptions } from "../../../../lib/karyawan-qc/hasil-qc";

export const instant = false;

export default async function KaryawanQcResultCreatePage() {
  const karyawan = await requireKaryawanQcPage();
  const options = await getQcResultOptions(karyawan.id_karyawanqc);

  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Tambah"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultForm mode="create" options={options} />
    </EmployeeQcShell>
  );
}
