import Image from "next/image";
import Link from "next/link";
import {
  getQualityResultDetails,
  type KaryawanQcSection,
  type QualityResult,
  type ReferenceRow,
  type ReferenceSection,
  qualityResults,
} from "./data";

function StatusBadge({ value }: { value: string }) {
  const color =
    value === "Terverifikasi" || value === "Selesai"
      ? "bg-[#e6f4ec] text-[#118247]"
      : value === "Menunggu"
        ? "bg-[#fff3d8] text-[#9a6500]"
        : "bg-[#eaf4fc] text-[#0a3d62]";

  return (
    <span className={`inline-flex rounded-[5px] px-2 py-1 text-[12px] font-bold ${color}`}>
      {value}
    </span>
  );
}

function ReferenceActions({
  href,
  label = "Lihat",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6e3ed] bg-white px-3 text-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
    >
      <Image src="/images/bahan-baku/icon-eye.svg" alt="" width={14} height={14} />
      {label}
    </Link>
  );
}

function formatCell(value: string) {
  if (
    value === "Terverifikasi" ||
    value === "Menunggu" ||
    value === "Selesai" ||
    value === "Dijadwalkan" ||
    value === "Sedang Berjalan"
  ) {
    return <StatusBadge value={value} />;
  }
  return value;
}

export function ReferenceTable({
  section,
  data,
}: {
  section: KaryawanQcSection;
  data: ReferenceSection;
}) {
  return (
    <section className="relative z-10 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <h2 className="px-6 py-[18px] text-[17px] font-bold text-[#17263b] md:text-[20px]">
        {data.tableTitle}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-[14px] text-[#17263b]">
          <thead className="bg-[#f6f9fc] font-bold">
            <tr>
              {data.columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-3">
                  {column}
                </th>
              ))}
              <th scope="col" className="px-4 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <ReferenceRowView
                key={row.code}
                row={row}
                section={section}
              />
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter count={data.rows.length} label={data.tableTitle.toLowerCase()} />
    </section>
  );
}

function ReferenceRowView({
  row,
  section,
}: {
  row: ReferenceRow;
  section: KaryawanQcSection;
}) {
  return (
    <tr className="h-[49px] border-t border-[#d6e3ed] align-middle">
      {row.cells.map((cell, index) => (
        <td
          key={`${row.code}-${index}`}
          className={`px-4 py-3 ${
            index === 0
              ? "whitespace-nowrap text-[#61738a]"
              : index === 1 || section === "jadwal-qc"
                ? "font-bold"
                : ""
          }`}
        >
          {formatCell(cell)}
        </td>
      ))}
      <td className="px-4 py-2">
        <ReferenceActions href={`/karyawan-qc/${section}/${row.code}`} />
      </td>
    </tr>
  );
}

