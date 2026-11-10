import { EmployeeQcShell } from "../../../components/karyawan-qc/employee-shell";
import { EmployeeQcLogout } from "../../../components/karyawan-qc/hasil-qc";

export default function KaryawanQcLogoutPage() {
  return (
    <EmployeeQcShell
      activeSection="keluar"
      breadcrumb="Pengelolaan Data"
      backgroundImage="/images/karyawan-qc/background-keluar.jpg"
    >
      <EmployeeQcLogout />
    </EmployeeQcShell>
  );
}
