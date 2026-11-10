import { EmployeeQcShell } from "../../../../components/karyawan-qc/employee-shell";
import { QualityResultList } from "../../../../components/karyawan-qc/hasil-qc";

export default function KaryawanQcResultUpdatePage() {
  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Update / Daftar"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultList mode="update" />
    </EmployeeQcShell>
  );
}
