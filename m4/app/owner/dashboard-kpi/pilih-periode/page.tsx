import { OwnerPeriodPicker } from "../../../../components/owner/dashboard";
import { OwnerShell } from "../../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../../lib/owner/authorization";
import { getOwnerKpiData } from "../../../../lib/owner/reports";

export default async function OwnerDashboardPeriodPage() {
  const owner = await requireOwnerPage();
  const kpiData = await getOwnerKpiData(owner.id_owner);

  return (
    <OwnerShell
      activeSection="dashboard-kpi"
      breadcrumb="Dashboard KPI"
      backgroundImage="/images/owner/background-dashboard.jpg"
    >
      <OwnerPeriodPicker periods={kpiData.periods} />
    </OwnerShell>
  );
}
