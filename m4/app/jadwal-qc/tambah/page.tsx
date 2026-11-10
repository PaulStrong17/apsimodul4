import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { QualityForm } from "../../../components/jadwal-qc/quality-form";
import { QualityPageHeading } from "../../../components/jadwal-qc/page-heading";

export default function TambahJadwalQcPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Jadwal QC / Tambah"
      activeSection="jadwal-qc"
      backgroundImage="/images/jadwal-qc/background.jpeg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <QualityPageHeading
          title="Tambah Jadwal QC"
          description="Isi informasi jadwal pemeriksaan QC baru sebelum menyimpan data."
        />
        <div className="mt-7 md:mt-[clamp(28px,3.2vw,46px)]">
          <QualityForm mode="create" />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
