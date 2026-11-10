"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type {
  ProductionReference,
  ProductionRow,
  ProductionSection,
} from "./data";

function StatusBadge({ value }: { value: string }) {
  const classes =
    value === "Selesai" || value === "Terverifikasi"
      ? "bg-[#e6f4ec] text-[#118247]"
      : value === "Berjalan" || value === "Dalam Tindakan"
        ? "bg-[#fff3d8] text-[#9a6500]"
        : "bg-[#eaf4fc] text-[#0a3d62]";

  return (
    <span className={`inline-flex rounded-[5px] px-2 py-1 text-[12px] font-bold ${classes}`}>
      {value}
    </span>
  );
}

export function ProductionTable({
  section,
  data,
}: {
  section: ProductionSection;
  data: ProductionReference;
}) {
  return (
    <section className="relative z-10 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.94)]">
      <h2 className="px-6 py-[18px] text-[17px] font-bold text-[#17263b] md:text-[20px]">
        {data.tableTitle}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-[14px] text-[#17263b]">
          <thead className="bg-[#eef5fa] font-bold">
            <tr>
              {data.columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-3">
                  {column}
                </th>
              ))}
              <th scope="col" className="px-4 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr
                key={row.code}
                className="h-[54px] border-t border-[#d6e3ed] align-middle"
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.code}-${index}`}
                    className={`px-4 py-3 ${
                      index === 0
                        ? "whitespace-nowrap text-[#61738a]"
                        : index === 1
                          ? "font-bold"
                          : ""
                    }`}
                  >
                    {cell === "Selesai" ||
                    cell === "Berjalan" ||
                    cell === "Direncanakan" ||
                    cell === "Terjadwal" ||
                    cell === "Menunggu Perbaikan" ||
                    cell === "Dalam Tindakan" ? (
                      <StatusBadge value={cell} />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                <td className="px-4 py-2">
                  <Link
                    href={`/karyawan-produksi/${section}/${row.code}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6e3ed] bg-white px-3 text-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
                  >
                    <Image
                      src="/images/bahan-baku/icon-eye.svg"
                      alt=""
                      width={14}
                      height={14}
                    />
                    Lihat
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex min-h-[62px] items-center justify-between border-t border-[#d6e3ed] px-6 text-[14px] text-[#61738a]">
        <p>
          Menampilkan 1–{data.rows.length} dari {data.rows.length} data
        </p>
        <p className="text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}

export function ProductionDetails({
  section,
  row,
}: {
  section: ProductionSection;
  row: ProductionRow;
}) {
  return (
    <section className="relative z-10 w-full max-w-[900px] rounded-[14px] border border-[#d6e3ed] bg-white px-5 py-5 md:px-6 md:py-6">
      <h2 className="text-[18px] font-bold text-[#17263b] md:text-[22px]">
        {row.title}
      </h2>
      <p className="mt-1 text-[14px] text-[#61738a]">{row.code}</p>
      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-[#d6e3ed] pt-6 sm:grid-cols-2">
        {row.fields.map(([label, value]) => (
          <div key={label} className="flex min-w-0 flex-col gap-2">
            <dt className="text-[14px] text-[#61738a]">{label}</dt>
            <dd className="text-[16px] font-bold leading-[1.4] text-[#17263b] md:text-[17px]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href={`/karyawan-produksi/${section}`}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] font-semibold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
      >
        Kembali
      </Link>
    </section>
  );
}

function FormField({
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
      <label htmlFor={htmlFor} className="text-[14px] font-bold text-[#17263b]">
        {label} *
      </label>
      {children}
    </div>
  );
}

const inputClassName =
  "h-11 w-full rounded-[8px] border border-[#d6e3ed] bg-white px-3 text-[14px] text-[#17263b] outline-none transition focus:border-[#c75c14] focus:ring-2 focus:ring-[#c75c14]/15";

export function ProductionInputForm({
  mode,
}: {
  mode: "progress" | "result";
}) {
  const [schedules, setSchedules] = useState<
    { id: string; productName: string }[]
  >([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progressMode = mode === "progress";
  const title = progressMode
    ? "Input Data Progress Produk"
    : "Input Data Hasil Produksi";
  const description = progressMode
    ? "Catat perkembangan pelaksanaan jadwal produksi."
    : "Catat jumlah hasil produksi untuk jadwal yang telah dikerjakan.";

  useEffect(() => {
    const controller = new AbortController();

    async function loadSchedules() {
      try {
        const response = await fetch("/api/production", {
          signal: controller.signal,
        });
        const result: {
          error?: string;
          schedules?: { id: string; productName: string }[];
        } = await response.json();

        if (!response.ok || !result.schedules) {
          setLoadError(result.error ?? "Jadwal produksi tidak dapat dimuat.");
          return;
        }

        setSchedules(result.schedules);
      } catch {
        if (!controller.signal.aborted) {
          setLoadError("Jadwal produksi tidak dapat dimuat.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadSchedules();
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const rawAmount = formData.get("amount");

    try {
      const response = await fetch("/api/production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          scheduleId: formData.get("schedule"),
          ...(progressMode
            ? { status: formData.get("status") }
            : {
                date: formData.get("recordedDate"),
                amount: rawAmount ? Number(rawAmount) : null,
                note: formData.get("note"),
              }),
        }),
      });
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Data produksi tidak dapat disimpan.");
        return;
      }

      setMessage("Data berhasil disimpan ke database.");
      form.reset();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative z-10 w-full max-w-[900px] rounded-[16px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.94)] p-5 md:p-6">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#17263b] md:text-[20px]">
          Form {title}
        </h2>
        <p className="mt-1 text-[14px] text-[#61738a]">{description}</p>
      </div>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className={`grid gap-5 ${progressMode ? "" : "sm:grid-cols-2"}`}>
          <FormField label="Jadwal Produksi" htmlFor="production-schedule">
            <select
              id="production-schedule"
              name="schedule"
              defaultValue=""
              required
              disabled={isLoading || schedules.length === 0}
              className={inputClassName}
            >
              <option value="" disabled>
                {isLoading ? "Memuat jadwal..." : "Pilih jadwal produksi"}
              </option>
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.id} — {schedule.productName}
                </option>
              ))}
            </select>
          </FormField>
          {!progressMode ? (
            <FormField label="Tanggal Pencatatan" htmlFor="recorded-date">
              <input
                id="recorded-date"
                name="recordedDate"
                type="date"
                required
                className={inputClassName}
              />
            </FormField>
          ) : null}
        </div>
        {progressMode ? (
          <FormField label="Status Produksi" htmlFor="production-status">
            <select
              id="production-status"
              name="status"
              defaultValue=""
              required
              className={inputClassName}
            >
              <option value="" disabled>
                Pilih status
              </option>
              <option>Direncanakan</option>
              <option>Berjalan</option>
              <option>Selesai</option>
            </select>
          </FormField>
        ) : (
          <FormField label="Jumlah Hasil Produksi" htmlFor="production-amount">
            <input
              id="production-amount"
              name="amount"
              type="number"
              min="0"
              step="1"
              placeholder="Masukkan jumlah hasil produksi"
              required
              className={inputClassName}
            />
          </FormField>
        )}
        {!progressMode ? (
          <FormField label="Keterangan" htmlFor="production-note">
            <textarea
              id="production-note"
              name="note"
              rows={3}
              placeholder="Tambahkan keterangan"
              required
              maxLength={255}
              className={`${inputClassName} h-auto min-h-[88px] resize-y py-3`}
            />
          </FormField>
        ) : null}
        {loadError ? (
          <p role="alert" className="text-sm text-red-700">
            {loadError}
          </p>
        ) : null}
        {!isLoading && !loadError && schedules.length === 0 ? (
          <p className="text-sm text-[#61738a]">
            Belum ada jadwal produksi yang ditugaskan kepada Anda.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || isLoading || schedules.length === 0}
            className="inline-flex h-11 items-center justify-center rounded-[9px] bg-[#0a3d62] px-[18px] text-[15px] font-bold text-white transition-colors hover:bg-[#082f4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
          <Link
            href="/karyawan-produksi/jadwal-produksi"
            className="inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] text-[15px] font-semibold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc]"
          >
            Batal
          </Link>
        </div>
        {error ? (
          <p
            role="alert"
            className="rounded-[9px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700"
          >
            {error}
          </p>
        ) : null}
        {message ? (
          <p
            role="status"
            className="rounded-[9px] border border-[#b8e3c7] bg-[#e6f4ec] px-4 py-3 text-[14px] font-semibold text-[#118247]"
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
