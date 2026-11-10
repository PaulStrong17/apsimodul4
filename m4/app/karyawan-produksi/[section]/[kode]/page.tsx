import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  isProductionReferenceSection,
  isProductionSection,
} from "../../../../components/karyawan-produksi/data";
import {
  ProductionHeading,
  ProductionShell,
} from "../../../../components/karyawan-produksi/production-shell";
import { ProductionDetails } from "../../../../components/karyawan-produksi/production-pages";
import { requireKaryawanProduksiPage } from "../../../../lib/karyawan-produksi/authorization";
import {
  getProductionReferenceData,
  getProductionRowData,
} from "../../../../lib/karyawan-produksi/reference";

export const instant = false;

type PageProps = {
  params: Promise<{ section: string; kode: string }>;
};

export default function KaryawanProduksiDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanProduksiDetailContent params={params} />
    </Suspense>
  );
}

async function KaryawanProduksiDetailContent({ params }: PageProps) {
  const { section, kode } = await params;
  if (!isProductionSection(section) || !isProductionReferenceSection(section)) {
    notFound();
  }

  const karyawan = await requireKaryawanProduksiPage();
  const [data, row] = await Promise.all([
    getProductionReferenceData(section, karyawan.id_karyawanproduksi),
    getProductionRowData(section, kode, karyawan.id_karyawanproduksi),
  ]);
  if (!data || !row) notFound();

  return (
    <ProductionShell
      activeSection={section}
      breadcrumb={`${data.title} / Detail / ${row.code}`}
      backgroundImage={data.backgroundImage}
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ProductionHeading
          title={`Detail ${data.title.replace("Daftar ", "")}`}
          description="Informasi ditampilkan hanya untuk dilihat dan tidak dapat diubah pada halaman ini."
        />
        <ProductionDetails section={section} row={row} />
      </div>
    </ProductionShell>
  );
}
