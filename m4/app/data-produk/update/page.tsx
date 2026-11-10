import Link from "next/link";
import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { ProductTable } from "../../../components/data-produk/product-table";

export default function UpdateProdukPage() {
  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Data Produk / Update Produk"
    >
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Update Data Produk
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[16px]">
            Pilih produk yang ingin diperbarui dari daftar berikut.
          </p>
        </div>
        <ProductTable mode="update" />
        <Link
          href="/menu-data-produk"
          className="mt-5 inline-flex h-11 w-fit items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white/90 px-[18px] text-[15px] font-bold text-[#0a3d62] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:text-[17px]"
        >
          Kembali ke Menu Data Produk
        </Link>
      </div>
    </BahanBakuPageShell>
  );
}
