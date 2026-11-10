import { productionReferences } from "../../components/karyawan-produksi/data";
import {
  ProductionHeading,
  ProductionShell,
} from "../../components/karyawan-produksi/production-shell";
import { ProductionTable } from "../../components/karyawan-produksi/production-pages";

export default function KaryawanProduksiHomePage() {
  const data = productionReferences["jadwal-produksi"];

  return (
    <ProductionShell
      activeSection="jadwal-produksi"
      breadcrumb="Jadwal Produksi / Daftar"
      backgroundImage={data.backgroundImage}
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ProductionHeading title={data.title} description={data.description} />
        <ProductionTable section="jadwal-produksi" data={data} />
      </div>
    </ProductionShell>
  );
}
