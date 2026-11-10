import Image from "next/image";
import Link from "next/link";

const navigationItems = (
  activeSection:
    | "bahan-baku"
    | "data-produk"
    | "jadwal-produksi"
    | "jadwal-qc"
    | "laporan"
    | "keluar",
) => [
  {
    label: "Bahan Baku",
    icon: "/images/bahan-baku/nav-bahan-baku.svg",
    href: "/menu-bahan-baku",
    active: activeSection === "bahan-baku",
  },
  {
    label: "Data Produk",
    icon: "/images/bahan-baku/nav-data-produk.svg",
    href: "/menu-data-produk",
    active: activeSection === "data-produk",
  },
  {
    label: "Jadwal Produksi",
    icon: "/images/bahan-baku/nav-jadwal-produksi.svg",
    href: "/menu-jadwal-produksi",
    active: activeSection === "jadwal-produksi",
  },
  {
    label: "Jadwal QC",
    icon: "/images/bahan-baku/nav-jadwal-qc.svg",
    href: "/menu-jadwal-qc",
    active: activeSection === "jadwal-qc",
  },
  {
    label: "Laporan",
    icon: "/images/bahan-baku/nav-laporan.svg",
    href: "/menu-laporan",
    active: activeSection === "laporan",
  },
];

type SidebarItemProps = {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
};

function SidebarItem({
  label,
  icon,
  href,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[42px] shrink-0 items-center gap-[10px] rounded-[8px] px-3 py-[10px] text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da8da] ${
        active
          ? "bg-[#0c3c62] font-bold text-white"
          : "font-normal text-[#d6e5f2] hover:bg-white/10"
      } md:w-full`}
    >
      <Image src={icon} alt="" width={20} height={20} className="shrink-0" />
      <span className="flex-1 whitespace-nowrap">{label}</span>
      {active ? (
        <span
          aria-hidden="true"
          className="h-[18px] w-[5px] shrink-0 rounded-[3px] bg-[#4da8da]"
        />
      ) : null}
    </Link>
  );
}

export function Sidebar({
  activeSection = "bahan-baku",
}: {
  activeSection?:
    | "bahan-baku"
    | "data-produk"
    | "jadwal-produksi"
    | "jadwal-qc"
    | "laporan"
    | "keluar";
}) {
  return (
    <aside className="relative z-10 flex min-h-[auto] w-full shrink-0 flex-col gap-4 bg-[#071e3d] px-4 py-4 text-white md:min-h-svh md:w-[clamp(184px,18.06vw,260px)] md:gap-[clamp(18px,1.875vw,27px)] md:px-[clamp(12px,1.11vw,16px)] md:pb-[clamp(20px,1.94vw,28px)] md:pt-[clamp(16px,1.53vw,22px)]">
      <div className="flex items-center gap-3 overflow-hidden pl-[6px] md:gap-[14px]">
        <span className="relative h-12 w-[54px] shrink-0 overflow-hidden rounded-[10px] bg-[rgba(77,168,218,0.76)] md:h-[clamp(46px,4.24vw,61px)] md:w-[clamp(50px,4.72vw,68px)] md:rounded-[12px]">
          <Image
            src="/images/bahan-baku/logo-sip.png"
            alt=""
            fill
            sizes="68px"
            className="object-cover opacity-[0.76]"
          />
        </span>
        <p className="text-[11px] font-bold leading-[1.65] md:text-[clamp(11px,1.04vw,15px)]">
          SISTEM INFORMASI
          <br />
          PRODUKSI KERUPUK
          <br />
          CABE ONANG
        </p>
      </div>

      <div className="hidden w-full flex-col gap-1 overflow-hidden rounded-[10px] bg-[#6d28b8] p-[14px] md:flex">
        <p className="text-[17px] font-bold">Admin</p>
        <p className="text-[14px] text-[#bfd6eb]">Akses aktif</p>
      </div>

      <nav
        aria-label="Navigasi utama"
        className="flex gap-1 overflow-x-auto md:flex-col md:gap-[5px] md:overflow-visible"
      >
        {navigationItems(activeSection).map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
        <Link
          href="/admin/keluar"
          aria-current={activeSection === "keluar" ? "page" : undefined}
          className={`flex min-h-[42px] shrink-0 items-center gap-[10px] rounded-[9px] px-[14px] py-[10px] text-left font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da8da] md:hidden ${
            activeSection === "keluar"
              ? "bg-[#5b21a2]"
              : "bg-[#6d28b8] hover:bg-[#5b21a2]"
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
      </nav>

      <Link
        href="/admin/keluar"
        aria-current={activeSection === "keluar" ? "page" : undefined}
        className={`mt-auto hidden min-h-[42px] w-full items-center gap-[10px] rounded-[9px] px-[14px] py-[10px] text-left font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da8da] md:flex ${
          activeSection === "keluar"
            ? "bg-[#5b21a2]"
            : "bg-[#6d28b8] hover:bg-[#5b21a2]"
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
  );
}
