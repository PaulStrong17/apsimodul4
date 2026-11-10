import Image from "next/image";
import { Suspense } from "react";
import { Sidebar } from "../navigation/sidebar";
import { requireAdminPage } from "../../lib/admin/authorization";

type BahanBakuPageShellProps = {
  breadcrumb: string;
  activeSection?:
    | "bahan-baku"
    | "data-produk"
    | "jadwal-produksi"
    | "jadwal-qc"
    | "laporan"
    | "keluar";
  backgroundImage?: string;
  children: React.ReactNode;
};

export function BahanBakuPageShell(props: BahanBakuPageShellProps) {
  return (
    <Suspense fallback={null}>
      <AuthorizedBahanBakuPageShell {...props} />
    </Suspense>
  );
}

async function AuthorizedBahanBakuPageShell({
  breadcrumb,
  activeSection = "bahan-baku",
  backgroundImage = "/images/bahan-baku/background.png",
  children,
}: BahanBakuPageShellProps) {
  await requireAdminPage();

  return (
    <main className="flex min-h-svh flex-col md:flex-row">
      <Sidebar activeSection={activeSection} />

      <section className="relative flex min-w-0 flex-1 flex-col bg-[#f6f9fc]">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="(min-width: 768px) 82vw, 100vw"
            loading="eager"
            className="object-cover opacity-[0.15]"
          />
        </div>

        <header className="relative z-10 flex h-[clamp(54px,5.28vw,76px)] shrink-0 items-center justify-between border-b border-[#d6e3ed] bg-white px-[clamp(20px,2.5vw,36px)]">
          <div className="flex min-w-0 flex-col gap-1 leading-normal">
            <p className="truncate text-[17px] font-bold text-[#17263b] md:text-[20px]">
              Sistem Informasi Produksi
            </p>
            <p className="truncate text-[13px] text-[#61738a] md:text-[15px]">
              {breadcrumb}
            </p>
          </div>
          <p className="ml-4 shrink-0 text-[14px] font-bold leading-[21px] text-[#17263b] md:text-[16px]">
            Admin
          </p>
        </header>

        {children}
      </section>
    </main>
  );
}
