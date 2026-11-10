import Image from "next/image";
import Link from "next/link";
import { bahanBakuData, formatRupiah } from "./data";

type BahanBakuDataTableProps = {
  action: "edit" | "delete";
};

export function BahanBakuDataTable({ action }: BahanBakuDataTableProps) {
  const isEdit = action === "edit";

  return (
    <section className="relative z-10 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <h2 className="px-4 py-[18px] text-[18px] font-bold text-[#17263b] md:px-6 md:text-[20px]">
        Data Bahan Baku
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-[13px] text-[#17263b] md:text-[16px]">
          <thead className="h-[48px] bg-[#f6f9fc] font-bold">
            <tr>
              <th className="w-[100px] px-4">Kode</th>
              <th>Nama Bahan Baku</th>
              <th className="w-[70px]">Satuan</th>
              <th className="w-[80px]">Stok</th>
              <th className="w-[110px]">
                Stok
                <br />
                Minimum
              </th>
              <th className="w-[130px]">Harga Satuan</th>
              <th className="w-[110px]">{isEdit ? "Aksi" : "Hapus"}</th>
            </tr>
          </thead>
          <tbody>
            {bahanBakuData.map((material) => (
              <tr
                key={material.code}
                className="h-[clamp(48px,4.72vw,68px)] border-t border-[#d6e3ed]"
              >
                <td className="px-4 text-[#61738a]">{material.code}</td>
                <td className="font-bold">{material.name}</td>
                <td>{material.unit}</td>
                <td>{material.stock}</td>
                <td>{material.minimumStock}</td>
                <td className="whitespace-nowrap">
                  {formatRupiah(material.price)}
                </td>
                <td>
                  {isEdit ? (
                    <Link
                      href={`/bahan-baku/update/${material.code}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6e3ed] bg-white px-3 font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:h-11 md:px-[14px]"
                    >
                      <Image
                        src="/images/bahan-baku/icon-edit.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                      Edit
                    </Link>
                  ) : (
                    <Link
                      href={`/bahan-baku/hapus/konfirmasi/${material.code}`}
                      aria-label={`Hapus ${material.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#c94b4b] transition-colors hover:bg-[#b82926] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926] md:h-11 md:w-11"
                    >
                      <Image
                        src="/images/bahan-baku/icon-trash.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="brightness-0 invert"
                      />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#d6e3ed] px-4 py-[14px] text-[13px] text-[#61738a] md:px-6 md:text-[15px]">
        <p>Menampilkan 1–6 dari 6 bahan baku</p>
        <p className="font-medium text-[#0a3d62]">Halaman 1 dari 1</p>
      </div>
    </section>
  );
}
