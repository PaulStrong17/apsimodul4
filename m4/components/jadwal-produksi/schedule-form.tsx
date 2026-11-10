"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { Button } from "../ui/button";
import {
  productionEmployees,
  productionRequests,
  qualityControlEmployees,
  scheduleOwners,
  scheduleStatuses,
  verificationStatuses,
  type ProductionSchedule,
} from "./data";

const fieldClassName =
  "h-12 w-full rounded-[9px] border border-[#d6e3ed] bg-white px-[10px] text-[14px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

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

type ScheduleFormProps = {
  mode: "create" | "edit";
  schedule?: ProductionSchedule;
};

export function ScheduleForm({ mode, schedule }: ScheduleFormProps) {
  const router = useRouter();
  const isEditing = mode === "edit";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const code = isEditing
      ? schedule?.code
      : String(formData.get("kode") ?? "")
          .trim()
          .toUpperCase();

    if (!code) {
      throw new Error("A schedule code is required before submitting.");
    }

    const destination = isEditing
      ? `/jadwal-produksi/update/berhasil/${encodeURIComponent(code)}`
      : `/jadwal-produksi/tambah/berhasil/${encodeURIComponent(code)}`;

    router.push(destination);
  }

  const requestOptions = productionRequests.map((request) => ({
    value: request.code,
    label: `${request.code} · ${request.productName}`,
  }));
  const singleOptions = (values: string[]) =>
    values.map((value) => ({ value, label: value }));

  const productRowMargin = isEditing
    ? "md:mt-[210px]"
    : "md:mt-[244px]";
  const verificationRowMargin = isEditing
    ? "md:mt-[230px]"
    : "md:mt-[270px]";
  const ownerRowMargin = isEditing ? "md:mt-[226px]" : "md:mt-[258px]";

  return (
    <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-[900px]">
      <div
        className={`flex w-full flex-col rounded-[30px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.34)] p-[18px] shadow-[0_3px_4px_rgba(0,0,0,0.35)] md:rounded-[clamp(38px,4.65vw,67px)] md:p-[clamp(18px,1.6vw,23px)] ${
          isEditing ? "md:min-h-[1415px]" : "md:min-h-[1375px]"
        }`}
      >
        <h2 className="text-[18px] font-bold leading-[1.5] text-[#17263b] md:text-[20px]">
          Form Data Jadwal Produksi
        </h2>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#61738a] md:text-[14px]">
          {isEditing && schedule
            ? `Perbarui data ${schedule.code}. Kolom wajib ditandai dengan *.`
            : "Lengkapi informasi jadwal produksi. Kolom wajib ditandai dengan *."}
        </p>

        <div className="mt-7 grid grid-cols-1 gap-6 md:mt-[26px] md:grid-cols-2 md:gap-x-6 md:gap-y-0">
          <FormField label="Kode Jadwal Produksi" htmlFor="kode">
            <input
              id="kode"
              name="kode"
              type="text"
              autoComplete="off"
              placeholder="Contoh: JP-006"
              defaultValue={schedule?.code}
              readOnly={isEditing}
              required
              className={`${fieldClassName} ${
                isEditing ? "bg-[#f6f9fc]" : ""
              }`}
            />
          </FormField>
          <FormField label="Tanggal Produksi" htmlFor="tanggal-produksi">
            <input
              id="tanggal-produksi"
              name="tanggalProduksi"
              type="date"
              defaultValue={schedule?.productionDate}
              required
              className={fieldClassName}
            />
          </FormField>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:mt-[26px] md:grid-cols-2 md:gap-x-6">
          <FormField label="Permintaan Produk" htmlFor="permintaan-produk">
            <SelectField
              id="permintaan-produk"
              name="permintaanProduk"
              placeholder="Pilih permintaan produk"
              options={requestOptions}
              defaultValue={schedule?.requestCode}
            />
          </FormField>
          <FormField label="Jumlah Target (pcs)" htmlFor="jumlah-target">
            <input
              id="jumlah-target"
              name="jumlahTarget"
              type="number"
              min="1"
              step="1"
              placeholder="Masukkan jumlah target"
              defaultValue={schedule?.target}
              required
              className={fieldClassName}
            />
          </FormField>
        </div>

        <div
          className={`mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-6 ${productRowMargin}`}
        >
          <FormField label="Karyawan Produksi" htmlFor="karyawan-produksi">
            <SelectField
              id="karyawan-produksi"
              name="karyawanProduksi"
              placeholder="Pilih karyawan produksi"
              options={singleOptions(productionEmployees)}
              defaultValue={schedule?.productionEmployee}
            />
          </FormField>
          <FormField label="Karyawan QC" htmlFor="karyawan-qc">
            <SelectField
              id="karyawan-qc"
              name="karyawanQc"
              placeholder="Pilih karyawan QC"
              options={singleOptions(qualityControlEmployees)}
              defaultValue={schedule?.qualityControlEmployee}
            />
          </FormField>
        </div>

        <div
          className={`mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-6 ${verificationRowMargin}`}
        >
          <FormField label="Status Jadwal" htmlFor="status-jadwal">
            <SelectField
              id="status-jadwal"
              name="statusJadwal"
              placeholder="Pilih status jadwal"
              options={singleOptions(scheduleStatuses)}
              defaultValue={schedule?.status}
            />
          </FormField>
          <FormField label="Status Verifikasi" htmlFor="status-verifikasi">
            <SelectField
              id="status-verifikasi"
              name="statusVerifikasi"
              placeholder="Pilih status verifikasi"
              options={singleOptions(verificationStatuses)}
              defaultValue={schedule?.verificationStatus}
            />
          </FormField>
        </div>

        <div className={`mt-6 md:col-span-2 ${ownerRowMargin}`}>
          <FormField label="Owner Penanggung Jawab" htmlFor="owner">
            <SelectField
              id="owner"
              name="owner"
              placeholder="Pilih owner"
              options={singleOptions(scheduleOwners)}
              defaultValue={schedule?.owner}
            />
          </FormField>
        </div>

        <div
          className={`flex items-center gap-3 ${
            isEditing
              ? "mt-7 md:mt-auto md:pt-6"
              : "mt-7 md:hidden"
          }`}
        >
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
              router.push(
                isEditing
                  ? "/jadwal-produksi/update"
                  : "/menu-jadwal-produksi",
              )
            }
            className="h-11 px-[18px] text-[15px] md:text-[17px]"
          >
            Batal
          </Button>
        </div>
      </div>

      {!isEditing ? (
        <div className="mt-7 hidden items-center gap-3 md:mt-[52px] md:flex">
          <Button
            type="submit"
            className="h-11 rounded-[9px] px-[18px] text-[15px] md:text-[17px]"
          >
            Simpan
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/menu-jadwal-produksi")}
            className="h-11 px-[18px] text-[15px] md:text-[17px]"
          >
            Batal
          </Button>
        </div>
      ) : null}
    </form>
  );
}
