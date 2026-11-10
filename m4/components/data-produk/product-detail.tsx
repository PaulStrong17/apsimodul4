import Link from "next/link";
import type { Product } from "./data";
import { formatProductPrice } from "./data";

export function ProductDetail({ product }: { product: Product }) {
  const details = [
    ["ID Produk", product.code],
    ["Nama Produk", product.name],
    ["Variasi", product.variation],
    ["Stok Produk", String(product.stock)],
    ["Harga Produk", formatProductPrice(product.price)],
    ["Deskripsi Produk", product.description],
  ];

  return (
    <div className="w-full max-w-[790px] rounded-[14px] border border-[#d6e3ed] bg-white p-5 md:min-h-[450px] md:p-6">
      <h2 className="mb-3 text-[18px] font-bold text-[#17263b]">
        Informasi Produk
      </h2>
      <dl>
        {details.map(([label, value]) => (
          <div
            key={label}
            className="grid min-h-[53px] grid-cols-1 items-center border-b border-[#d6e3ed] py-3 last:border-b-0 md:grid-cols-[210px_1fr]"
          >
            <dt className="text-[14px] text-[#61738a] md:text-[16px]">
              {label}
            </dt>
            <dd className="break-words text-[15px] font-bold text-[#17263b] md:text-[16px]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/data-produk/update/${product.code}`}
          className="inline-flex h-[46px] items-center justify-center rounded-[9px] bg-[#0a3d62] px-[18px] text-[16px] font-semibold text-white transition-colors hover:bg-[#083451] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
        >
          Perbarui
        </Link>
        <Link
          href="/menu-data-produk"
          className="inline-flex h-[46px] items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] text-[16px] font-semibold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
