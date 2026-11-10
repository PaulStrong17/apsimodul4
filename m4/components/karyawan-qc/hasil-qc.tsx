"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { ActionCard } from "../ui/action-card";
import { Button } from "../ui/button";
import {
  getQualityResultDetails,
  productionResultOptions,
  qualityResults,
  referenceSections,
  type QualityResult,
} from "./data";
import { EmployeeQcHeading } from "./employee-shell";
import { QualityResultsTable } from "./reference-data";

const resultActions = [
  {
    title: "Tambah Hasil QC",
    description:
      "Catat hasil pemeriksaan baru beserta jumlah diperiksa, jumlah lolos, jumlah reject, dan keterangannya.",
    icon: "/images/bahan-baku/icon-plus.svg",
    href: "/karyawan-qc/hasil-qc/tambah",
  },
  {
    title: "Lihat Hasil QC",
    description:
      "Lihat detail hasil pemeriksaan, jadwal QC terkait, serta jumlah lolos dan reject.",
    icon: "/images/bahan-baku/icon-eye.svg",
    href: "/karyawan-qc/hasil-qc/lihat",
  },
  {
    title: "Update Hasil QC",
    description:
      "Pilih hasil pemeriksaan dari daftar, lalu perbarui jumlah dan keterangannya.",
    icon: "/images/bahan-baku/icon-edit.svg",
    href: "/karyawan-qc/hasil-qc/update",
  },
  {
    title: "Hapus Hasil QC",
    description:
      "Pilih hasil pemeriksaan pada daftar untuk menghapus data yang salah dicatat.",
    icon: "/images/bahan-baku/icon-trash.svg",
    href: "/karyawan-qc/hasil-qc/hapus",
  },
];

export function QualityResultMenu() {
  return (
    <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
      <EmployeeQcHeading
        title="Menu Hasil QC"
        description="Pilih tindakan untuk mengelola data hasil pemeriksaan QC."
      />
      <div className="relative z-10 mt-7 grid grid-cols-1 gap-5 md:mt-[clamp(52px,6.1vw,88px)] md:grid-cols-2 md:gap-6">
        {resultActions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>
    </div>
  );
}

export function QualityResultList({ mode }: { mode: "view" | "update" | "delete" }) {
  const config = {
    view: {
      title: "Lihat Hasil QC",
      description:
        "Pilih hasil pemeriksaan QC untuk melihat informasi lengkapnya.",
      breadcrumb: "Hasil QC / Lihat / Daftar",
    },
    update: {
      title: "Update Hasil QC",
      description:
        "Cari dan pilih hasil pemeriksaan, lalu klik Edit pada baris data yang ingin diperbarui.",
      breadcrumb: "Hasil QC / Update / Daftar",
    },
    delete: {
      title: "Hapus Hasil QC",
      description:
        "Pilih data hasil pemeriksaan dari daftar sebelum melakukan penghapusan.",
      breadcrumb: "Hasil QC / Hapus / Daftar",
    },
  }[mode];

  return (
    <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
      <EmployeeQcHeading
        title={config.title}
        description={config.description}
      />
      <QualityResultsTable mode={mode} />
      <Link
        href="/karyawan-qc/hasil-qc"
        className="relative z-10 mt-[18px] inline-flex h-10 w-fit items-center justify-center rounded-[8px] border border-[#d6e3ed] bg-white/90 px-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
      >
        Kembali ke Menu Hasil QC
      </Link>
    </div>
  );
}

const fieldClassName =
  "h-12 w-full rounded-[9px] border border-[#d9e3ed] bg-white px-[10px] text-[14px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

function ResultField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-bold text-[#17263b]">
        {label} *
      </label>
      {children}
    </div>
  );
}

