import { OwnerVerificationTable } from "../../../components/owner/verification";
import { OwnerPageHeading, OwnerShell } from "../../../components/owner/owner-shell";

export default function OwnerVerificationPage() {
  return (
    <OwnerShell
      activeSection="verifikasi-jadwal"
      breadcrumb="Verifikasi Jadwal / Daftar"
      backgroundImage="/images/owner/background-verifikasi.jpg"
    >
      <div className="relative flex flex-1 flex-col p-[clamp(20px,2.5vw,36px)]">
        <OwnerPageHeading
          title="Verifikasi Jadwal"
          description="Tinjau jadwal yang menunggu verifikasi, lalu putuskan untuk menyetujui atau menolak."
        />
        <OwnerVerificationTable />
      </div>
    </OwnerShell>
  );
}
