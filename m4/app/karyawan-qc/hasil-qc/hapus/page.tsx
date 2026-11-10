import { EmployeeQcShell } from "../../../../components/karyawan-qc/employee-shell";
import { QualityResultList } from "../../../../components/karyawan-qc/hasil-qc";

export default function KaryawanQcResultDeletePage() {
  return (
    <EmployeeQcShell
      activeSection="hasil-qc"
      breadcrumb="Hasil QC / Hapus / Daftar"
      backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
    >
      <QualityResultList mode="delete" />
    </EmployeeQcShell>
  );
}