export function QualityResultsTable({
  mode,
}: {
  mode: "view" | "update" | "delete";
}) {
  const actionText = mode === "view" ? "Lihat" : mode === "update" ? "Edit" : "";
  const actionHref = (code: string) =>
    mode === "view"
      ? `/karyawan-qc/hasil-qc/lihat/${code}`
      : mode === "update"
        ? `/karyawan-qc/hasil-qc/update/${code}`
        : `/karyawan-qc/hasil-qc/hapus/konfirmasi/${code}`;

  return (
    <section className="relative z-10 w-full overflow-hidden rounded-[14px] border border-[#d6e3ed] bg-white">
      <h2 className="px-6 py-[18px] text-[17px] font-bold text-[#17263b] md:text-[20px]">
        Data Hasil Pemeriksaan QC
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left text-[14px] text-[#17263b]">
          <thead className="bg-[#f6f9fc] font-bold">
            <tr>
              {[
                "Kode",
                "Tanggal Pencatatan",
                "Jadwal QC",
                "Diperiksa",
                "Lolos",
                "Reject",
                "Keterangan",
                mode === "delete" ? "Hapus" : "Aksi",
              ].map((column) => (
                <th key={column} scope="col" className="px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {qualityResults.map((result) => (
              <QualityResultRow
                key={result.code}
                result={result}
                mode={mode}
                href={actionHref(result.code)}
                actionText={actionText}
              />
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter count={qualityResults.length} label="hasil pemeriksaan" />
    </section>
  );
}

function QualityResultRow({
  result,
  mode,
  href,
  actionText,
}: {
  result: QualityResult;
  mode: "view" | "update" | "delete";
  href: string;
  actionText: string;
}) {
  const date = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${result.recordedAt}T00:00:00Z`))
    .replace(".", "");

  return (
    <tr className="h-[49px] border-t border-[#d6e3ed] align-middle">
      <td className="whitespace-nowrap px-4 py-3 text-[#61738a]">{result.code}</td>
      <td className="whitespace-nowrap px-4 py-3">{date}</td>
      <td className="whitespace-nowrap px-4 py-3">{result.qcScheduleCode}</td>
      <td className="px-4 py-3">{result.inspected}</td>
      <td className="px-4 py-3">{result.passed}</td>
      <td
        className={`px-4 py-3 ${
          result.rejected > 0 ? "font-bold text-[#c9302c]" : ""
        }`}
      >
        {result.rejected}
      </td>
      <td className="max-w-[280px] px-4 py-3 font-bold">{result.note}</td>
      <td className="px-4 py-2">
        {mode === "delete" ? (
          <Link
            href={href}
            aria-label={`Hapus hasil QC ${result.code}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#c9302c] transition-colors hover:bg-[#a72522] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926]"
          >
            <Image
              src="/images/bahan-baku/icon-trash.svg"
              alt=""
              width={14}
              height={14}
              className="brightness-0 invert"
            />
          </Link>
        ) : (
          <ReferenceActions href={href} label={actionText} />
        )}
      </td>
    </tr>
  );
}

function TableFooter({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex min-h-[46px] items-center justify-between border-t border-[#d6e3ed] px-4 text-[13px] text-[#61738a] md:px-6 md:text-[14px]">
      <p>Menampilkan 1–{count} dari {count} {label}</p>
      <p className="whitespace-nowrap text-[#0a3d62]">Halaman 1 dari 1</p>
    </div>
  );
}

export function ReferenceDetails({
  section,
  row,
}: {
  section: KaryawanQcSection;
  row: ReferenceRow;
}) {
  return (
    <DetailCard
      title={row.title}
      code={row.code}
      fields={row.fields}
      backHref={`/karyawan-qc/${section}`}
    />
  );
}

export function QualityResultDetails({
  result,
  history = false,
}: {
  result: QualityResult;
  history?: boolean;
}) {
  const details = getQualityResultDetails(result);
  return (
    <DetailCard
      title={details.title}
      code={result.code}
      fields={details.fields}
      backHref={
        history
          ? "/karyawan-qc/riwayat-pemeriksaan"
          : "/karyawan-qc/hasil-qc/lihat"
      }
      readOnlyMessage={
        history
          ? undefined
          : "Hanya baca. Gunakan menu Update Hasil QC untuk mengubah informasi ini."
      }
    />
  );
}

function DetailCard({
  title,
  code,
  fields,
  backHref,
  readOnlyMessage,
}: {
  title: string;
  code: string;
  fields: [string, string][];
  backHref: string;
  readOnlyMessage?: string;
}) {
  return (
    <section className="relative z-10 w-full max-w-[900px] rounded-[14px] border border-[#d6e3ed] bg-white p-5 md:p-6">
      <div>
        <h2 className="text-[18px] font-bold text-[#17263b] md:text-[24px]">
          {title}
        </h2>
        <p className="mt-1 text-[14px] text-[#61738a] md:text-[17px]">{code}</p>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-[#d6e3ed] pt-5 sm:grid-cols-2 md:mt-6 md:gap-y-6 md:pt-6">
        {fields.map(([label, value]) => (
          <div key={label} className="flex min-w-0 flex-col gap-2">
            <dt className="text-[14px] text-[#61738a] md:text-[16px]">
              {label}
            </dt>
            <dd className="text-[16px] font-bold leading-[1.4] text-[#17263b] md:text-[18px]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {readOnlyMessage ? (
        <p className="mt-6 rounded-[8px] bg-[#f6f9fc] px-3 py-3 text-[13px] text-[#61738a] md:text-[14px]">
          {readOnlyMessage}
        </p>
      ) : null}
      <Link
        href={backHref}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-[8px] border border-[#d6e3ed] bg-white px-[14px] font-bold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62]"
      >
        Kembali
      </Link>
    </section>
  );
}
