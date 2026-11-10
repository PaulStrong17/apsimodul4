"use client";

import Image from "next/image";
import Link from "next/link";
import { verificationItems, formatOwnerDate } from "./data";

export function OwnerVerificationTable() {
  return (
    <section className="relative z-10 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <div className="px-4 py-[18px] md:px-6">
        <h2 className="text-[18px] font-bold text-[#17263b] md:text-[20px]">
          Keputusan Verifikasi Jadwal
        </h2>
        <p className="mt-1 inline-flex rounded-md bg-[#eaf4fc] px-2 py-1 text-[13px] font-bold text-[#0a3d62]">
          3 jadwal menunggu keputusan
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-[13px] text-[#17263b]">
          <thead className="h-[48px] bg-[#f6f9fc] font-bold">
            <tr>
              {[
                "Kode",
                "Jenis Jadwal",
                "Tanggal",
                "Keterangan",
                "Penanggung Jawab",
                "Status Keputusan",
                "Aksi",
              ].map((column) => (
                <th scope="col" key={column} className="px-4">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {verificationItems.map((item) => {
              const waiting = item.status === "Menunggu Keputusan";

              return (
                <tr
                  key={item.code}
                  className="min-h-[48px] border-t border-[#d6e3ed]"
                >
                  <td className="px-4 py-3 text-[#61738a]">{item.code}</td>
                  <td className="px-4 py-3 font-bold">{item.type}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatOwnerDate(item.date)}
                  </td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.responsible}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/owner/verifikasi-jadwal/${item.code}`}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-[8px] border border-[#d6e3ed] bg-white px-3 font-bold text-[#0a3d62] hover:bg-[#f6f9fc]"
                      >
                        <Image
                          src="/images/bahan-baku/icon-eye.svg"
                          alt=""
                          width={14}
                          height={14}
                        />
                        Lihat
                      </Link>
                      {waiting ? (
                        <>
                          <Link
                            href={`/owner/verifikasi-jadwal/${item.code}/setujui`}
                            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#4da8da] px-3 font-bold text-white transition-colors hover:bg-[#268bc3]"
                          >
                            Setujui
                          </Link>
                          <Link
                            href={`/owner/verifikasi-jadwal/${item.code}/tolak`}
                            className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#d6e3ed] px-3 font-bold text-[#0a3d62] hover:bg-[#f6f9fc]"
                          >
                            Tolak
                          </Link>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#d6e3ed] px-4 py-[14px] text-[13px] text-[#61738a] md:px-6">
        <p>Menampilkan 1–5 dari 5 jadwal</p>
        <p className="font-medium text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}

export function OwnerVerificationDetail({
  code,
}: {
  code: string;
}) {
  const item = verificationItems.find(
    (verification) => verification.code.toLowerCase() === code.toLowerCase(),
  );

  if (!item) return null;

  const waiting = item.status === "Menunggu Keputusan";
  const fields = [
    ["Kode Jadwal", item.code],
    ["Jenis Jadwal", item.type],
    ["Tanggal Produksi", formatOwnerDate(item.date, "long")],
    ["Nama Produk", item.description.split(" · ")[0]],
    ["Jumlah Produksi", item.description.split(" · ")[1] ?? "Belum dicatat"],
    ["Penanggung Jawab", item.responsible],
    ["Tanggal Pengajuan", waiting ? "Belum dicatat" : formatOwnerDate(item.date, "long")],
    ["Status Verifikasi", item.status],
  ];

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#071e3d]/45 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-detail-title"
        className="w-full max-w-[900px] rounded-[12px] border border-[#d6e3ed] bg-white p-5 shadow-xl md:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2
              id="verification-detail-title"
              className="text-[20px] font-bold text-[#17263b] md:text-[24px]"
            >
              Detail Jadwal
            </h2>
            <p className="mt-1 text-[14px] text-[#61738a]">
              {item.code} · Informasi {item.type}
            </p>
          </div>
          <span className="rounded-md bg-[#fff4df] px-3 py-2 text-[13px] font-bold text-[#9b6500]">
            {item.status}
          </span>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="mb-1 text-[13px] font-bold text-[#61738a]">
                {label}
              </dt>
              <dd className="rounded-md border border-[#d6e3ed] bg-[#f6f9fc] px-3 py-2 text-[14px] text-[#17263b]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 rounded-md border border-[#d6e3ed] bg-[#f6f9fc] p-3">
          <div className="flex justify-between gap-3">
            <h3 className="text-[14px] font-bold text-[#17263b]">
              Riwayat Verifikasi
            </h3>
            <p className="text-[12px] text-[#61738a]">
              {waiting ? "Belum ada keputusan Owner" : "Sudah diverifikasi"}
            </p>
          </div>
          <div className="mt-3 grid gap-3 text-[13px] md:grid-cols-3">
            <p>
              <span className="block text-[#61738a]">Tanggal Keputusan</span>
              {waiting ? "Belum tersedia" : formatOwnerDate(item.date, "long")}
            </p>
            <p>
              <span className="block text-[#61738a]">Keputusan Owner</span>
              {item.status}
            </p>
            <p>
              <span className="block text-[#61738a]">Catatan</span>
              Belum tersedia
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/owner/verifikasi-jadwal"
            className="inline-flex h-11 items-center rounded-[8px] border border-[#d6e3ed] px-4 font-bold text-[#0a3d62]"
          >
            Tutup
          </Link>
          {waiting ? (
            <div className="flex gap-2">
              <Link
                href={`/owner/verifikasi-jadwal/${item.code}/setujui`}
                className="inline-flex h-11 items-center rounded-[8px] bg-[#297a4f] px-4 font-bold text-white"
              >
                Setujui
              </Link>
              <Link
                href={`/owner/verifikasi-jadwal/${item.code}/tolak`}
                className="inline-flex h-11 items-center rounded-[8px] bg-[#c8373a] px-4 font-bold text-white"
              >
                Tolak
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function OwnerVerificationResult({
  code,
  decision,
}: {
  code: string;
  decision: "setujui" | "tolak";
}) {
  const approved = decision === "setujui";

  return (
    <section
      aria-labelledby="verification-result-title"
      className="relative z-10 mx-auto mt-8 flex min-h-[350px] w-full max-w-[620px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-5 pt-7"
    >
      <div
        aria-hidden="true"
        className={`flex h-[110px] w-[110px] items-center justify-center rounded-full ${
          approved ? "bg-[#87de9b]" : "bg-[#c8373a]"
        }`}
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
      <h2
        id="verification-result-title"
        className="mt-3 text-center text-[20px] font-bold text-[#17263b] md:text-[24px]"
      >
        Jadwal Berhasil {approved ? "Disetujui" : "Ditolak"}
      </h2>
      <p className="mt-2 text-center text-[14px] text-[#61738a] md:text-[17px]">
        Jadwal {code} telah berhasil {approved ? "disetujui" : "ditolak"}.
      </p>
      <Link
        href="/owner/verifikasi-jadwal"
        className={`mt-5 inline-flex h-11 items-center rounded-[9px] px-4 font-bold text-white ${
          approved ? "bg-[#28a745] hover:bg-[#218838]" : "bg-[#d8493e] hover:bg-[#bf3930]"
        }`}
      >
        Kembali ke Rekap Verifikasi Jadwal
      </Link>
    </section>
  );
}
