import Image from "next/image";
import Link from "next/link";
import { products, formatProductPrice } from "./data";

type ProductTableProps = {
  mode: "update" | "delete";
};

export function ProductTable({ mode }: ProductTableProps) {
  const isUpdate = mode === "update";

  return (
    <section className="relative z-10 mt-7 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-[rgba(255,255,255,0.82)]">
      <div className="overflow-x-auto">
        <div className="min-w-[1020px]">
          <div className="flex h-[56px] items-center gap-4 bg-[#eef5fa] px-6 text-[14px] font-bold text-[#17263b]">
            <span className="w-[110px]">Kode Produk</span>
            <span className="w-[270px]">Nama Produk</span>
            <span className="w-[150px]">Variasi</span>
            <span className="w-[90px]">Stok</span>
            <span className="w-[130px]">Harga</span>
            <span className="w-[100px]">Aksi</span>
          </div>

          {products.map((product) => (
            <div
              key={product.code}
              className="flex h-[68px] items-center gap-4 border-t border-[#d6e3ed] px-6 text-[15px] text-[#17263b]"
            >
              <span className="w-[110px] shrink-0">{product.code}</span>
              <span className="w-[270px] shrink-0 font-bold">
                {product.name}
              </span>
              <span className="w-[150px] shrink-0">{product.variation}</span>
              <span className="w-[90px] shrink-0">{product.stock}</span>
              <span className="w-[130px] shrink-0">
                {formatProductPrice(product.price)}
              </span>
              <span className="w-[100px] shrink-0">
                {isUpdate ? (
                  <Link
                    href={`/data-produk/update/${product.code}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[9px] border border-[#d6e3ed] bg-white/50 px-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
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
                    href={`/data-produk/hapus/konfirmasi/${product.code}`}
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
                )}
              </span>
            </div>
          ))}

          <div className="flex h-[62px] items-center justify-between border-t border-[#d6e3ed] px-6 text-[14px] text-[#61738a]">
            <p>Menampilkan 1–5 dari 5 produk</p>
            <p className="text-[#0a3d62]">Halaman 1 dari 1</p>
          </div>
        </div>
      </div>
    </section>
  );
}
