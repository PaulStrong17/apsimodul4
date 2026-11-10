export type KaryawanQcSection =
  | "bahan-baku"
  | "data-produk"
  | "jadwal-produksi"
  | "jadwal-qc"
  | "riwayat-pemeriksaan";

export type ReferenceRow = {
  code: string;
  cells: string[];
  title: string;
  fields: [string, string][];
};

export type ReferenceSection = {
  title: string;
  description: string;
  tableTitle: string;
  columns: string[];
  backgroundImage: string;
  rows: ReferenceRow[];
};

export const referenceSections: Record<KaryawanQcSection, ReferenceSection> = {
  "bahan-baku": {
    title: "Daftar Bahan Baku",
    description: "",
    tableTitle: "Data Bahan Baku",
    columns: ["Kode", "Nama Bahan Baku", "Satuan", "Stok", "Stok Minimum"],
    backgroundImage: "/images/karyawan-qc/background-bahan-baku.jpg",
    rows: [
      {
        code: "BB-001",
        cells: ["BB-001", "Cabe", "kg", "25", "5"],
        title: "Cabe",
        fields: [
          ["Satuan", "kg"],
          ["Stok", "250 kg"],
          ["Stok Minimum", "50 kg"],
          ["Dikelola Oleh", "Admin"],
        ],
      },
      {
        code: "BB-002",
        cells: ["BB-002", "Gula Pasir", "kg", "120", "30"],
        title: "Gula Pasir",
        fields: [["Satuan", "kg"], ["Stok", "120 kg"], ["Stok Minimum", "30 kg"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "BB-003",
        cells: ["BB-003", "Minyak Goreng", "liter", "80", "20"],
        title: "Minyak Goreng",
        fields: [["Satuan", "liter"], ["Stok", "80 liter"], ["Stok Minimum", "20 liter"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "BB-004",
        cells: ["BB-004", "Telur Ayam", "kg", "45", "15"],
        title: "Telur Ayam",
        fields: [["Satuan", "kg"], ["Stok", "45 kg"], ["Stok Minimum", "15 kg"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "BB-005",
        cells: ["BB-005", "Mentega", "kg", "60", "10"],
        title: "Mentega",
        fields: [["Satuan", "kg"], ["Stok", "60 kg"], ["Stok Minimum", "10 kg"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "BB-006",
        cells: ["BB-006", "Garam", "kg", "25", "5"],
        title: "Garam",
        fields: [["Satuan", "kg"], ["Stok", "25 kg"], ["Stok Minimum", "5 kg"], ["Dikelola Oleh", "Admin"]],
      },
    ],
  },
  "data-produk": {
    title: "Daftar Produk",
    description: "",
    tableTitle: "Data Produk",
    columns: ["Kode", "Nama Produk", "Varian", "Stok Produk", "Resep Produk"],
    backgroundImage: "/images/karyawan-qc/background-produk.jpg",
    rows: [
      {
        code: "PRD-001",
        cells: ["PRD-001", "Keripik Cabe Original", "Original", "120", "Resep Keripik Cabe Original"],
        title: "Keripik Cabe Original",
        fields: [["Varian", "Original"], ["Stok Produk", "120"], ["Resep Produk", "Resep Keripik Cabe Original"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "PRD-002",
        cells: ["PRD-002", "Keripik Cabe Original", "Pedas", "85", "Resep Keripik Cabe Pedas"],
        title: "Keripik Cabe Original",
        fields: [["Varian", "Pedas"], ["Stok Produk", "85"], ["Resep Produk", "Resep Keripik Cabe Pedas"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "PRD-003",
        cells: ["PRD-003", "Keripik Cabe Onang", "Balado", "64", "Resep Keripik Cabe Balado"],
        title: "Keripik Cabe Onang",
        fields: [["Varian", "Balado"], ["Stok Produk", "64"], ["Resep Produk", "Resep Keripik Cabe Balado"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "PRD-004",
        cells: ["PRD-004", "Keripik Singkong", "Original", "140", "Resep Keripik Singkong"],
        title: "Keripik Singkong",
        fields: [["Varian", "Original"], ["Stok Produk", "140"], ["Resep Produk", "Resep Keripik Singkong"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "PRD-005",
        cells: ["PRD-005", "Keripik Singkong", "Keju", "52", "Resep Keripik Singkong Keju"],
        title: "Keripik Singkong",
        fields: [["Varian", "Keju"], ["Stok Produk", "52"], ["Resep Produk", "Resep Keripik Singkong Keju"], ["Dikelola Oleh", "Admin"]],
      },
      {
        code: "PRD-006",
        cells: ["PRD-006", "Keripik Pisang", "Original", "30", "Resep Keripik Pisang"],
        title: "Keripik Pisang",
        fields: [["Varian", "Original"], ["Stok Produk", "30"], ["Resep Produk", "Resep Keripik Pisang"], ["Dikelola Oleh", "Admin"]],
      },
    ],
  },
  "jadwal-produksi": {
    title: "Daftar Jadwal Produksi",
    description:
      "Lihat jadwal produksi beserta target dan status verifikasinya. Klik Lihat pada baris data untuk membuka rincian jadwal.",
    tableTitle: "Data Jadwal Produksi",
    columns: ["Kode", "Tanggal Produksi", "Produk", "Jumlah Target", "Status Verifikasi", "Status Jadwal"],
    backgroundImage: "/images/karyawan-qc/background-jadwal-produksi.jpg",
    rows: [
      {
        code: "JP-001",
        cells: ["JP-001", "20 Okt 2026", "Keripik Cabe Original", "100", "Terverifikasi", "Selesai"],
        title: "Keripik Cabe Original",
        fields: [["Tanggal Produksi", "20 Okt 2026"], ["Jumlah Target", "100"], ["Status Verifikasi", "Terverifikasi"], ["Status Jadwal", "Selesai"], ["Permintaan Produk", "PRM-001 — Keripik Cabe Original"], ["Dibuat Oleh", "Admin"], ["Karyawan Produksi", "Handika Kurniawan"], ["Karyawan QC", "Aisyah Dwina"], ["Diverifikasi Oleh", "Owner"]],
      },
      {
        code: "JP-002",
        cells: ["JP-002", "21 Okt 2026", "Keripik Cabe Original (Pedas)", "80", "Terverifikasi", "Selesai"],
        title: "Keripik Cabe Original (Pedas)",
        fields: [["Tanggal Produksi", "21 Okt 2026"], ["Jumlah Target", "80"], ["Status Verifikasi", "Terverifikasi"], ["Status Jadwal", "Selesai"], ["Karyawan Produksi", "Raffa Fahrezy"], ["Karyawan QC", "Aisyah Dwina"]],
      },
      {
        code: "JP-003",
        cells: ["JP-003", "22 Okt 2026", "Keripik Cabe Onang (Balado)", "120", "Terverifikasi", "Selesai"],
        title: "Keripik Cabe Onang (Balado)",
        fields: [["Tanggal Produksi", "22 Okt 2026"], ["Jumlah Target", "120"], ["Status Verifikasi", "Terverifikasi"], ["Status Jadwal", "Selesai"], ["Karyawan Produksi", "Handika Kurniawan"], ["Karyawan QC", "Aisyah Dwina"]],
      },
      {
        code: "JP-004",
        cells: ["JP-004", "23 Okt 2026", "Keripik Singkong (Original)", "90", "Terverifikasi", "Selesai"],
        title: "Keripik Singkong (Original)",
        fields: [["Tanggal Produksi", "23 Okt 2026"], ["Jumlah Target", "90"], ["Status Verifikasi", "Terverifikasi"], ["Status Jadwal", "Selesai"], ["Karyawan Produksi", "Raffa Fahrezy"], ["Karyawan QC", "Aisyah Dwina"]],
      },
      {
        code: "JP-005",
        cells: ["JP-005", "25 Okt 2026", "Keripik Singkong (Keju)", "150", "Terverifikasi", "Sedang Berjalan"],
        title: "Keripik Singkong (Keju)",
        fields: [["Tanggal Produksi", "25 Okt 2026"], ["Jumlah Target", "150"], ["Status Verifikasi", "Terverifikasi"], ["Status Jadwal", "Sedang Berjalan"], ["Karyawan Produksi", "Handika Kurniawan"], ["Karyawan QC", "Aisyah Dwina"]],
      },
      {
        code: "JP-006",
        cells: ["JP-006", "27 Okt 2026", "Keripik Pisang (Original)", "100", "Menunggu", "Dijadwalkan"],
        title: "Keripik Pisang (Original)",
        fields: [["Tanggal Produksi", "27 Okt 2026"], ["Jumlah Target", "100"], ["Status Verifikasi", "Menunggu"], ["Status Jadwal", "Dijadwalkan"], ["Karyawan Produksi", "Raffa Fahrezy"], ["Karyawan QC", "Aisyah Dwina"]],
      },
    ],
  },
  "jadwal-qc": {
    title: "Daftar Jadwal QC",
    description:
      "Lihat jadwal pemeriksaan QC beserta jenis dan statusnya. Klik Lihat pada baris data untuk membuka rincian jadwal.",
    tableTitle: "Data Jadwal QC",
    columns: ["Kode", "Tanggal Pemeriksaan", "Jenis Pemeriksaan", "Jadwal Produksi", "Status Verifikasi", "Status Pemeriksaan"],
    backgroundImage: "/images/karyawan-qc/background-jadwal-qc.jpg",
    rows: [
      {
        code: "JQC-001",
        cells: ["JQC-001", "21 Okt 2026", "Pemeriksaan Visual Produk", "JP-001", "Terverifikasi", "Selesai"],
        title: "Pemeriksaan Visual Produk",
        fields: [["Tanggal Pemeriksaan", "21 Okt 2026"], ["Jenis Pemeriksaan", "Pemeriksaan Visual Produk"], ["Jadwal Produksi", "JP-001 — Keripik Cabe Original"], ["Dibuat Oleh", "Admin"], ["Status Verifikasi", "Terverifikasi"], ["Status Pemeriksaan", "Selesai"], ["Karyawan QC", "Aisyah Dwina"], ["Karyawan Produksi", "Handika Kurniawan"], ["Diverifikasi Oleh", "Owner"]],
      },
      {
        code: "JQC-002",
        cells: ["JQC-002", "22 Okt 2026", "Pemeriksaan Rasa dan Kepedasan", "JP-002", "Terverifikasi", "Selesai"],
        title: "Pemeriksaan Rasa dan Kepedasan",
        fields: [["Tanggal Pemeriksaan", "22 Okt 2026"], ["Jenis Pemeriksaan", "Pemeriksaan Rasa dan Kepedasan"], ["Jadwal Produksi", "JP-002 — Keripik Cabe Original (Pedas)"], ["Status Verifikasi", "Terverifikasi"], ["Status Pemeriksaan", "Selesai"], ["Karyawan QC", "Aisyah Dwina"], ["Karyawan Produksi", "Raffa Fahrezy"], ["Diverifikasi Oleh", "Owner"]],
      },
      {
        code: "JQC-003",
        cells: ["JQC-003", "23 Okt 2026", "Pemeriksaan Kemasan", "JP-003", "Terverifikasi", "Selesai"],
        title: "Pemeriksaan Kemasan",
        fields: [["Tanggal Pemeriksaan", "23 Okt 2026"], ["Jenis Pemeriksaan", "Pemeriksaan Kemasan"], ["Jadwal Produksi", "JP-003 — Keripik Cabe Onang (Balado)"], ["Status Verifikasi", "Terverifikasi"], ["Status Pemeriksaan", "Selesai"], ["Karyawan QC", "Aisyah Dwina"], ["Karyawan Produksi", "Handika Kurniawan"], ["Diverifikasi Oleh", "Owner"]],
      },
      {
        code: "JQC-004",
        cells: ["JQC-004", "24 Okt 2026", "Pemeriksaan Berat Bersih", "JP-004", "Terverifikasi", "Selesai"],
        title: "Pemeriksaan Berat Bersih",
        fields: [["Tanggal Pemeriksaan", "24 Okt 2026"], ["Jenis Pemeriksaan", "Pemeriksaan Berat Bersih"], ["Jadwal Produksi", "JP-004 — Keripik Singkong (Original)"], ["Status Verifikasi", "Terverifikasi"], ["Status Pemeriksaan", "Selesai"], ["Karyawan QC", "Aisyah Dwina"], ["Karyawan Produksi", "Raffa Fahrezy"], ["Diverifikasi Oleh", "Owner"]],
      },
      {
        code: "JQC-005",
        cells: ["JQC-005", "26 Okt 2026", "Pemeriksaan Visual Produk", "JP-005", "Terverifikasi", "Dijadwalkan"],
        title: "Pemeriksaan Visual Produk",
        fields: [["Tanggal Pemeriksaan", "26 Okt 2026"], ["Jenis Pemeriksaan", "Pemeriksaan Visual Produk"], ["Jadwal Produksi", "JP-005 — Keripik Singkong (Keju)"], ["Status Verifikasi", "Terverifikasi"], ["Status Pemeriksaan", "Dijadwalkan"], ["Karyawan QC", "Aisyah Dwina"], ["Karyawan Produksi", "Handika Kurniawan"], ["Diverifikasi Oleh", "Owner"]],
      },
      {
        code: "JQC-006",
        cells: ["JQC-006", "28 Okt 2026", "Pemeriksaan Kemasan", "JP-006", "Menunggu", "Dijadwalkan"],
        title: "Pemeriksaan Kemasan",
        fields: [["Tanggal Pemeriksaan", "28 Okt 2026"], ["Jenis Pemeriksaan", "Pemeriksaan Kemasan"], ["Jadwal Produksi", "JP-006 — Keripik Pisang (Original)"], ["Status Verifikasi", "Menunggu"], ["Status Pemeriksaan", "Dijadwalkan"], ["Karyawan QC", "Aisyah Dwina"], ["Karyawan Produksi", "Raffa Fahrezy"]],
      },
    ],
  },
  "riwayat-pemeriksaan": {
    title: "Riwayat Pemeriksaan",
    description:
      "Lihat riwayat hasil pemeriksaan QC yang sudah dicatat. Klik Lihat pada baris data untuk membuka rinciannya.",
    tableTitle: "Riwayat Hasil Pemeriksaan",
    columns: ["Kode", "Tanggal Pencatatan", "Jadwal QC", "Diperiksa", "Lolos", "Reject", "Keterangan"],
    backgroundImage: "/images/karyawan-qc/background-riwayat.jpg",
    rows: [
      {
        code: "HQC-001",
        cells: ["HQC-001", "21 Okt 2026", "JQC-001", "100", "96", "4", "Empat unit reject karena kemasan bocor"],
        title: "Pemeriksaan Visual Produk",
        fields: [["Tanggal Pencatatan", "21 Okt 2026"], ["Jadwal QC", "JQC-001 — Pemeriksaan Visual Produk"], ["Jumlah Diperiksa", "100"], ["Jumlah Lolos", "96"], ["Jumlah Reject", "4"], ["Hasil Produksi", "HP-001 — Keripik Cabe Original"], ["Dicatat Oleh", "Aisyah Dwina (Karyawan QC)"], ["Laporan", "LAP-001"], ["Keterangan", "Empat unit reject karena kemasan bocor."], ["Tindakan Perbaikan", "Melakukan kemas ulang."]],
      },
      {
        code: "HQC-002",
        cells: ["HQC-002", "22 Okt 2026", "JQC-002", "80", "80", "0", "Semua unit lolos pemeriksaan"],
        title: "Pemeriksaan Rasa dan Kepedasan",
        fields: [["Tanggal Pencatatan", "22 Okt 2026"], ["Jadwal QC", "JQC-002 — Pemeriksaan Rasa dan Kepedasan"], ["Jumlah Diperiksa", "80"], ["Jumlah Lolos", "80"], ["Jumlah Reject", "0"], ["Hasil Produksi", "HP-002 — Keripik Cabe Original (Pedas)"], ["Dicatat Oleh", "Aisyah Dwina (Karyawan QC)"], ["Laporan", "LAP-002"], ["Keterangan", "Semua unit lolos pemeriksaan."], ["Tindakan Perbaikan", "Tidak diperlukan."]],
      },
      {
        code: "HQC-003",
        cells: ["HQC-003", "23 Okt 2026", "JQC-003", "120", "112", "8", "Segel kemasan kurang rapat"],
        title: "Pemeriksaan Kemasan",
        fields: [["Tanggal Pencatatan", "23 Okt 2026"], ["Jadwal QC", "JQC-003 — Pemeriksaan Kemasan"], ["Jumlah Diperiksa", "120"], ["Jumlah Lolos", "112"], ["Jumlah Reject", "8"], ["Hasil Produksi", "HP-003 — Keripik Cabe Onang Balado"], ["Dicatat Oleh", "Aisyah Dwina (Karyawan QC)"], ["Laporan", "LAP-003"], ["Keterangan", "Segel kemasan kurang rapat."], ["Tindakan Perbaikan", "Pengecekan ulang segel kemasan."]],
      },
      {
        code: "HQC-004",
        cells: ["HQC-004", "24 Okt 2026", "JQC-004", "90", "87", "3", "Berat bersih di bawah standar"],
        title: "Pemeriksaan Berat Bersih",
        fields: [["Tanggal Pencatatan", "24 Okt 2026"], ["Jadwal QC", "JQC-004 — Pemeriksaan Berat Bersih"], ["Jumlah Diperiksa", "90"], ["Jumlah Lolos", "87"], ["Jumlah Reject", "3"], ["Hasil Produksi", "HP-004 — Keripik Singkong Original"], ["Dicatat Oleh", "Aisyah Dwina (Karyawan QC)"], ["Laporan", "LAP-004"], ["Keterangan", "Berat bersih di bawah standar."], ["Tindakan Perbaikan", "Kalibrasi ulang timbangan."]],
      },
    ],
  },
};

export type QualityResult = {
  code: string;
  recordedAt: string;
  qcScheduleCode: string;
  inspected: number;
  passed: number;
  rejected: number;
  note: string;
  correctiveAction: string;
  productionResultCode: string;
  reportCode: string;
};

export const qualityResults: QualityResult[] = [
  {
    code: "HQC-001",
    recordedAt: "2026-10-21",
    qcScheduleCode: "JQC-001",
    inspected: 100,
    passed: 96,
    rejected: 4,
    note: "Empat unit reject karena kemasan bocor.",
    correctiveAction: "Melakukan kemas ulang.",
    productionResultCode: "HP-001",
    reportCode: "LAP-001",
  },
  {
    code: "HQC-002",
    recordedAt: "2026-10-22",
    qcScheduleCode: "JQC-002",
    inspected: 80,
    passed: 80,
    rejected: 0,
    note: "Semua unit lolos pemeriksaan.",
    correctiveAction: "Tidak diperlukan.",
    productionResultCode: "HP-002",
    reportCode: "LAP-002",
  },
  {
    code: "HQC-003",
    recordedAt: "2026-10-23",
    qcScheduleCode: "JQC-003",
    inspected: 120,
    passed: 112,
    rejected: 8,
    note: "Segel kemasan kurang rapat.",
    correctiveAction: "Pengecekan ulang segel kemasan.",
    productionResultCode: "HP-003",
    reportCode: "LAP-003",
  },
  {
    code: "HQC-004",
    recordedAt: "2026-10-24",
    qcScheduleCode: "JQC-004",
    inspected: 90,
    passed: 87,
    rejected: 3,
    note: "Berat bersih di bawah standar.",
    correctiveAction: "Kalibrasi ulang timbangan.",
    productionResultCode: "HP-004",
    reportCode: "LAP-004",
  },
];

export const productionResultOptions = [
  { code: "HP-001", label: "HP-001 — Keripik Cabe Original" },
  { code: "HP-002", label: "HP-002 — Keripik Cabe Original (Pedas)" },
  { code: "HP-003", label: "HP-003 — Keripik Cabe Onang Balado" },
  { code: "HP-004", label: "HP-004 — Keripik Singkong Original" },
];

export const reportOptions = [
  { code: "LAP-001", label: "LAP-001" },
  { code: "LAP-002", label: "LAP-002" },
  { code: "LAP-003", label: "LAP-003" },
  { code: "LAP-004", label: "LAP-004" },
];

export function getReferenceSection(section: string) {
  return isKaryawanQcSection(section) ? referenceSections[section] : undefined;
}

export function isKaryawanQcSection(
  section: string,
): section is KaryawanQcSection {
  return Object.prototype.hasOwnProperty.call(referenceSections, section);
}

export function getReferenceRow(section: string, code: string) {
  return getReferenceSection(section)?.rows.find(
    (row) => row.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getQualityResult(code: string) {
  return qualityResults.find(
    (result) => result.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getQualityScheduleLabel(code: string) {
  const schedule = referenceSections["jadwal-qc"].rows.find(
    (row) => row.code === code,
  );
  return schedule ? `${schedule.code} — ${schedule.title}` : code;
}

export function getProductionResultLabel(code: string) {
  return productionResultOptions.find((option) => option.code === code)?.label ?? code;
}

export function formatKqcDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T00:00:00Z`))
    .replace(".", "");
}

export function getQualityResultDetails(result: QualityResult) {
  const schedule = referenceSections["jadwal-qc"].rows.find(
    (row) => row.code === result.qcScheduleCode,
  );
  const scheduleTitle = schedule?.title ?? result.qcScheduleCode;

  return {
    title: scheduleTitle,
    fields: [
      ["Tanggal Pencatatan", formatKqcDate(result.recordedAt)],
      ["Jadwal QC", `${result.qcScheduleCode} — ${scheduleTitle}`],
      ["Jumlah Diperiksa", String(result.inspected)],
      ["Jumlah Lolos", String(result.passed)],
      ["Jumlah Reject", String(result.rejected)],
      ["Hasil Produksi", getProductionResultLabel(result.productionResultCode)],
      ["Dicatat Oleh", "Aisyah Dwina (Karyawan QC)"],
      ["Laporan", result.reportCode],
      ["Keterangan", result.note],
      ["Tindakan Perbaikan", result.correctiveAction],
    ] as [string, string][],
  };
}
