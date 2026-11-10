import Link from "next/link";
import { OwnerShell } from "../../../components/owner/owner-shell";

export default function OwnerLogoutPage() {
  return (
    <OwnerShell
      activeSection="keluar"
      breadcrumb="Pengelolaan Data"
      backgroundImage="/images/owner/background-keluar.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="relative z-10">
          <h1 className="text-[22px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Konfirmasi Keluar
          </h1>
          <p className="mt-1 text-[14px] text-[#61738a] md:text-[17px]">
            Pastikan Anda ingin mengakhiri sesi.
          </p>
        </div>
        <section
          aria-labelledby="owner-logout-title"
          className="relative z-10 mx-auto mt-8 flex min-h-[276px] w-full max-w-[620px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-5 pt-6"
        >
          <h2
            id="owner-logout-title"
            className="text-center text-[20px] font-bold text-[#17263b] md:text-[24px]"
          >
            Keluar dari akun Owner?
          </h2>
          <div
            aria-hidden="true"
            className="mt-3 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#ffe3e3] text-[32px] font-bold text-[#bd7100]"
          >
            ?
          </div>
          <p className="mt-3 text-center text-[14px] text-[#61738a] md:text-[16px]">
            Sesi akan diakhiri dan Anda kembali ke halaman Login.
          </p>
          <div className="mt-5 flex w-full max-w-[420px] gap-3">
            <Link
              href="/owner/dashboard-kpi"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-[9px] border border-[#d6e3ed] font-bold text-[#0a3d62]"
            >
              Batal
            </Link>
            <Link
              href="/login"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-[9px] bg-[#b82926] font-bold text-white hover:bg-[#9d201e]"
            >
              Ya, Keluar
            </Link>
          </div>
        </section>
      </div>
    </OwnerShell>
  );
}
