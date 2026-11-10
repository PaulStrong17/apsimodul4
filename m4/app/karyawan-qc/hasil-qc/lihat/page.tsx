import { EmployeeQcShell } from "../../../../components/karyawan-qc/employee-shell";
import { QualityResultList } from "../../../../components/karyawan-qc/hasil-qc";

export default function KaryawanQcResultViewPage() {
  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Lihat / Daftar"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultList mode="view" />
    </EmployeeQcShell>
  );
}
