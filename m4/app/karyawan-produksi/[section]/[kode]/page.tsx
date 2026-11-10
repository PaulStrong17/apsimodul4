import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getProductionReference,
  getProductionRow,
  isProductionReferenceSection,
  isProductionSection,
} from "../../../../components/karyawan-produksi/data";
import {
  ProductionHeading,
  ProductionShell,
} from "../../../../components/karyawan-produksi/production-shell";
import { ProductionDetails } from "../../../../components/karyawan-produksi/production-pages";

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

  const data = getProductionReference(section);
  const row = getProductionRow(section, kode);
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
