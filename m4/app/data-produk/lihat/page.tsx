import { BahanBakuPageShell } from "../../../components/bahan-baku/page-shell";
import { ProductTable } from "../../../components/data-produk/product-table";
import { listAdminProducts } from "../../../lib/admin/products";
import { requireAdminPage } from "../../../lib/admin/authorization";

export const instant = false;

export default async function LihatProdukListPage() {
  const admin = await requireAdminPage();
  const products = await listAdminProducts(admin.id_admin);

  return (
    <BahanBakuPageShell
      activeSection="data-produk"
      backgroundImage="/images/data-produk/background.png"
      breadcrumb="Admin / Data Produk / Daftar"
    >
      <div className="relative z-10 flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <div className="flex flex-col gap-[6px]">
          <h1 className="text-[24px] font-bold leading-[1.35] text-[#17263b] md:text-[28px]">
            Daftar Data Produk
          </h1>
          <p className="text-[14px] leading-[1.5] text-[#61738a] md:text-[16px]">
            Data produk yang dikelola oleh akun Admin ini.
          </p>
        </div>
        <ProductTable mode="view" products={products} />
      </div>
    </BahanBakuPageShell>
  );
}
