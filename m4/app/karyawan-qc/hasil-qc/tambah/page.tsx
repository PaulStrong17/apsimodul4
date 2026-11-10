import { EmployeeQcShell } from "../../../../components/karyawan-qc/employee-shell";
import { QualityResultForm } from "../../../../components/karyawan-qc/hasil-qc";

export default function KaryawanQcResultCreatePage() {
  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Tambah"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultForm mode="create" />
    </EmployeeQcShell>
  );
}
