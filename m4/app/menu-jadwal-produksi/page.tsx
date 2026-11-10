import { ActionCard } from "../../components/ui/action-card";
import { BahanBakuPageShell } from "../../components/bahan-baku/page-shell";
import { SchedulePageHeading } from "../../components/jadwal-produksi/page-heading";

const actions = [
  {
    title: "Tambah Jadwal Produksi",
    description:
      "Buat jadwal produksi baru dengan produk, target jumlah, tanggal, dan waktu produksi.",
    icon: "/images/bahan-baku/icon-plus.svg",
    href: "/jadwal-produksi/tambah",
  },
  {
    title: "Lihat Jadwal Produksi",
    description:
      "Lihat rincian jadwal, produk yang dikerjakan, target produksi, dan status pelaksanaan.",
    icon: "/images/bahan-baku/icon-eye.svg",
    href: "/jadwal-produksi/lihat",
  },
  {
    title: "Update Jadwal Produksi",
    description:
      "Pilih jadwal dari daftar untuk memperbarui waktu, target, atau status produksi.",
    icon: "/images/bahan-baku/icon-edit.svg",
    href: "/jadwal-produksi/update",
  },
  {
    title: "Hapus Jadwal Produksi",
    description:
      "Pilih jadwal produksi yang dibatalkan atau tidak digunakan sebelum menghapusnya.",
    icon: "/images/bahan-baku/icon-trash.svg",
    href: "/jadwal-produksi/hapus",
  },
];

export default function MenuJadwalProduksiPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal Produksi / Menu CRUD"
      activeSection="jadwal-produksi"
      backgroundImage="/images/jadwal-produksi/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <SchedulePageHeading
          title="Menu Jadwal Produksi"
          description="Pilih tindakan untuk mengelola rencana dan jadwal kegiatan produksi."
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
