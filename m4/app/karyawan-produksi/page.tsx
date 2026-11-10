import { notFound } from "next/navigation";
import {
  ProductionHeading,
  ProductionShell,
} from "../../components/karyawan-produksi/production-shell";
import { ProductionTable } from "../../components/karyawan-produksi/production-pages";
import { requireKaryawanProduksiPage } from "../../lib/karyawan-produksi/authorization";
import { getProductionReferenceData } from "../../lib/karyawan-produksi/reference";

export const instant = false;

export default async function KaryawanProduksiHomePage() {
  const karyawan = await requireKaryawanProduksiPage();
  const data = await getProductionReferenceData(
    "jadwal-produksi",
    karyawan.id_karyawanproduksi,
  );
  if (!data) notFound();

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
