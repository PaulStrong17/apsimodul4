"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  formatReportNumber,
  formatRejectRate,
} from "../laporan/data";

const periods = [
  {
    value: "2026-10-01_2026-10-22",
    label: "01–22 Oktober 2026",
    production: 8750,
    inspections: 36,
    rate: 2.95,
    target: 3,
    reports: ["LP-001", "LP-002", "LP-003", "LP-004", "LP-005"],
  },
  {
    value: "2026-10-01_2026-10-15",
    label: "01–15 Oktober 2026",
    production: 6200,
    inspections: 24,
    rate: 2.1,
    target: 3,
    reports: ["LP-001", "LP-002"],
  },
  {
    value: "2026-10-16_2026-10-22",
    label: "16–22 Oktober 2026",
    production: 2800,
    inspections: 12,
    rate: 2.6,
    target: 3,
    reports: ["LP-003", "LP-004"],
  },
];

const rejectRates = [
  { code: "LP-001", label: "01–15 Okt", value: 2.1 },
  { code: "LP-002", label: "01–15 Okt", value: 3.4 },
  { code: "LP-003", label: "16–22 Okt", value: 1.9 },
  { code: "LP-004", label: "16–22 Okt", value: 2.6 },
  { code: "LP-005", label: "01–22 Okt", value: 2.95 },
];

export function OwnerDashboard({
  selectedPeriod = periods[0].value,
}: {
  selectedPeriod?: string;
}) {
  const current =
    periods.find((period) => period.value === selectedPeriod) ?? periods[0];
  const achieved = current.rate <= current.target;
  const chartMaximum = 4;

  return (
    <div className="relative z-10 flex flex-1 flex-col gap-5 p-[clamp(20px,2.5vw,36px)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Dashboard KPI
          </h1>
          <p className="mt-1 text-[14px] text-[#61738a] md:text-[17px]">
            Ringkasan capaian produksi dan mutu berdasarkan rekap laporan,{" "}
            {current.label}.
          </p>
        </div>
        <Link
          href="/owner/dashboard-kpi/pilih-periode"
          className="inline-flex h-10 items-center rounded-[9px] border border-[#d6e3ed] bg-white px-4 text-[14px] font-bold text-[#0a3d62]"
        >
          Pilih Periode
        </Link>
      </div>

      <section
        aria-label="Ringkasan KPI"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          label="Total Produksi"
          value={`${formatReportNumber(current.production)} pcs`}
          note={`LP-005 · ${current.label}`}
        />
        <KpiCard
          label="Jumlah Pemeriksaan"
          value={String(current.inspections)}
          note="Seluruh jadwal QC periode ini"
        />
        <KpiCard
          label="Reject Rate"
          value={formatRejectRate(current.rate)}
          note={`Target maksimal ${formatRejectRate(current.target)}`}
        />
        <KpiCard
          label="Status Pencapaian"
          value={achieved ? "Tercapai" : "Tidak Tercapai"}
          note={achieved ? "Reject rate di bawah target" : "Reject rate di atas target"}
          valueClassName={achieved ? "text-[#16834b]" : "text-[#b82926]"}
        />
      </section>

      <section className="rounded-[14px] border border-[#d6e3ed] bg-white p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold text-[#17263b] md:text-[20px]">
            Reject Rate per Laporan
          </h2>
          <div className="flex flex-wrap gap-4 text-[12px] text-[#61738a]">
            <span className="inline-flex items-center gap-2">
              <i className="h-2 w-2 rounded-sm bg-[#0a3d62]" />
              Di bawah target
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="h-2 w-2 rounded-sm bg-[#b82926]" />
              Di atas target {formatRejectRate(current.target)}
            </span>
          </div>
        </div>
        <div className="mt-6 flex h-[240px] items-end gap-3 overflow-x-auto px-2 pb-2 sm:gap-6">
          {rejectRates
            .filter((report) => current.reports.includes(report.code))
            .map((report) => {
              const overTarget = report.value > current.target;
              const barHeight = Math.max(
                24,
                (report.value / chartMaximum) * 170,
              );

              return (
                <div
                  key={report.code}
                  className="flex h-full min-w-[58px] flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-1 text-[12px] font-bold text-[#17263b]">
                    {formatRejectRate(report.value)}
                  </span>
                  <div
                    aria-label={`${report.code}: ${formatRejectRate(report.value)}`}
                    className={`w-full max-w-[66px] rounded-t-[6px] ${
                      overTarget ? "bg-[#b82926]" : "bg-[#0a3d62]"
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />
                  <span className="mt-1 text-[12px] font-bold text-[#17263b]">
                    {report.code}
                  </span>
                  <span className="mt-1 whitespace-nowrap text-[11px] text-[#61738a]">
                    {report.label}
                  </span>
                </div>
              );
            })}
        </div>
      </section>
      <Link
        href="/owner/rekap-laporan"
        className="inline-flex h-11 w-fit items-center rounded-[9px] border border-[#d6e3ed] bg-white px-4 font-bold text-[#0a3d62]"
      >
        Kembali
      </Link>
    </div>
  );
}

function KpiCard({
  label,
  value,
  note,
  valueClassName = "text-[#17263b]",
}: {
  label: string;
  value: string;
  note: string;
  valueClassName?: string;
}) {
  return (
    <article className="min-h-[98px] rounded-[12px] border border-[#d6e3ed] bg-white p-4">
      <p className="text-[13px] text-[#61738a]">{label}</p>
      <p className={`mt-1 text-[22px] font-bold leading-tight md:text-[24px] ${valueClassName}`}>
        {value}
      </p>
      <p className="mt-1 text-[12px] text-[#61738a]">{note}</p>
    </article>
  );
}

export function OwnerPeriodPicker() {
  const router = useRouter();
  const [period, setPeriod] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!period) return;
    router.push(`/owner/dashboard-kpi?periode=${encodeURIComponent(period)}`);
  }

  return (
    <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
      <div>
        <h1 className="text-[22px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
          Dashboard KPI
        </h1>
        <p className="mt-1 text-[14px] text-[#61738a] md:text-[17px]">
          Ringkasan capaian produksi dan mutu berdasarkan rekap laporan, 01–22
          Oktober 2026.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-10 flex min-h-[376px] w-full max-w-[466px] flex-col rounded-[14px] border border-[#d6e3ed] bg-white p-6"
      >
        <h2 className="text-[20px] font-bold text-[#17263b]">
          Pilih Periode Laporan
        </h2>
        <p className="mt-1 text-[14px] text-[#61738a]">
          Pilih periode untuk menampilkan dashboard KPI.
        </p>
        <label
          htmlFor="owner-period"
          className="mt-5 text-[14px] font-bold text-[#17263b]"
        >
          Periode Laporan *
        </label>
        <div className="mt-2 h-[154px]">
          <select
            id="owner-period"
            value={period}
            required
            onChange={(event) => setPeriod(event.currentTarget.value)}
            className="h-11 w-full rounded-[8px] border border-[#d6e3ed] bg-white px-3 text-[14px] text-[#61738a] outline-none focus:border-[#0a3d62]"
          >
            <option value="" disabled>
              Pilih periode laporan
            </option>
            {periods.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-auto flex items-start">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-[9px] bg-[#0a3d62] px-5 font-bold text-white hover:bg-[#083451]"
          >
            Tampilkan Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}
