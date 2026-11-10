import { EmployeeQcShell } from "../../../components/karyawan-qc/employee-shell";
import { QualityResultMenu } from "../../../components/karyawan-qc/hasil-qc";

export default function KaryawanQcResultMenuPage() {
  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Menu"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultMenu />
    </EmployeeQcShell>
  );
}
