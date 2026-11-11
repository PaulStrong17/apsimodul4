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
  const recipes = material.recipes ?? [];
  const receipts = material.receipts ?? [];

  return (
    <div className="relative z-10 flex w-full flex-col gap-6">
      <div className="flex flex-col gap-[6px]">
        <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
          Detail Bahan Baku
        </h1>
        <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
          Informasi bahan baku beserta resep acuan, supplier, dan riwayat penerimaan sesuai ERD.
        </p>
      </div>

      <section className="flex w-full max-w-[960px] flex-col gap-7 rounded-[24px] border border-[#d6e3ed] bg-white p-5 md:rounded-[36px] md:p-7">
        <div>
          <h2 className="text-[21px] font-bold text-[#17263b] md:text-[24px]">
            {material.name}
          </h2>
          <p className="mt-[6px] text-[15px] text-[#61738a] md:text-[17px]">
            Kode Bahan Baku: <span className="font-semibold text-[#0a3d62]">{material.code}</span>
          </p>
        </div>

        <div className="h-px w-full bg-[#d6e3ed]" />

        {/* Ringkasan Stok & Satuan */}
        <div>
          <h3 className="mb-4 text-[17px] font-bold text-[#17263b]">
            Spesifikasi & Stok
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <DetailValue label="Satuan" value={material.unit} />
            <DetailValue
              label="Stok Saat Ini"
              value={`${material.stock} ${material.unit}`}
            />
            <DetailValue
              label="Batas Minimum Stok"
              value={`${material.minimumStock} ${material.unit}`}
            />
          </div>
        </div>

        <div className="h-px w-full bg-[#d6e3ed]" />

        {/* Bagian Resep Produk (Detail_Resep & Resep) */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-[#17263b]">
              Resep & Produk Terkait
            </h3>
            <span className="text-[13px] text-[#61738a]">
              Tabel Relasi: Detail_Resep &amp; Resep
            </span>
          </div>

          {recipes.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-[10px] border border-[#d6e3ed]">
              <table className="w-full min-w-[500px] border-collapse text-left text-[14px] text-[#17263b]">
                <thead className="bg-[#f6f9fc] font-bold">
                  <tr>
                    <th className="px-4 py-3">Kode Resep</th>
                    <th className="px-4 py-3">Nama Produk</th>
                    <th className="px-4 py-3">Varian</th>
                    <th className="px-4 py-3">Deskripsi Resep</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((r) => (
                    <tr key={r.recipeCode} className="border-t border-[#d6e3ed]">
                      <td className="px-4 py-3 font-semibold text-[#0a3d62]">
                        {r.recipeCode}
                      </td>
                      <td className="px-4 py-3 font-bold">{r.productName}</td>
                      <td className="px-4 py-3">{r.productVariant}</td>
                      <td className="px-4 py-3 text-[#61738a]">{r.recipeDesc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 rounded-[8px] bg-[#f6f9fc] p-3 text-[14px] text-[#61738a]">
              Belum ada resep produk yang terhubung dengan bahan baku ini.
            </p>
          )}
        </div>

        <div className="h-px w-full bg-[#d6e3ed]" />

        {/* Bagian Supplier & Tanggal Penerimaan (Penerimaan_Bahan_Baku & Jenis_Supplier) */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-[#17263b]">
              Riwayat Penerimaan &amp; Data Supplier
            </h3>
            <span className="text-[13px] text-[#61738a]">
              Tabel Relasi: Penerimaan_Bahan_Baku &amp; Jenis_Supplier
            </span>
          </div>

          {receipts.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-[10px] border border-[#d6e3ed]">
              <table className="w-full min-w-[640px] border-collapse text-left text-[14px] text-[#17263b]">
                <thead className="bg-[#f6f9fc] font-bold">
                  <tr>
                    <th className="px-4 py-3">Kode Terima</th>
                    <th className="px-4 py-3">Tanggal Penerimaan</th>
                    <th className="px-4 py-3">Jumlah Diterima</th>
                    <th className="px-4 py-3">Nama Supplier</th>
                    <th className="px-4 py-3">Jenis Supplier</th>
                    <th className="px-4 py-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((pb) => (
                    <tr key={pb.id} className="border-t border-[#d6e3ed]">
                      <td className="px-4 py-3 font-semibold text-[#0a3d62]">{pb.id}</td>
                      <td className="px-4 py-3">{pb.receiptDate}</td>
                      <td className="px-4 py-3 font-bold">
                        {pb.amount} {material.unit}
                      </td>
                      <td className="px-4 py-3 font-semibold">{pb.supplierName}</td>
                      <td className="px-4 py-3">{pb.supplierType}</td>
                      <td className="px-4 py-3 text-[#61738a]">{pb.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 rounded-[8px] bg-[#f6f9fc] p-3 text-[14px] text-[#61738a]">
              Belum ada riwayat penerimaan untuk bahan baku ini.
            </p>
          )}
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
