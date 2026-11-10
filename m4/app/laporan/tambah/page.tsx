import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { ReportForm } from "../../../components/laporan/report-form";
import { ReportPageHeading } from "../../../components/laporan/page-heading";

export default function TambahLaporanPage() {
  return (
    <BahanBakuPageShell
      breadcrumb="Admin / Laporan / Tambah"
      activeSection="laporan"
      backgroundImage="/images/laporan/background.png"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ReportPageHeading
          title="Tambah Laporan"
          description="Isi informasi laporan baru sebelum menyimpan data."
        />
        <div className="mt-7 md:mt-[clamp(28px,3.2vw,46px)]">
          <ReportForm mode="create" />
        </div>
      </div>
    </BahanBakuPageShell>
  );
}
