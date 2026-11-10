import Link from "next/link";
import type { AdminBahanBaku } from "./data";

function DetailValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-[14px] text-[#61738a] md:text-[16px]">{label}</p>
      <p className="text-[16px] font-bold text-[#17263b] md:text-[18px]">
        {value}
      </p>
    </div>
  );
}

export function BahanBakuDetail({
  material,
}: {
  material: AdminBahanBaku;
}) {
  return (
    <div className="relative z-10 flex w-full flex-col gap-6">
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
          Detail Bahan Baku
        </h1>
        <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
          Informasi bahan baku hanya untuk dilihat dan tidak dapat diubah pada
          halaman ini.
        </p>
      </div>

      <section className="flex w-full max-w-[900px] flex-col gap-7 rounded-[30px] border border-[#d6e3ed] bg-white p-5 md:rounded-[67px] md:p-6">
        <div>
          <h2 className="text-[21px] font-bold text-[#17263b] md:text-[24px]">
            {material.name}
          </h2>
          <p className="mt-[6px] text-[15px] text-[#61738a] md:text-[17px]">
            {material.code}
          </p>
        </div>

        <div className="h-px w-full bg-[#d6e3ed]" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <DetailValue label="Satuan" value={material.unit} />
          <DetailValue
            label="Stok"
            value={`${material.stock} ${material.unit}`}
          />
          <DetailValue
            label="Stok Minimum"
            value={`${material.minimumStock} ${material.unit}`}
          />
        </div>

        <Link
          href="/menu-bahan-baku"
          className="inline-flex h-11 w-fit items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] text-[15px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:text-[17px]"
        >
          Kembali
        </Link>
      </section>
    </div>
  );
}
