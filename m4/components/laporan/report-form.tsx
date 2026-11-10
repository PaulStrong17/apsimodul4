"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../ui/button";
import type { AdminReport, AdminReportOptions } from "../../lib/admin/reports";

const fieldClassName =
  "h-12 w-full rounded-[9px] border border-[#d9e3ed] bg-white px-[10px] text-[14px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

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

export function ReportForm({
  mode,
  report,
  options,
}: {
  mode: "create" | "edit";
  report?: AdminReport;
  options: AdminReportOptions;
}) {
  const router = useRouter();
  const isEditing = mode === "edit";
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const code = isEditing
      ? (report?.code ?? "")
      : String(formData.get("code") ?? "")
          .trim()
          .toUpperCase();

    if (!code) {
      setError("Kode laporan diperlukan.");
      return;
    }

    const periodStart = String(formData.get("periodStart") ?? "");
    const periodEnd = String(formData.get("periodEnd") ?? "");

    if (periodEnd < periodStart) {
      setError("Periode akhir harus setelah atau sama dengan periode awal.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        code,
        reportType: formData.get("reportType"),
        periodStart,
        periodEnd,
        totalProduction: formData.get("totalProduction"),
        inspectionCount: formData.get("inspectionCount"),
        rejectRate: formData.get("rejectRate"),
        targetRejectRate: formData.get("targetRejectRate"),
        ownerId: formData.get("owner"),
        achievement: formData.get("achievement"),
        correctiveAction: formData.get("correctiveAction"),
      };

      const url = isEditing
        ? `/api/admin/laporan/${encodeURIComponent(code)}`
        : "/api/admin/laporan";

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Terjadi kesalahan saat menyimpan laporan.");
        setIsSubmitting(false);
        return;
      }

      router.replace(
        isEditing
          ? `/laporan/update/berhasil/${encodeURIComponent(code)}`
          : `/laporan/tambah/berhasil/${encodeURIComponent(code)}`,
      );
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  const typeOptions = options.reportTypes.map((t) => ({ value: t, label: t }));
  const ownerOptions = options.owners.map((o) => ({ value: o.id, label: o.label }));
  const achievementOptions = options.achievements.map((a) => ({
    value: a,
    label: a,
  }));

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

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-[9px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-7 md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <FormField label="Kode Laporan" htmlFor="code">
            <input
              id="code"
              name="code"
              type="text"
              autoComplete="off"
              placeholder="Contoh: LP-006 atau 6"
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
              options={typeOptions}
              defaultValue={report?.type}
            />
          </FormField>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 md:gap-x-6">
          <FormField label="Periode Awal" htmlFor="period-start">
            <input
              id="period-start"
              name="periodStart"
              type="date"
              defaultValue={report?.periodStart}
              required
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Periode Akhir" htmlFor="period-end">
            <input
              id="period-end"
              name="periodEnd"
              type="date"
              defaultValue={report?.periodEnd}
              required
              className={fieldClassName}
            />
          </FormField>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 md:gap-x-6">
          <FormField label="Total Produksi (pcs)" htmlFor="total-production">
            <input
              id="total-production"
              name="totalProduction"
              type="number"
              min="0"
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

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 md:gap-x-6">
          <FormField label="Reject Rate (%)" htmlFor="reject-rate">
            <input
              id="reject-rate"
              name="rejectRate"
              type="text"
              inputMode="decimal"
              pattern="[0-9]+([,.][0-9]{1,2})?"
              placeholder="Contoh: 2,10"
              defaultValue={
                report?.rejectRate !== undefined
                  ? report.rejectRate.toFixed(2).replace(".", ",")
                  : ""
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
                report?.targetRejectRate !== undefined
                  ? report.targetRejectRate.toFixed(2).replace(".", ",")
                  : ""
              }
              required
              className={fieldClassName}
            />
          </FormField>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-2 md:gap-x-6">
          <FormField label="Owner Penerima Laporan" htmlFor="owner">
            <SelectField
              id="owner"
              name="owner"
              placeholder="Pilih owner"
              options={ownerOptions}
              defaultValue={report?.ownerId}
            />
          </FormField>
          {isEditing ? (
            <FormField label="Status Pencapaian" htmlFor="achievement">
              <SelectField
                id="achievement"
                name="achievement"
                placeholder="Pilih status pencapaian"
                options={achievementOptions}
                defaultValue={report?.achievement}
              />
            </FormField>
          ) : null}
        </div>

        <div className="mt-8 md:mt-8">
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
            disabled={isSubmitting}
            className="h-11 rounded-[9px] px-[18px] text-[15px] md:text-[17px]"
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
                ? "Simpan Perubahan"
                : "Simpan"}
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
