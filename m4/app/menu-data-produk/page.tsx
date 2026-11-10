import { BahanBakuPageShell } from "../../components/bahan-baku/page-shell";
import { ActionCard } from "../../components/ui/action-card";

const actions = [
  {
    title: "Tambah Produk",
    description:
      "Daftarkan produk dengan nama, varian, stok, dan resep sesuai database.",
    icon: "/images/bahan-baku/icon-plus.svg",
    href: "/data-produk/tambah",
  },
  {
    title: "Lihat Produk",
    description:
      "Lihat detail nama, varian, stok, dan resep produk yang tersimpan.",
    icon: "/images/bahan-baku/icon-eye.svg",
    href: "/data-produk/lihat",
  },
  {
    title: "Update Produk",
    description:
      "Pilih produk dari daftar, lalu perbarui informasi produk yang sudah tersimpan.",
    icon: "/images/bahan-baku/icon-edit.svg",
    href: "/data-produk/update",
  },
  {
    title: "Hapus Produk",
    description:
      "Pilih produk yang tidak digunakan dari daftar sebelum menghapus datanya.",
    icon: "/images/bahan-baku/icon-trash.svg",
    href: "/data-produk/hapus",
  },
];

export default function MenuDataProdukPage() {
  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Data Produk / Menu CRUD"
    >
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Menu Data Produk
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Pilih tindakan untuk mengelola informasi dan persediaan produk.
          </p>
        </div>

        <div className="mt-[clamp(36px,6.1vw,88px)] grid w-full grid-cols-1 gap-x-[clamp(20px,2.64vw,38px)] gap-y-[clamp(24px,4.58vw,66px)] md:grid-cols-2">
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
