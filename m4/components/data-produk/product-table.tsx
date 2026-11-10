import Image from "next/image";
import Link from "next/link";
import type { AdminProduct } from "./data";

type ProductTableProps = {
  mode: "view" | "update" | "delete";
  products: AdminProduct[];
};

export function ProductTable({ mode, products }: ProductTableProps) {
  const actionLabel =
    mode === "view" ? "Detail" : mode === "update" ? "Edit" : "Hapus";

  return (
    <section className="relative z-10 mt-7 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.82)]">
      <div className="overflow-x-auto">
        <div className="min-w-[940px]">
          <div className="flex h-[56px] items-center gap-4 bg-[#eef5fa] px-6 text-[14px] font-bold text-[#17263b]">
            <span className="w-[90px]">Kode</span>
            <span className="w-[190px]">Nama Produk</span>
            <span className="w-[125px]">Varian</span>
            <span className="w-[80px]">Stok</span>
            <span className="w-[245px]">Resep Produk</span>
            <span className="w-[100px]">Aksi</span>
          </div>

          {products.length ? (
            products.map((product) => (
              <div
                key={product.code}
                className="flex min-h-[68px] items-center gap-4 border-t border-[#d6e3ed] px-6 py-3 text-[15px] text-[#17263b]"
              >
                <span className="w-[90px] shrink-0">{product.code}</span>
                <span className="w-[190px] shrink-0 font-bold">
                  {product.name}
                </span>
                <span className="w-[125px] shrink-0">{product.variation}</span>
                <span className="w-[80px] shrink-0">
                  {product.stock.toLocaleString("id-ID")}
                </span>
                <span className="w-[245px] shrink-0 truncate" title={product.recipe}>
                  {product.recipe}
                </span>
                <span className="w-[100px] shrink-0">
                  {mode === "delete" ? (
                    <Link
                      href={`/data-produk/hapus/konfirmasi/${encodeURIComponent(product.code)}`}
                      aria-label={`Hapus ${product.name}`}
                      className="inline-flex h-11 w-[52px] items-center justify-center rounded-[9px] bg-[#b82926]/85 transition-colors hover:bg-[#9d201e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926]"
                    >
                      <Image
                        src="/images/bahan-baku/icon-trash.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="brightness-0 invert"
                      />
                    </Link>
                  ) : (
                    <Link
                      href={
                        mode === "update"
                          ? `/data-produk/update/${encodeURIComponent(product.code)}`
                          : `/data-produk/lihat/${encodeURIComponent(product.code)}`
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] border border-[#d6e3ed] bg-white/50 px-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
                    >
                      {mode === "update" ? (
                        <Image
                          src="/images/bahan-baku/icon-edit.svg"
                          alt=""
                          width={16}
                          height={16}
                        />
                      ) : null}
                      {actionLabel}
                    </Link>
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="border-t border-[#d6e3ed] px-6 py-8 text-center text-[15px] text-[#61738a]">
              Belum ada data produk.
            </p>
          )}

          <div className="flex h-[62px] items-center justify-between border-t border-[#d6e3ed] px-6 text-[14px] text-[#61738a]">
            <p>Menampilkan {products.length} produk</p>
            <p className="text-[#0a3d62]">Data Produk Admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}
