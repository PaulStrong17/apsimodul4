import { Suspense } from "react";
import { OwnerDashboard } from "../../../components/owner/dashboard";
import { OwnerShell } from "../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../lib/owner/authorization";
import { getOwnerKpiData } from "../../../lib/owner/reports";

type PageProps = {
  searchParams: Promise<{ periode?: string }>;
};

export default function OwnerDashboardPage({ searchParams }: PageProps) {
  return (
    <OwnerShell
      activeSection="dashboard-kpi"
      breadcrumb="Dashboard KPI"
      backgroundImage="/images/owner/background-dashboard.jpg"
    >
      <Suspense fallback={<div className="min-h-[400px]" aria-busy="true" />}>
        <OwnerDashboardContent searchParams={searchParams} />
      </Suspense>
    </OwnerShell>
  );
}

async function OwnerDashboardContent({ searchParams }: PageProps) {
  const { periode } = await searchParams;
  const owner = await requireOwnerPage();
  const kpiData = await getOwnerKpiData(owner.id_owner);

  return (
    <OwnerDashboard
      selectedPeriod={periode}
      periods={kpiData.periods}
      rejectRates={kpiData.rejectRates}
    />
  );
}
