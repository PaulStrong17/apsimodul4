"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReportDeleteConfirmation({
  code,
  type,
}: {
  code: string;
  type?: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/laporan/${encodeURIComponent(code)}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Terjadi kesalahan saat menghapus laporan.");
        setIsDeleting(false);
        return;
      }

      router.replace(`/laporan/hapus/berhasil/${encodeURIComponent(code)}`);
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setIsDeleting(false);
    }
  }

  return (
    <section
      aria-labelledby="delete-report-title"
      className="relative z-10 w-full max-w-[620px] rounded-[14px] border border-[#d6e3ed] bg-white px-5 py-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:p-10"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#ffdcdc] text-[44px] font-bold text-[#b7791f]"
      >
        !
      </div>
      <h2
        id="delete-report-title"
        className="mt-4 text-[19px] font-bold leading-[1.4] text-[#17263b] md:text-[24px]"
      >
        Hapus data laporan {code}?
      </h2>
      <p className="mt-2 text-[14px] leading-normal text-[#61738a] md:text-[17px]">
        {type ? `Jenis: ${type}. ` : ""}Data yang dihapus tidak dapat
        dikembalikan.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-[9px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={() => router.push("/laporan/hapus")}
          className="inline-flex h-11 w-full items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] sm:w-[180px]"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex h-11 w-full items-center justify-center rounded-[9px] bg-[#b82926] px-[18px] font-bold text-white transition-colors hover:bg-[#9d201e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926] disabled:opacity-60 sm:w-[220px]"
        >
          {isDeleting ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
    </section>
  );
}
