import { ownerProducts } from "../../../components/owner/data";
import { OwnerReadOnlyTable } from "../../../components/owner/read-only";
import { OwnerPageHeading, OwnerShell } from "../../../components/owner/owner-shell";

export default function OwnerDataProdukPage() {
  return (
    <OwnerShell
      activeSection="data-produk"
      breadcrumb="Data Produk / Daftar"
      backgroundImage="/images/owner/background-produk.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Data Produk"
          description="Daftar produk hanya untuk dilihat. Klik Lihat untuk membuka rincian."
        />
        <OwnerReadOnlyTable kind="data-produk" rows={ownerProducts} />
      </div>
    </OwnerShell>
  );
}
