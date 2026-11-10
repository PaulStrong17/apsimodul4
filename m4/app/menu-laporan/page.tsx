import { ActionCard } from "../../components/ui/action-card";
import { BahanBakuPageShell } from "../../components/bahan-baku/page-shell";
import { ReportPageHeading } from "../../components/laporan/page-heading";

const actions = [
  {
    title: "Tambah Laporan",
    description:
      "Buat laporan baru dengan periode, hasil produksi, dan ringkasan pemeriksaan mutu.",
    icon: "/images/bahan-baku/icon-plus.svg",
    href: "/laporan/tambah",
  },
  {
    title: "Lihat Laporan",
    description:
      "Lihat rincian laporan berdasarkan periode untuk meninjau hasil kegiatan operasional.",
    icon: "/images/bahan-baku/icon-eye.svg",
    href: "/laporan/lihat",
  },
  {
    title: "Update Laporan",
    description:
      "Pilih laporan dari daftar untuk memperbarui isi, periode, atau catatan laporan.",
    icon: "/images/bahan-baku/icon-edit.svg",
    href: "/laporan/update",
  },
  {
    title: "Hapus Laporan",
    description:
      "Pilih laporan yang tidak digunakan atau salah dibuat sebelum menghapus datanya.",
    icon: "/images/bahan-baku/icon-trash.svg",
    href: "/laporan/hapus",
  },
];

export default function MenuLaporanPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Laporan / Menu CRUD"
      activeSection="laporan"
      backgroundImage="/images/laporan/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Menu Laporan"
          description="Pilih tindakan untuk mengelola laporan produksi dan pemeriksaan mutu."
        />
        <div className="relative z-10 mt-8 grid grid-cols-1 gap-5 md:mt-[clamp(52px,6.1vw,88px)] md:grid-cols-2 md:gap-6">
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
