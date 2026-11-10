import Link from "next/link";

export function QualityDeleteConfirmation({ code }: { code: string }) {
  return (
    <section
      aria-labelledby="delete-quality-title"
      className="relative z-10 w-full max-w-[620px] rounded-[14px] border border-[#d6e3ed] bg-white px-5 py-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:p-10"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#ffdcdc] text-[44px] font-bold text-[#b7791f]"
      >
        !
      </div>
      <h2
        id="delete-quality-title"
        className="mt-4 text-[19px] font-bold leading-[1.4] text-[#17263b] md:text-[24px]"
      >
        Hapus data jadwal pemeriksaan QC {code}?
      </h2>
      <p className="mt-2 text-[14px] leading-normal text-[#61738a] md:text-[17px]">
        Data yang dihapus tidak dapat dikembalikan.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
        <Link
          href="/jadwal-qc/hapus"
          className="inline-flex h-11 w-full items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] sm:w-[180px]"
        >
          Batal
        </Link>
        <Link
          href={`/jadwal-qc/hapus/berhasil/${encodeURIComponent(code)}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-[9px] bg-[#b82926] px-[18px] font-bold text-white transition-colors hover:bg-[#9d201e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926] sm:w-[220px]"
        >
          Ya, Hapus
        </Link>
      </div>
    </section>
  );
}