function ResultSelect({
  id,
  name,
  placeholder,
  values,
  defaultValue,
}: {
  id: string;
  name: string;
  placeholder: string;
  values: { value: string; label: string }[];
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
        {values.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
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

export function QualityResultForm({
  mode,
  result,
}: {
  mode: "create" | "edit";
  result?: QualityResult;
}) {
  const router = useRouter();
  const editing = mode === "edit";
  const scheduleOptions = referenceSections["jadwal-qc"].rows.map((row) => ({
    value: row.code,
    label: `${row.code} — ${row.title}`,
  }));
  const detail = result ? getQualityResultDetails(result) : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const inspected = Number(values.get("inspected"));
    const passed = Number(values.get("passed"));
    const rejected = Number(values.get("rejected"));
    const rejectedInput = form.elements.namedItem("rejected");

    if (!(rejectedInput instanceof HTMLInputElement)) {
      throw new Error("The QC rejected-count input is missing.");
    }

    if (passed + rejected !== inspected) {
      rejectedInput.setCustomValidity(
        "Jumlah lolos dan reject harus sama dengan jumlah yang diperiksa.",
      );
      rejectedInput.reportValidity();
      rejectedInput.setCustomValidity("");
      return;
    }

    const code = editing ? result?.code : `HQC-${String(qualityResults.length + 1).padStart(3, "0")}`;
    if (!code) throw new Error("A QC result code is required.");

    router.push(
      editing
        ? `/karyawan-qc/hasil-qc/update/berhasil/${encodeURIComponent(code)}`
        : `/karyawan-qc/hasil-qc/tambah/berhasil/${encodeURIComponent(code)}`,
    );
  }

  return (
    <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
      <EmployeeQcHeading
        title={editing ? "Edit Data Hasil QC" : "Tambah Data Hasil QC"}
        description={
          editing && result && detail
            ? `Data terpilih: ${result.code} — ${detail.title} (${result.qcScheduleCode}). Ubah informasi yang diperlukan, lalu simpan perubahan.`
            : "Isi hasil pemeriksaan QC sebelum menyimpan data."
        }
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[900px]"
      >
        <div className="flex min-h-[660px] w-full flex-col rounded-[30px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.42)] p-[18px] shadow-[0_3px_4px_rgba(0,0,0,0.35)] md:min-h-[660px] md:rounded-[clamp(38px,4.65vw,67px)] md:p-[23px]">
          <h2 className="text-[18px] font-bold text-[#17263b] md:text-[20px]">
            Form Data Hasil QC
          </h2>
          <p className="mt-1 text-[13px] text-[#61738a] md:text-[14px]">
            {editing
              ? "Perbarui informasi hasil pemeriksaan. Kolom wajib ditandai dengan *."
              : "Lengkapi hasil pemeriksaan. Kolom wajib ditandai dengan *."}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <ResultField label="Jadwal QC" htmlFor="qc-schedule">
              <ResultSelect
                id="qc-schedule"
                name="qcSchedule"
                placeholder="Pilih jadwal QC"
                values={scheduleOptions}
                defaultValue={result?.qcScheduleCode}
              />
            </ResultField>
            <ResultField label="Hasil Produksi" htmlFor="production-result">
              <ResultSelect
                id="production-result"
                name="productionResult"
                placeholder="Pilih hasil produksi"
                values={productionResultOptions.map((option) => ({
                  value: option.code,
                  label: option.label,
                }))}
                defaultValue={result?.productionResultCode}
              />
            </ResultField>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:mt-[clamp(36px,10.5vw,150px)] md:grid-cols-2">
            <ResultField label="Tanggal Pencatatan" htmlFor="recorded-at">
              <input
                id="recorded-at"
                name="recordedAt"
                type="date"
                defaultValue={result?.recordedAt}
                required
                className={fieldClassName}
              />
            </ResultField>
            <ResultField label="Jumlah Diperiksa" htmlFor="inspected">
              <input
                id="inspected"
                name="inspected"
                type="number"
                min="0"
                defaultValue={result?.inspected}
                placeholder="Masukkan jumlah unit yang diperiksa"
                required
                className={fieldClassName}
              />
            </ResultField>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <ResultField label="Jumlah Lolos" htmlFor="passed">
              <input
                id="passed"
                name="passed"
                type="number"
                min="0"
                defaultValue={result?.passed}
                placeholder="Masukkan jumlah unit lolos"
                required
                className={fieldClassName}
              />
            </ResultField>
            <ResultField label="Jumlah Reject" htmlFor="rejected">
              <input
                id="rejected"
                name="rejected"
                type="number"
                min="0"
                defaultValue={result?.rejected}
                placeholder="Masukkan jumlah unit reject"
                required
                className={fieldClassName}
              />
            </ResultField>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <ResultField label={editing ? "Keterangan" : "Alasan"} htmlFor="note">
              <textarea
                id="note"
                name="note"
                defaultValue={result?.note}
                placeholder="Tambahkan keterangan hasil pemeriksaan"
                required={!editing}
                rows={2}
                className={`${fieldClassName} h-auto min-h-[62px] resize-y py-4`}
              />
            </ResultField>
            <ResultField label="Tindakan Perbaikan" htmlFor="corrective-action">
              <textarea
                id="corrective-action"
                name="correctiveAction"
                defaultValue={result?.correctiveAction}
                placeholder="Tambahkan Tindakan Perbaikan"
                required
                rows={2}
                className={`${fieldClassName} h-auto min-h-[62px] resize-y py-4`}
              />
            </ResultField>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
            <Button
              type="submit"
              className="h-11 px-[18px] text-[15px] md:text-[17px]"
            >
              {editing ? "Simpan Perubahan" : "Simpan"}
            </Button>
            <Link
              href="/karyawan-qc/hasil-qc"
              className="inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] text-[15px] font-semibold text-[#0a3d62] hover:bg-[#f6f9fc] md:text-[17px]"
            >
              Batal
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export function QualityResultConfirmation({
  code,
}: {
  code: string;
}) {
  return (
    <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
      <EmployeeQcHeading
        title="Hapus Hasil QC"
        description="Tindakan ini perlu konfirmasi."
      />
      <section
        aria-labelledby="delete-result-title"
        className="relative z-10 mx-auto mt-[clamp(35px,8vw,116px)] flex min-h-[250px] w-full max-w-[440px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-6 py-7 text-center"
      >
        <span
          aria-hidden="true"
          className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#ffe1e1] text-[38px] font-bold text-[#b87900]"
        >
          !
        </span>
        <h2
          id="delete-result-title"
          className="mt-3 text-[20px] font-bold text-[#17263b] md:text-[22px]"
        >
          Hapus hasil QC {code}?
        </h2>
        <p className="mt-2 text-[14px] text-[#61738a]">
          Data yang dihapus tidak dapat dikembalikan.
        </p>
        <div className="mt-5 flex w-full flex-wrap justify-center gap-3">
          <Link
            href="/karyawan-qc/hasil-qc/hapus"
            className="inline-flex h-10 min-w-[128px] items-center justify-center rounded-[8px] border border-[#d6e3ed] px-4 font-bold text-[#0a3d62] hover:bg-[#f6f9fc]"
          >
            Batal
          </Link>
          <Link
            href={`/karyawan-qc/hasil-qc/hapus/berhasil/${encodeURIComponent(code)}`}
            className="inline-flex h-10 min-w-[128px] items-center justify-center rounded-[8px] bg-[#bd2926] px-4 font-bold text-white hover:bg-[#a3201d]"
          >
            Ya, Hapus
          </Link>
        </div>
      </section>
    </div>
  );
}

export function QualityResultSuccess({
  action,
  code,
}: {
  action: "added" | "updated" | "deleted";
  code: string;
}) {
  const copy = {
    added: {
      title: "Hasil QC Berhasil Ditambahkan!",
      message: `Hasil QC ${code} telah berhasil ditambahkan.`,
      breadcrumb: "Hasil QC / Konfirmasi",
      heading: "Tambah Data Hasil QC",
      description: "Penyimpanan tambahan data hasil QC.",
    },
    updated: {
      title: "Hasil QC Berhasil Diperbarui!",
      message: `Hasil QC ${code} telah berhasil diperbarui.`,
      breadcrumb: "Hasil QC / Konfirmasi",
      heading: "Edit Data Hasil QC",
      description: "Perbarui data hasil QC.",
    },
    deleted: {
      title: "Hasil QC Berhasil Dihapus!",
      message: `Hasil QC ${code} telah berhasil dihapus.`,
      breadcrumb: "Hasil QC / Konfirmasi",
      heading: "Hapus Hasil QC",
      description: "Penghapusan data hasil QC.",
    },
  }[action];

  return (
    <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
      <EmployeeQcHeading title={copy.heading} description={copy.description} />
      <section
        aria-labelledby="result-success-title"
        className="relative z-10 mx-auto mt-[clamp(35px,4.2vw,60px)] flex min-h-[248px] w-full max-w-[440px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-6 py-7 text-center"
      >
        <span
          aria-hidden="true"
          className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#83dc99]"
        >
          <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
            <path
              d="m11 24 9 9 18-19"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2
          id="result-success-title"
          className="mt-3 text-[19px] font-bold text-[#17263b] md:text-[20px]"
        >
          {copy.title}
        </h2>
        <p className="mt-2 text-[14px] text-[#61738a]">{copy.message}</p>
        <Link
          href="/karyawan-qc/hasil-qc"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#28a745] px-4 text-[14px] font-bold text-white transition-colors hover:bg-[#218838]"
        >
          Kembali ke Menu Data Hasil QC
        </Link>
      </section>
    </div>
  );
}

export function EmployeeQcLogout() {
  return (
    <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
      <EmployeeQcHeading
        title="Konfirmasi Keluar"
        description="Pastikan Anda ingin mengakhiri sesi."
      />
      <section
        aria-labelledby="logout-title"
        className="relative z-10 mx-auto mt-[clamp(35px,8vw,116px)] flex min-h-[278px] w-full max-w-[560px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-6 py-7 text-center"
      >
        <h2
          id="logout-title"
          className="text-[20px] font-bold text-[#17263b] md:text-[24px]"
        >
          Keluar dari akun Karyawan QC?
        </h2>
        <span
          aria-hidden="true"
          className="mt-3 flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#ffe1e1] text-[34px] font-bold text-[#a46b00]"
        >
          ?
        </span>
        <p className="mt-5 text-[14px] text-[#61738a]">
          Sesi akan diakhiri dan Anda kembali ke halaman Login.
        </p>
        <div className="mt-5 flex w-full flex-wrap justify-center gap-3">
          <Link
            href="/karyawan-qc/bahan-baku"
            className="inline-flex h-10 min-w-[128px] items-center justify-center rounded-[8px] border border-[#d6e3ed] px-4 font-bold text-[#0a3d62] hover:bg-[#f6f9fc]"
          >
            Batal
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 min-w-[128px] items-center justify-center rounded-[8px] bg-[#bd2926] px-4 font-bold text-white hover:bg-[#a3201d]"
          >
            Ya, Keluar
          </Link>
        </div>
      </section>
    </div>
  );
}
