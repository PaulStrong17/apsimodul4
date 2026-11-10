import Image from "next/image";
import Link from "next/link";
import type { BahanBaku } from "../bahan-baku/data";
import type { Product } from "../data-produk/data";
import type { ProductionSchedule } from "../jadwal-produksi/data";
import type { QualitySchedule } from "../jadwal-qc/data";
import { formatProductPrice } from "../data-produk/data";
import {
  formatProductionDate,
  getProductRequestLabel,
} from "../jadwal-produksi/data";
import {
  formatInspectionDate,
  getProductionScheduleLabel,
} from "../jadwal-qc/data";

type ReadOnlyRow =
  | BahanBaku
  | Product
  | ProductionSchedule
  | QualitySchedule;

export function OwnerReadOnlyTable({
  kind,
  rows,
}: {
  kind: "bahan-baku" | "data-produk" | "jadwal-produksi" | "jadwal-qc";
  rows: ReadOnlyRow[];
}) {
  const definitions = {
    "bahan-baku": {
      title: "Data Bahan Baku",
      columns: ["Kode", "Nama Bahan Baku", "Satuan", "Stok", "Stok Minimum"],
      getValues: (row: ReadOnlyRow) => {
        const material = row as BahanBaku;
        return [
          material.code,
          material.name,
          material.unit,
          material.stock,
          material.minimumStock,
        ];
      },
    },
    "data-produk": {
      title: "Data Produk",
      columns: ["Kode", "Nama Produk", "Variasi", "Stok", "Harga"],
      getValues: (row: ReadOnlyRow) => {
        const product = row as Product;
        return [
          product.code,
          product.name,
          product.variation,
          product.stock,
          formatProductPrice(product.price),
        ];
      },
    },
    "jadwal-produksi": {
      title: "Data Jadwal Produksi",
      columns: ["Kode", "Tanggal Produksi", "Permintaan Produk", "Target", "Karyawan Produksi", "Status Jadwal"],
      getValues: (row: ReadOnlyRow) => {
        const schedule = row as ProductionSchedule;
        return [
          schedule.code,
          formatProductionDate(schedule.productionDate),
          getProductRequestLabel(schedule),
          `${schedule.target} pcs`,
          schedule.productionEmployee,
          schedule.status,
        ];
      },
    },
    "jadwal-qc": {
      title: "Data Jadwal QC",
      columns: ["Kode", "Tanggal", "Jenis Pemeriksaan", "Jadwal Produksi", "Karyawan QC", "Status Pemeriksaan"],
      getValues: (row: ReadOnlyRow) => {
        const schedule = row as QualitySchedule;
        return [
          schedule.code,
          formatInspectionDate(schedule.inspectionDate),
          schedule.code === "JQ-001" ? "Pemeriksaan Produk" : schedule.type,
          getProductionScheduleLabel(schedule),
          schedule.qualityControlEmployee,
          schedule.status,
        ];
      },
    },
  } as const;

  const definition = definitions[kind];
  const detailHref = (code: string) => `/owner/${kind}/${code}`;

  return (
    <section className="relative z-10 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <h2 className="px-4 py-[18px] text-[18px] font-bold text-[#17263b] md:px-6 md:text-[20px]">
        {definition.title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[790px] border-collapse text-left text-[13px] text-[#17263b] md:text-[15px]">
          <thead className="h-[48px] bg-[#f6f9fc] font-bold">
            <tr>
              {definition.columns.map((column) => (
                <th key={column} scope="col" className="px-4">
                  {column}
                </th>
              ))}
              <th scope="col" className="px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const values = definition.getValues(row);
              const code = row.code;

              return (
                <tr
                  key={code}
                  className="h-[clamp(48px,4.72vw,68px)] border-t border-[#d6e3ed]"
                >
                  {values.map((value, index) => (
                    <td
                      key={`${code}-${index}`}
                      className={`px-4 py-3 ${
                        index === 0
                          ? "whitespace-nowrap text-[#61738a]"
                          : index === 1
                            ? "font-bold"
                            : ""
                      }`}
                    >
                      {value}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Link
                      href={detailHref(code)}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6e3ed] bg-white px-3 font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:h-11 md:px-[14px]"
                    >
                      <Image
                        src="/images/bahan-baku/icon-eye.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                      Lihat
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#d6e3ed] px-4 py-[14px] text-[13px] text-[#61738a] md:px-6 md:text-[15px]">
        <p>Menampilkan 1–{rows.length} dari {rows.length} {kind === "bahan-baku" ? "bahan baku" : kind === "data-produk" ? "produk" : "jadwal"}</p>
        <p className="font-medium text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}

type DetailField = {
  label: string;
  value: string;
};

export function OwnerReadOnlyDetail({
  title,
  code,
  fields,
  backHref,
  description,
}: {
  title: string;
  code: string;
  fields: DetailField[];
  backHref: string;
  description: string;
}) {
  return (
    <div className="relative z-10 flex w-full flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
          Detail {title}
        </h1>
        <p className="mt-1 text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
          {description}
        </p>
      </div>
      <section className="w-full max-w-[900px] rounded-[26px] border border-[#d6e3ed] bg-white p-5 md:rounded-[32px] md:p-6">
        <div>
          <h2 className="text-[21px] font-bold text-[#17263b] md:text-[24px]">
            {title}
          </h2>
          <p className="mt-[6px] text-[15px] text-[#61738a] md:text-[17px]">
            {code}
          </p>
        </div>
        <div className="my-5 h-px w-full bg-[#d6e3ed]" />
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="flex min-w-0 flex-col gap-1">
              <dt className="text-[13px] text-[#61738a] md:text-[15px]">
                {field.label}
              </dt>
              <dd className="text-[14px] font-bold text-[#17263b] md:text-[17px]">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
        <Link
          href={backHref}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] text-[15px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:text-[17px]"
        >
          Kembali
        </Link>
      </section>
    </div>
  );
}

export function ownerMaterialDetailFields(material: BahanBaku): DetailField[] {
  return [
    { label: "Satuan", value: material.unit },
    { label: "Stok", value: `${material.stock} ${material.unit}` },
    {
      label: "Stok Minimum",
      value: `${material.minimumStock} ${material.unit}`,
    },
    { label: "Dikelola Oleh", value: "Admin" },
  ];
}
