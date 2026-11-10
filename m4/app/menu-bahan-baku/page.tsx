import { BahanBakuPageShell } from "../../components/bahan-baku/page-shell";
import { ActionCard } from "../../components/ui/action-card";

const actions = [
  {
    title: "Tambah Bahan Baku",
    description:
      "Daftarkan bahan baku baru beserta kode, satuan, stok, dan harga satuannya.",
    icon: "/images/bahan-baku/icon-plus.svg",
    href: "/bahan-baku/tambah",
  },
  {
    title: "Lihat Bahan Baku",
    description:
      "Lihat daftar bahan baku, jumlah persediaan, dan stok minimum.",
    icon: "/images/bahan-baku/icon-eye.svg",
    href: "/bahan-baku/lihat",
  },
  {
    title: "Update Bahan Baku",
    description:
      "Pilih bahan baku dari daftar, lalu edit informasi dan data persediaannya.",
    icon: "/images/bahan-baku/icon-edit.svg",
    href: "/bahan-baku/update",
  },
  {
    title: "Hapus Bahan Baku",
    description:
      "Pilih bahan baku pada daftar untuk menghapus data yang tidak digunakan.",
    icon: "/images/bahan-baku/icon-trash.svg",
    href: "/bahan-baku/hapus",
  },
];

export default function MenuBahanBakuPage() {
  return (
    <BahanBakuPageShell breadcrumb="Admin / Bahan Baku / Menu CRUD">
      <div className="relative z-10 flex flex-1 flex-col gap-[clamp(17px,1.67vw,24px)] p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Menu Bahan Baku
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
            Pilih tindakan untuk mengelola data bahan baku.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-x-[clamp(20px,2.64vw,38px)] gap-y-[clamp(20px,3.2vw,46px)] md:grid-cols-2">
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
