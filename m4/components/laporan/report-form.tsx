"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { Button } from "../ui/button";
import {
  formatReportDateOption,
  reportAchievements,
  reportOwners,
  reportTypes,
  type ProductionReport,
} from "./data";

const fieldClassName =
  "h-12 w-full rounded-[9px] border border-[#d9e3ed] bg-white px-[10px] text-[14px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

const reportPeriodOptions = Array.from({ length: 31 }, (_, index) => {
  const date = `2026-10-${String(index + 1).padStart(2, "0")}`;
  return { value: date, label: formatReportDateOption(date) };
});

function FormField({
  label,
  htmlFor,
  required = true,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[12px] font-bold leading-[1.2] text-[#17263b] md:text-[14px]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}

function SelectField({
  id,
  name,
  placeholder,
  options,
  defaultValue,
}: {
  id: string;
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <span className="relative block">
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        required
        className={`${fieldClassName} appearance-none pr-10 ${
          defaultValue ? "" : "text-[#8c99a8]"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Image
        aria-hidden="true"
        alt=""
        src="/images/bahan-baku/chevron-down.svg"
        width={16}
        height={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      />
    </span>
  );
}

function reportOptions(values: readonly string[]) {
  return values.map((value) => ({ value, label: value }));
}

export function ReportForm({
  mode,
  report,
}: {
  mode: "create" | "edit";
  report?: ProductionReport;
}) {
  const router = useRouter();
  const isEditing = mode === "edit";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const periodStart = form.elements.namedItem("periodStart");
    const periodEnd = form.elements.namedItem("periodEnd");

    if (
      !(periodStart instanceof HTMLSelectElement) ||
      !(periodEnd instanceof HTMLSelectElement)
    ) {
      throw new Error("Report period controls are missing.");
    }

    if (periodEnd.value < periodStart.value) {
      periodEnd.setCustomValidity("Periode akhir harus setelah periode awal.");
      periodEnd.reportValidity();
      periodEnd.setCustomValidity("");
      return;
    }

    const formData = new FormData(form);
    const code = isEditing
      ? report?.code
      : String(formData.get("code") ?? "")
          .trim()
          .toUpperCase();

    if (!code) throw new Error("A report code is required.");

    router.push(
      isEditing
        ? `/laporan/update/berhasil/${encodeURIComponent(code)}`
        : `/laporan/tambah/berhasil/${encodeURIComponent(code)}`,
    );
  }

  const textOptions = (values: readonly string[]) => reportOptions(values);

  return (
    <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-[900px]">
      <div
        className={`flex w-full flex-col rounded-[30px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.34)] p-[18px] shadow-[0_3px_4px_rgba(0,0,0,0.4)] md:rounded-[clamp(38px,4.65vw,67px)] md:p-[clamp(18px,1.67vw,24px)] ${
          isEditing ? "md:min-h-[1120px]" : "md:min-h-[1327px]"
        }`}
      >
        <h2 className="text-[18px] font-bold leading-[1.5] text-[#17263b] md:text-[20px]">
          Form Data Laporan
        </h2>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#61738a] md:text-[14px]">
          {isEditing && report
            ? `Perbarui data ${report.code}. Kolom wajib ditandai dengan *.`
            : "Lengkapi informasi laporan. Kolom wajib ditandai dengan *."}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-7 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <FormField label="Kode Laporan" htmlFor="code">
            <input
              id="code"
              name="code"
              type="text"
              autoComplete="off"
              placeholder="Contoh: LP-006"
              defaultValue={report?.code}
              readOnly={isEditing}
              required
              className={`${fieldClassName} ${
                isEditing ? "bg-[#f6f9fc]" : ""
              }`}
            />
          </FormField>
          <FormField label="Jenis Laporan" htmlFor="report-type">
            <SelectField
              id="report-type"
              name="reportType"
              placeholder="Pilih jenis laporan"
              options={textOptions(reportTypes)}
              defaultValue={report?.type}
            />
          </FormField>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-[112px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Periode Awal" htmlFor="period-start">
            <SelectField
              id="period-start"
              name="periodStart"
              placeholder="Pilih periode awal"
              options={reportPeriodOptions}
              defaultValue={report?.periodStart}
            />
          </FormField>
          <FormField label="Periode Akhir" htmlFor="period-end">
            <SelectField
              id="period-end"
              name="periodEnd"
              placeholder="Pilih periode akhir"
              options={reportPeriodOptions}
              defaultValue={report?.periodEnd}
            />
          </FormField>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-[112px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Total Produksi (pcs)" htmlFor="total-production">
            <input
              id="total-production"
              name="totalProduction"
              type="number"
              min="1"
              step="1"
              placeholder="Masukkan total produksi"
              defaultValue={report?.totalProduction}
              required
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Jumlah Pemeriksaan" htmlFor="inspection-count">
            <input
              id="inspection-count"
              name="inspectionCount"
              type="number"
              min="0"
              step="1"
              placeholder="Masukkan jumlah pemeriksaan"
              defaultValue={report?.inspectionCount}
              required
              className={fieldClassName}
            />
          </FormField>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-[112px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Reject Rate (%)" htmlFor="reject-rate">
            <input
              id="reject-rate"
              name="rejectRate"
              type="text"
              inputMode="decimal"
              pattern="[0-9]+([,.][0-9]{1,2})?"
              placeholder="Contoh: 2,10"
              defaultValue={
                report?.rejectRate.toFixed(2).replace(".", ",") ?? ""
              }
              required
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Target Reject Rate (%)" htmlFor="target-reject-rate">
            <input
              id="target-reject-rate"
              name="targetRejectRate"
              type="text"
              inputMode="decimal"
              pattern="[0-9]+([,.][0-9]{1,2})?"
              placeholder="Contoh: 3,00"
              defaultValue={
                report?.targetRejectRate.toFixed(2).replace(".", ",") ?? ""
              }
              required
              className={fieldClassName}
            />
          </FormField>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-[112px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Owner Penerima Laporan" htmlFor="owner">
            <SelectField
              id="owner"
              name="owner"
              placeholder="Pilih owner"
              options={textOptions(reportOwners)}
              defaultValue={report?.owner}
            />
          </FormField>
          {isEditing ? (
            <FormField label="Status Pencapaian" htmlFor="achievement">
              <SelectField
                id="achievement"
                name="achievement"
                placeholder="Pilih status pencapaian"
                options={textOptions(reportAchievements)}
                defaultValue={report?.achievement}
              />
            </FormField>
          ) : null}
        </div>

        <div className="mt-8 md:mt-[108px]">
          <FormField
            label="Hasil Tindakan Perbaikan"
            htmlFor="corrective-action"
            required={false}
          >
            <textarea
              id="corrective-action"
              name="correctiveAction"
              rows={3}
              placeholder="Tuliskan hasil tindakan perbaikan (opsional)"
              defaultValue={report?.correctiveAction}
              className={`${fieldClassName} h-[88px] resize-y py-3`}
            />
          </FormField>
        </div>

        <div className="mt-7 flex items-center gap-3 md:mt-auto md:pt-6">
          <Button
            type="submit"
            className="h-11 rounded-[9px] px-[18px] text-[15px] md:text-[17px]"
          >
            {isEditing ? "Simpan Perubahan" : "Simpan"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              router.push(isEditing ? "/laporan/update" : "/menu-laporan")
            }
            className="h-11 px-[18px] text-[15px] md:text-[17px]"
          >
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
}
