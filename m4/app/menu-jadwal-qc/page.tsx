import { ActionCard } from "../../components/ui/action-card";
import { BahanBakuPageShell } from "../../components/bahan-baku/page-shell";
import { QualityPageHeading } from "../../components/jadwal-qc/page-heading";

const actions = [
  {
    title: "Tambah Jadwal QC",
    description:
      "Buat jadwal pemeriksaan mutu dengan produk, tanggal pemeriksaan, dan petugas QC.",
    icon: "/images/bahan-baku/icon-plus.svg",
    href: "/jadwal-qc/tambah",
  },
  {
    title: "Lihat Jadwal QC",
    description:
      "Lihat detail pemeriksaan, waktu pelaksanaan, petugas QC, dan status jadwal.",
    icon: "/images/bahan-baku/icon-eye.svg",
    href: "/jadwal-qc/lihat",
  },
  {
    title: "Update Jadwal QC",
    description:
      "Pilih jadwal QC untuk mengubah waktu pemeriksaan, petugas, atau status pelaksanaan.",
    icon: "/images/bahan-baku/icon-edit.svg",
    href: "/jadwal-qc/update",
  },
  {
    title: "Hapus Jadwal QC",
    description:
      "Pilih jadwal pemeriksaan mutu yang tidak digunakan sebelum menghapus datanya.",
    icon: "/images/bahan-baku/icon-trash.svg",
    href: "/jadwal-qc/hapus",
  },
];

export default function MenuJadwalQcPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal QC / Menu CRUD"
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Menu Jadwal QC"
          description="Pilih tindakan untuk mengelola jadwal pemeriksaan mutu produk."
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
