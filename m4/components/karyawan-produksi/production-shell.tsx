import Image from "next/image";
import Link from "next/link";
import {
  productionNavigation,
  type ProductionActiveSection,
} from "./data";

export function ProductionShell({
  activeSection,
  breadcrumb,
  backgroundImage = "/images/karyawan-qc/background-jadwal-produksi.jpg",
  children,
}: {
  activeSection: ProductionActiveSection;
  breadcrumb: string;
  backgroundImage?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-svh flex-col md:flex-row">
      <aside className="relative z-10 flex min-h-[auto] w-full shrink-0 flex-col gap-4 bg-[#071e3d] px-4 py-4 text-white md:min-h-svh md:w-[260px] md:gap-[27px] md:px-4 md:pb-7 md:pt-[22px]">
        <div className="flex items-center gap-[14px] overflow-hidden pl-[6px]">
          <span className="relative h-12 w-[54px] shrink-0 overflow-hidden rounded-[10px] bg-[rgba(77,168,218,0.76)] md:h-[61px] md:w-[68px] md:rounded-[12px]">
            <Image
              src="/images/bahan-baku/logo-sip.png"
              alt=""
              fill
              sizes="68px"
              className="object-cover opacity-[0.76]"
            />
          </span>
          <p className="text-[11px] font-bold leading-[1.65] md:text-[15px]">
            SISTEM INFORMASI
            <br />
            PRODUKSI KERUPUK
            <br />
            CABE ONANG
          </p>
        </div>

        <div className="flex w-full flex-col gap-1 overflow-hidden rounded-[10px] bg-[#c75c14] p-[14px]">
          <p className="text-[17px] font-bold">Karyawan Produksi</p>
          <p className="text-[14px] text-[#bfd6eb]">Akses aktif</p>
        </div>

        <nav
          aria-label="Navigasi Karyawan Produksi"
          className="flex gap-1 overflow-x-auto md:flex-col md:gap-[5px] md:overflow-visible"
        >
          {productionNavigation.map((item) => {
            const active = item.section === activeSection;
            return (
              <Link
                key={item.section}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[42px] shrink-0 items-center gap-[10px] rounded-[8px] px-3 py-[10px] text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f09b55] md:w-full ${
                  active
                    ? "bg-[#0c3c62] font-bold text-white"
                    : "text-[#d6e5f2] hover:bg-white/10"
                }`}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span className="whitespace-nowrap">{item.label}</span>
                {active ? (
                  <span
                    aria-hidden="true"
                    className="ml-auto h-[18px] w-[5px] shrink-0 rounded-[3px] bg-[#f09b55]"
                  />
                ) : null}
              </Link>
            );
          })}
          <Link
            href="/karyawan-produksi/keluar"
            className="flex min-h-[42px] shrink-0 items-center gap-[10px] rounded-[9px] bg-[#c75c14] px-[14px] py-[10px] font-bold text-white transition-colors hover:bg-[#a94b0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f09b55] md:hidden"
          >
            <Image
              src="/images/bahan-baku/nav-keluar.svg"
              alt=""
              width={20}
              height={20}
            />
            Keluar
          </Link>
        </nav>

        <Link
          href="/karyawan-produksi/keluar"
          aria-current={activeSection === "keluar" ? "page" : undefined}
          className={`mt-auto hidden min-h-[42px] w-full items-center gap-[10px] rounded-[9px] px-[14px] py-[10px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f09b55] md:flex ${
            activeSection === "keluar"
              ? "bg-[#a94b0c]"
              : "bg-[#c75c14] hover:bg-[#a94b0c]"
          }`}
        >
          <Image
            src="/images/bahan-baku/nav-keluar.svg"
            alt=""
            width={20}
            height={20}
          />
          Keluar
        </Link>
      </aside>

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
              Karyawan Produksi / {breadcrumb}
            </p>
          </div>
          <p className="ml-4 shrink-0 text-[14px] font-bold text-[#17263b] md:text-[16px]">
            Karyawan Produksi
          </p>
        </header>
        {children}
      </section>
    </main>
  );
}

export function ProductionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="relative z-10 mb-6">
      <h1 className="text-[22px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
