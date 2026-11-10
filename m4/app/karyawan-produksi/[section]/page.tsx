import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getProductionReference,
  isProductionSection,
  isProductionReferenceSection,
} from "../../../components/karyawan-produksi/data";
import {
  ProductionHeading,
  ProductionShell,
} from "../../../components/karyawan-produksi/production-shell";
import {
  ProductionInputForm,
  ProductionTable,
} from "../../../components/karyawan-produksi/production-pages";

type PageProps = {
  params: Promise<{ section: string }>;
};

export default function KaryawanProduksiSectionPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <KaryawanProduksiSectionContent params={params} />
    </Suspense>
  );
}

async function KaryawanProduksiSectionContent({ params }: PageProps) {
  const { section } = await params;
  if (!isProductionSection(section)) notFound();

  if (section === "input-progress-produk" || section === "input-hasil-produksi") {
    const progressMode = section === "input-progress-produk";
    return (
      <ProductionShell
        activeSection={section}
        breadcrumb={progressMode ? "Progress Produk / Input" : "Hasil Produksi / Input"}
        backgroundImage="/images/karyawan-qc/background-hasil-qc.jpg"
      >
        <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
          <ProductionHeading
            title={progressMode ? "Input Data Progress Produk" : "Input Data Hasil Produksi"}
            description={
              progressMode
                ? "Perbarui progress pelaksanaan sesuai jadwal produksi."
                : "Catat hasil produksi berdasarkan jadwal yang telah dikerjakan."
            }
          />
          <ProductionInputForm mode={progressMode ? "progress" : "result"} />
        </div>
      </ProductionShell>
    );
  }

  if (!isProductionReferenceSection(section)) notFound();
  const data = getProductionReference(section);
  if (!data) notFound();

  return (
    <ProductionShell
      activeSection={section}
      breadcrumb={`${data.title} / Daftar`}
      backgroundImage={data.backgroundImage}
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <ProductionHeading title={data.title} description={data.description} />
        <ProductionTable section={section} data={data} />
      </div>
    </ProductionShell>
  );
}
