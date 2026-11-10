import { Suspense } from "react";
import { notFound } from "next/navigation";
import { OwnerReadOnlyDetail } from "../../../../components/owner/read-only";
import { OwnerShell, type OwnerSection } from "../../../../components/owner/owner-shell";
import { requireOwnerPage } from "../../../../lib/owner/authorization";
import { getOwnerReadOnlyDetail } from "../../../../lib/owner/read-only";

type PageProps = {
  params: Promise<{ section: string; kode: string }>;
};

const sectionInfo: Record<
  string,
  { activeSection: OwnerSection; backgroundImage: string; title: string }
> = {
  "bahan-baku": {
    activeSection: "bahan-baku",
    backgroundImage: "/images/owner/background-bahan-baku.jpg",
    title: "Bahan Baku",
  },
  "data-produk": {
    activeSection: "data-produk",
    backgroundImage: "/images/owner/background-produk.jpg",
    title: "Produk",
  },
  "jadwal-produksi": {
    activeSection: "jadwal-produksi",
    backgroundImage: "/images/owner/background-jadwal-produksi.jpg",
    title: "Jadwal Produksi",
  },
  "jadwal-qc": {
    activeSection: "jadwal-qc",
    backgroundImage: "/images/owner/background-jadwal-qc.jpg",
    title: "Jadwal QC",
  },
};

export default function OwnerReadOnlyDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-[#f6f9fc]" aria-busy="true" />}>
      <OwnerReadOnlyDetailContent params={params} />
    </Suspense>
  );
}

async function OwnerReadOnlyDetailContent({ params }: PageProps) {
  const { section, kode } = await params;
  const info = sectionInfo[section];

  if (!info) notFound();

  const owner = await requireOwnerPage();
  const detail = await getOwnerReadOnlyDetail(section, kode, owner.id_owner);
  if (!detail) notFound();

  return (
    <OwnerShell
      activeSection={info.activeSection}
      breadcrumb={`${info.title} / Lihat Detail / ${kode}`}
      backgroundImage={info.backgroundImage}
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerReadOnlyDetail
          title={detail.title}
          code={detail.code}
          fields={detail.fields}
          backHref={`/owner/${section}`}
          description={`Informasi ${info.title.toLowerCase()} hanya untuk dilihat dan tidak dapat diubah pada halaman ini.`}
        />
      </div>
    </OwnerShell>
  );
}
