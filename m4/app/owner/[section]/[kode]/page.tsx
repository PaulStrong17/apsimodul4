import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getOwnerMaterial,
  getOwnerProduct,
  getOwnerProductionSchedule,
  getOwnerQualitySchedule,
  formatOwnerDate,
} from "../../../../components/owner/data";
import {
  OwnerReadOnlyDetail,
  ownerMaterialDetailFields,
} from "../../../../components/owner/read-only";
import { formatProductPrice } from "../../../../components/data-produk/data";
import {
  formatProductionDate,
  getProductRequestLabel,
} from "../../../../components/jadwal-produksi/data";
import { getProductionScheduleLabel } from "../../../../components/jadwal-qc/data";
import { OwnerShell, type OwnerSection } from "../../../../components/owner/owner-shell";

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

  const detail = getDetail(section, kode);
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

function getDetail(section: string, code: string) {
  if (section === "bahan-baku") {
    const material = getOwnerMaterial(code);
    return material
      ? {
          title: material.name,
          code: material.code,
          fields: ownerMaterialDetailFields(material),
        }
      : undefined;
  }

  if (section === "data-produk") {
    const product = getOwnerProduct(code);
    return product
      ? {
          title: product.name,
          code: product.code,
          fields: [
            { label: "Variasi", value: product.variation },
            { label: "Stok Produk", value: `${product.stock} pcs` },
            { label: "Harga Produk", value: formatProductPrice(product.price) },
            { label: "Resep Produk", value: `Resep ${product.name}` },
            { label: "Deskripsi Produk", value: product.description },
          ],
        }
      : undefined;
  }

  if (section === "jadwal-produksi") {
    const schedule = getOwnerProductionSchedule(code);
    return schedule
      ? {
          title: `Produksi ${schedule.productName}`,
          code: schedule.code,
          fields: [
            {
              label: "Tanggal Produksi",
              value: formatProductionDate(schedule.productionDate),
            },
            { label: "Jumlah Target", value: `${schedule.target} pcs` },
            {
              label: "Permintaan Produk",
              value: getProductRequestLabel(schedule),
            },
            { label: "Status Jadwal", value: schedule.status },
            {
              label: "Karyawan Produksi",
              value: schedule.productionEmployee,
            },
            { label: "Karyawan QC", value: schedule.qualityControlEmployee },
            {
              label: "Status Verifikasi",
              value:
                schedule.verificationStatus === "Terverifikasi"
                  ? "Terverifikasi"
                  : "Belum Terverifikasi",
            },
            { label: "Owner Penanggung Jawab", value: schedule.owner },
          ],
        }
      : undefined;
  }

  if (section === "jadwal-qc") {
    const schedule = getOwnerQualitySchedule(code);
    return schedule
      ? {
          title:
            schedule.code === "JQ-001" ? "Pemeriksaan Produk" : schedule.type,
          code: schedule.code,
          fields: [
            {
              label: "Tanggal Pemeriksaan",
              value: formatOwnerDate(schedule.inspectionDate, "long"),
            },
            {
              label: "Jadwal Produksi",
              value: getProductionScheduleLabel(schedule),
            },
            { label: "Karyawan QC", value: schedule.qualityControlEmployee },
            {
              label: "Karyawan Produksi",
              value: schedule.productionEmployee,
            },
            { label: "Status Pemeriksaan", value: schedule.status },
            {
              label: "Status Verifikasi",
              value:
                schedule.verificationStatus === "Terverifikasi"
                  ? "Terverifikasi"
                  : "Belum Terverifikasi",
            },
            { label: "Owner Penanggung Jawab", value: schedule.owner },
            { label: "Dicatat oleh", value: schedule.createdBy },
          ],
        }
      : undefined;
  }

  return undefined;
}
