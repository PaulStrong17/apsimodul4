"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../ui/button";
import {
  inspectionStatuses,
  inspectionVerificationStatuses,
} from "./data";
import type {
  AdminQcSchedule,
  AdminQcScheduleOptions,
} from "../../lib/admin/qc-schedules";

const fieldClassName =
  "h-12 w-full rounded-[9px] border border-[#d9e3ed] bg-white px-[10px] text-[14px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[12px] font-bold leading-[1.2] text-[#17263b] md:text-[14px]"
      >
        {label} *
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
  options: { id: string; label: string }[];
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
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
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

function SimpleSelectField({
  id,
  name,
  placeholder,
  values,
  defaultValue,
}: {
  id: string;
  name: string;
  placeholder: string;
  values: string[];
  defaultValue?: string;
}) {
  return (
    <SelectField
      id={id}
      name={name}
      placeholder={placeholder}
      options={values.map((v) => ({ id: v, label: v }))}
      defaultValue={defaultValue}
    />
  );
}

export function QualityForm({
  mode,
  schedule,
  options,
}: {
  mode: "create" | "edit";
  schedule?: AdminQcSchedule;
  options: AdminQcScheduleOptions;
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
      ? (schedule?.code ?? "")
      : String(formData.get("kode") ?? "")
          .trim()
          .toUpperCase();
    if (!code) {
      setError("Kode jadwal QC diperlukan.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body = {
        code,
        inspectionDate: formData.get("tanggalPemeriksaan"),
        type: formData.get("jenisPemeriksaan"),
        productionScheduleId: formData.get("jadwalProduksi"),
        qualityControlEmployeeId: formData.get("karyawanQc"),
        productionEmployeeId: formData.get("karyawanProduksi"),
        ownerId: formData.get("owner"),
        status: formData.get("statusPemeriksaan"),
        verificationStatus: formData.get("statusVerifikasi"),
      };

      const url = isEditing
        ? `/api/admin/jadwal-qc/${encodeURIComponent(code)}`
        : "/api/admin/jadwal-qc";

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Terjadi kesalahan saat menyimpan data.");
        setIsSubmitting(false);
        return;
      }

      router.replace(
        isEditing
          ? `/jadwal-qc/update/berhasil/${encodeURIComponent(code)}`
          : `/jadwal-qc/tambah/berhasil/${encodeURIComponent(code)}`,
      );
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-[900px]">
      <div
        className="flex w-full flex-col rounded-[30px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.34)] p-[18px] shadow-[0_3px_4px_rgba(0,0,0,0.4)] md:min-h-[1422px] md:rounded-[clamp(38px,4.65vw,67px)] md:p-[clamp(18px,1.6vw,23px)]"
      >
        <h2 className="text-[18px] font-bold leading-[1.5] text-[#17263b] md:text-[20px]">
          Form Data Jadwal QC
        </h2>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#61738a] md:text-[14px]">
          {schedule
            ? `Perbarui data ${schedule.code}. Kolom wajib ditandai dengan *.`
            : "Lengkapi informasi jadwal pemeriksaan QC. Kolom wajib ditandai dengan *."}
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-[9px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-[26px] md:min-h-[77px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Kode Jadwal QC" htmlFor="kode">
            <input
              id="kode"
              name="kode"
              type="text"
              autoComplete="off"
              placeholder="Contoh: JQ006"
              defaultValue={schedule?.code}
              readOnly={isEditing}
              required
              className={`${fieldClassName} ${isEditing ? "bg-[#f6f9fc]" : ""}`}
            />
          </FormField>
          <FormField label="Tanggal Pemeriksaan" htmlFor="tanggal-pemeriksaan">
            <input
              id="tanggal-pemeriksaan"
              name="tanggalPemeriksaan"
              type="date"
              defaultValue={schedule?.inspectionDate}
              required
              className={fieldClassName}
            />
          </FormField>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-6 md:min-h-[262px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Jenis Pemeriksaan" htmlFor="jenis-pemeriksaan">
            <input
              id="jenis-pemeriksaan"
              name="jenisPemeriksaan"
              type="text"
              autoComplete="off"
              placeholder="Contoh: Pemeriksaan Bahan Baku"
              defaultValue={schedule?.type}
              required
              className={fieldClassName}
            />
          </FormField>
          <FormField label="Jadwal Produksi" htmlFor="jadwal-produksi">
            <SelectField
              id="jadwal-produksi"
              name="jadwalProduksi"
              placeholder="Pilih jadwal produksi"
              options={options.productionSchedules}
              defaultValue={schedule?.productionCode}
            />
          </FormField>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-6 md:min-h-[262px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Karyawan QC" htmlFor="karyawan-qc">
            <SelectField
              id="karyawan-qc"
              name="karyawanQc"
              placeholder="Pilih karyawan QC"
              options={options.qualityControlEmployees}
              defaultValue={schedule?.qualityControlEmployeeId}
            />
          </FormField>
          <FormField label="Karyawan Produksi" htmlFor="karyawan-produksi">
            <SelectField
              id="karyawan-produksi"
              name="karyawanProduksi"
              placeholder="Pilih karyawan produksi"
              options={options.productionEmployees}
              defaultValue={schedule?.productionEmployeeId}
            />
          </FormField>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-6 md:min-h-[262px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Status Pemeriksaan" htmlFor="status-pemeriksaan">
            <SimpleSelectField
              id="status-pemeriksaan"
              name="statusPemeriksaan"
              placeholder="Pilih status pemeriksaan"
              values={inspectionStatuses}
              defaultValue={schedule?.status}
            />
          </FormField>
          <FormField label="Status Verifikasi" htmlFor="status-verifikasi">
            <SimpleSelectField
              id="status-verifikasi"
              name="statusVerifikasi"
              placeholder="Pilih status verifikasi"
              values={inspectionVerificationStatuses}
              defaultValue={schedule?.verificationStatus}
            />
          </FormField>
        </div>

        <div className="mt-6 md:mt-6 md:min-h-[262px]">
          <FormField label="Owner Penanggung Jawab" htmlFor="owner">
            <SelectField
              id="owner"
              name="owner"
              placeholder="Pilih owner"
              options={options.owners}
              defaultValue={schedule?.ownerId}
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
              router.push(
                isEditing ? "/jadwal-qc/update" : "/menu-jadwal-qc",
              )
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
