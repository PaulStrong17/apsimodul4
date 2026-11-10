"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatFullReportPeriod,
  formatReportNumber,
  formatRejectRate,
  formatShortReportPeriod,
  type ProductionReport,
} from "../laporan/data";

export function OwnerReportTable({
  reports,
}: {
  reports: ProductionReport[];
}) {
  return (
    <section className="relative z-10 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <h2 className="px-4 py-[18px] text-[18px] font-bold text-[#17263b] md:px-6 md:text-[20px]">
        Data Rekap Laporan
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left text-[13px] text-[#17263b] md:text-[15px]">
          <thead className="h-[48px] bg-[#f6f9fc] font-bold">
            <tr>
              {[
                "Kode",
                "Jenis Laporan",
                "Periode",
                "Total Produksi",
                "Reject Rate",
                "Status Pencapaian",
                "Aksi",
              ].map((column) => (
                <th scope="col" key={column} className="px-4">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-[#61738a]"
                >
                  Belum ada rekap laporan.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report.code}
                  className="min-h-[68px] border-t border-[#d6e3ed]"
                >
                  <td className="px-4 py-3 text-[#61738a]">{report.code}</td>
                  <td className="max-w-[190px] px-4 py-3 font-bold">
                    {report.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatShortReportPeriod(report)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatReportNumber(report.totalProduction)} pcs
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatRejectRate(report.rejectRate)}
                  </td>
                  <td className="px-4 py-3">{report.achievement}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/owner/rekap-laporan/${encodeURIComponent(report.code)}`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6e3ed] bg-white px-3 font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:h-11 md:px-[14px]"
                      >
                        <Image
                          src="/images/bahan-baku/icon-eye.svg"
                          alt=""
                          width={16}
                          height={16}
                        />
                        Lihat
                      </Link>
                      <Link
                        href={`/owner/rekap-laporan/hapus/${encodeURIComponent(report.code)}`}
                        aria-label={`Hapus rekap laporan ${report.code}`}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-[#b82926] px-3 font-bold text-white transition-colors hover:bg-[#9d201e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926] md:h-11 md:px-[14px]"
                      >
                        <Image
                          src="/images/bahan-baku/icon-trash.svg"
                          alt=""
                          width={15}
                          height={15}
                          className="brightness-0 invert"
                        />
                        Hapus
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#d6e3ed] px-4 py-[14px] text-[13px] text-[#61738a] md:px-6">
        <p>Menampilkan {reports.length} rekap laporan</p>
        <p className="font-medium text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}

export function OwnerReportDetail({ report }: { report: ProductionReport }) {
  const details = [
    { label: "Periode", value: formatFullReportPeriod(report) },
    {
      label: "Total Produksi",
      value: `${formatReportNumber(report.totalProduction)} pcs`,
    },
    { label: "Jumlah Pemeriksaan", value: `${report.inspectionCount} pemeriksaan` },
    { label: "Reject Rate", value: formatRejectRate(report.rejectRate) },
    { label: "Target Reject Rate", value: formatRejectRate(report.targetRejectRate) },
    { label: "Status Pencapaian", value: report.achievement },
    { label: "Owner Penerima Laporan", value: report.owner },
    { label: "Dicatat oleh", value: report.createdBy },
  ];

  return (
    <section className="relative z-10 w-full max-w-[900px] rounded-[14px] border border-[#d6e3ed] bg-white p-5 md:p-6">
      <div>
        <h2 className="text-[21px] font-bold text-[#17263b] md:text-[24px]">
          {report.type}
        </h2>
        <p className="mt-1 text-[15px] text-[#61738a] md:text-[17px]">
          {report.code}
        </p>
      </div>
      <div className="my-5 h-px bg-[#d6e3ed]" />
      <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="text-[13px] text-[#61738a] md:text-[15px]">
              {detail.label}
            </dt>
            <dd className="mt-1 text-[14px] font-bold text-[#17263b] md:text-[17px]">
              {detail.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <p className="text-[13px] text-[#61738a] md:text-[15px]">
          Hasil Tindakan Perbaikan
        </p>
        <p className="mt-1 text-[14px] text-[#17263b] md:text-[16px]">
          {report.correctiveAction || "—"}
        </p>
      </div>
      <p className="mt-5 rounded-md bg-[#f6f9fc] p-3 text-[13px] leading-relaxed text-[#61738a] md:text-[15px]">
        Owner dapat melihat dan menghapus rekap laporan. Perubahan isi laporan
        dilakukan oleh Admin.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/owner/rekap-laporan"
          className="inline-flex h-11 items-center rounded-[9px] border border-[#d6e3ed] px-4 font-bold text-[#0a3d62]"
        >
          Kembali
        </Link>
        <Link
          href={`/owner/rekap-laporan/hapus/${encodeURIComponent(report.code)}`}
          className="inline-flex h-11 items-center gap-2 rounded-[9px] bg-[#b82926] px-4 font-bold text-white hover:bg-[#9d201e]"
        >
          <Image
            src="/images/bahan-baku/icon-trash.svg"
            alt=""
            width={16}
            height={16}
            className="brightness-0 invert"
          />
          Hapus
        </Link>
      </div>
    </section>
  );
}

export function OwnerReportDeleteConfirmation({
  code,
}: {
  code: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/owner/rekap-laporan/${encodeURIComponent(code)}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Terjadi kesalahan saat menghapus laporan.");
        setIsDeleting(false);
        return;
      }

      router.replace(
        `/owner/rekap-laporan/hapus/berhasil/${encodeURIComponent(code)}`,
      );
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setIsDeleting(false);
    }
  }

  return (
    <section
      aria-labelledby="owner-delete-title"
      className="relative z-10 mx-auto mt-8 flex min-h-[264px] w-full max-w-[620px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-5 pt-7"
    >
      <div
        aria-hidden="true"
        className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#fff0d6] text-[42px] font-bold text-[#bd7100]"
      >
        !
      </div>
      <h2
        id="owner-delete-title"
        className="mt-3 text-center text-[20px] font-bold text-[#17263b] md:text-[24px]"
      >
        Hapus rekap laporan {code}?
      </h2>
      <p className="mt-2 text-center text-[14px] text-[#61738a] md:text-[17px]">
        Data yang dihapus tidak dapat dikembalikan.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-[9px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mt-5 flex w-full max-w-[420px] gap-3">
        <Link
          href="/owner/rekap-laporan"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-[9px] border border-[#d6e3ed] font-bold text-[#0a3d62]"
        >
          Batal
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-[9px] bg-[#b82926] font-bold text-white hover:bg-[#9d201e] disabled:opacity-60"
        >
          {isDeleting ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
    </section>
  );
}

export function OwnerReportDeleteSuccess({ code }: { code: string }) {
  return (
    <section className="relative z-10 mx-auto mt-8 flex min-h-[350px] w-full max-w-[620px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-5 pt-7">
      <div
        aria-hidden="true"
        className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#87de9b]"
      >
        <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
          <path
            d="m11 24 9 9 18-19"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mt-3 text-center text-[20px] font-bold text-[#17263b] md:text-[24px]">
        Rekap Laporan Berhasil Dihapus!
      </h2>
      <p className="mt-2 text-center text-[14px] text-[#61738a] md:text-[17px]">
        Rekap laporan {code} telah berhasil dihapus.
      </p>
      <Link
        href="/owner/rekap-laporan"
        className="mt-5 inline-flex h-11 items-center rounded-[9px] bg-[#28a745] px-4 font-bold text-white hover:bg-[#218838]"
      >
        Kembali ke Rekap Laporan
      </Link>
    </section>
  );
}
