"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ScheduleDeleteConfirmation({
  code,
  productName,
}: {
  code: string;
  productName: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteSchedule() {
    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/jadwal-produksi/${encodeURIComponent(code)}`,
        { method: "DELETE" },
      );
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Jadwal produksi tidak dapat dihapus.");
        return;
      }

      router.replace(
        `/jadwal-produksi/hapus/berhasil/${encodeURIComponent(code)}`,
      );
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section
      aria-labelledby="delete-schedule-title"
      className="relative z-10 w-full max-w-[440px] rounded-[12px] border border-[#d6e3ed] bg-white px-6 py-7 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#ffdddd] text-[38px] font-bold text-[#bb7b00]"
      >
        !
      </div>
      <h2
        id="delete-schedule-title"
        className="mt-4 text-[18px] font-bold leading-[1.4] text-[#17263b] md:text-[20px]"
      >
        Hapus jadwal {code} untuk {productName}?
      </h2>
      <p className="mt-2 text-[14px] leading-normal text-[#61738a]">
        Data yang dihapus tidak dapat dikembalikan.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href="/jadwal-produksi/hapus"
          className="inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-4 font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
        >
          Batal
        </Link>
        <button
          type="button"
          disabled={isDeleting}
          onClick={deleteSchedule}
          className="inline-flex h-11 items-center justify-center rounded-[9px] bg-[#b82926] px-4 font-bold text-white transition-colors hover:bg-[#9d201e] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926]"
        >
          {isDeleting ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
