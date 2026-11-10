import { OwnerPeriodPicker } from "../../../../components/owner/dashboard";
import { OwnerShell } from "../../../../components/owner/owner-shell";

export default function OwnerDashboardPeriodPage() {
  return (
    <OwnerShell
      activeSection="dashboard-kpi"
      breadcrumb="Dashboard KPI"
      backgroundImage="/images/owner/background-dashboard.jpg"
    >
      <OwnerPeriodPicker />
    </OwnerShell>
  );
}
