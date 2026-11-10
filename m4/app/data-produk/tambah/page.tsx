import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { ProductForm } from "../../../components/data-produk/product-form";

export default function TambahProdukPage() {
  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Data Produk / Tambah Produk"
    >
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="mb-6 flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Tambah Data Produk
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[16px]">
            Isi data produk sesuai kolom yang tersedia di database.
          </p>
        </div>
        <ProductForm mode="add" />
      </div>
    </BahanBakuPageShell>
  );
}
