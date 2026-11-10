"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../ui/button";
import type {
  AdminProductionSchedule,
  AdminScheduleOptions,
} from "../../lib/admin/schedules";

const fieldClassName =
  "h-12 w-full rounded-[9px] border border-[#d6e3ed] bg-white px-[10px] text-[14px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

const scheduleStatuses = [
  "Direncanakan",
  "Terjadwal",
  "Selesai",
  "Dibatalkan",
];
const verificationStatuses = ["Menunggu", "Terverifikasi", "Ditolak"];

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
        {options.map((option) => (
          <option key={option.id} value={option.id}>
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
  options: AdminScheduleOptions;
  schedule?: AdminProductionSchedule;
};

export function ScheduleForm({
  mode,
  options,
  schedule,
}: ScheduleFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const code = isEditing
      ? schedule?.code
      : String(formData.get("kode") ?? "").trim().toUpperCase();

    if (!code) {
      setError("Kode jadwal wajib diisi.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        isEditing
          ? `/api/admin/jadwal-produksi/${encodeURIComponent(code)}`
          : "/api/admin/jadwal-produksi",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            productionDate: formData.get("tanggalProduksi"),
            requestId: formData.get("permintaanProduk"),
            target: formData.get("jumlahTarget"),
            productionEmployeeId: formData.get("karyawanProduksi"),
            qualityControlEmployeeId: formData.get("karyawanQc"),
            status: formData.get("statusJadwal"),
            verificationStatus: formData.get("statusVerifikasi"),
            ownerId: formData.get("owner"),
          }),
        },
      );
      const result: { code?: string; error?: string } = await response.json();

      if (!response.ok) {
        setError(
          result.error ??
            (isEditing
              ? "Jadwal produksi tidak dapat diperbarui."
              : "Jadwal produksi tidak dapat disimpan."),
        );
        return;
      }

      const savedCode = result.code ?? code;
      router.replace(
        isEditing
          ? `/jadwal-produksi/update/berhasil/${encodeURIComponent(savedCode)}`
          : `/jadwal-produksi/tambah/berhasil/${encodeURIComponent(savedCode)}`,
      );
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusOptions = scheduleStatuses.map((status) => ({
    id: status,
    label: status,
  }));
  const verificationOptions = verificationStatuses.map((status) => ({
    id: status,
    label: status,
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 w-full max-w-[900px] rounded-[30px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.34)] p-[18px] shadow-[0_3px_4px_rgba(0,0,0,0.35)] md:rounded-[clamp(38px,4.65vw,67px)] md:p-[clamp(18px,1.6vw,23px)]"
    >
      <h2 className="text-[18px] font-bold leading-[1.5] text-[#17263b] md:text-[20px]">
        Form Data Jadwal Produksi
      </h2>
      <p className="mt-1 text-[13px] leading-[1.5] text-[#61738a] md:text-[14px]">
        {isEditing && schedule
          ? `Perbarui data ${schedule.code}. Kolom wajib ditandai dengan *.`
          : "Lengkapi informasi jadwal produksi. Kolom wajib ditandai dengan *."}
      </p>

      <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="Kode Jadwal Produksi" htmlFor="kode">
          <input
            id="kode"
            name="kode"
            type="text"
            autoComplete="off"
            placeholder="Contoh: JP005"
            defaultValue={schedule?.code}
            readOnly={isEditing}
            required
            maxLength={10}
            className={`${fieldClassName} ${isEditing ? "bg-[#f6f9fc]" : ""}`}
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

        <FormField label="Permintaan Produk" htmlFor="permintaan-produk">
          <SelectField
            id="permintaan-produk"
            name="permintaanProduk"
            placeholder={
              options.requests.length
                ? "Pilih permintaan produk"
                : "Belum ada permintaan produk"
            }
            options={options.requests}
            defaultValue={schedule?.requestCode}
          />
        </FormField>
        <FormField label="Jumlah Target (pcs)" htmlFor="jumlah-target">
          <input
            id="jumlah-target"
            name="jumlahTarget"
            type="number"
            min="1"
            max="2147483647"
            step="1"
            placeholder="Masukkan jumlah target"
            defaultValue={schedule?.target}
            required
            className={fieldClassName}
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
        <FormField label="Karyawan QC" htmlFor="karyawan-qc">
          <SelectField
            id="karyawan-qc"
            name="karyawanQc"
            placeholder="Pilih karyawan QC"
            options={options.qualityControlEmployees}
            defaultValue={schedule?.qualityControlEmployeeId}
          />
        </FormField>

        <FormField label="Status Jadwal" htmlFor="status-jadwal">
          <SelectField
            id="status-jadwal"
            name="statusJadwal"
            placeholder="Pilih status jadwal"
            options={statusOptions}
            defaultValue={schedule?.status ?? "Direncanakan"}
          />
        </FormField>
        <FormField label="Status Verifikasi" htmlFor="status-verifikasi">
          <SelectField
            id="status-verifikasi"
            name="statusVerifikasi"
            placeholder="Pilih status verifikasi"
            options={verificationOptions}
            defaultValue={schedule?.verificationStatus ?? "Menunggu"}
          />
        </FormField>

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

      <div className="mt-7 flex flex-wrap items-center gap-3">
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
      {error ? (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
