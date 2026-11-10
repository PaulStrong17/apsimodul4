export type ParsedQcResultInput = {
  code: string;
  recordedAt: Date;
  qcScheduleCode: string;
  inspected: number;
  passed: number;
  rejected: number;
  note: string;
  correctiveAction?: string;
  productionResultCode?: string;
  reportCode?: string;
};

function parseDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseInteger(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 0 ? value : null;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const num = parseInt(trimmed, 10);
  return Number.isFinite(num) && num >= 0 ? num : null;
}

export function parseQcResultCreateInput(body: unknown): ParsedQcResultInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const rawCode = data.code ?? data.kode ?? data.id_hasilqc;
  if (!rawCode || typeof rawCode !== "string") return null;
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;

  const rawRecordedAt = data.recordedAt ?? data.tanggal_pencatatan ?? data.tanggalPencatatan;
  const recordedAt = parseDate(rawRecordedAt);
  if (!recordedAt) return null;

  const rawQcSchedule = data.qcSchedule ?? data.qcScheduleCode ?? data.id_jadwalqc;
  if (!rawQcSchedule || typeof rawQcSchedule !== "string") return null;
  const qcScheduleCode = rawQcSchedule.trim();
  if (!qcScheduleCode) return null;

  const inspected = parseInteger(data.inspected ?? data.jumlah_diperiksa);
  if (inspected === null) return null;

  const passed = parseInteger(data.passed ?? data.jumlah_lolos);
  if (passed === null) return null;

  const rejected = parseInteger(data.rejected ?? data.jumlah_reject);
  if (rejected === null) return null;

  if (passed + rejected !== inspected) {
    return null;
  }

  const rawNote = data.note ?? data.keterangan;
  const note = typeof rawNote === "string" ? rawNote.trim() : "Hasil pemeriksaan QC dicatat.";

  const correctiveAction =
    typeof data.correctiveAction === "string" ? data.correctiveAction.trim() : undefined;

  const productionResultCode =
    typeof data.productionResult === "string"
      ? data.productionResult.trim()
      : typeof data.productionResultCode === "string"
        ? data.productionResultCode.trim()
        : undefined;

  const reportCode =
    typeof data.reportCode === "string"
      ? data.reportCode.trim()
      : typeof data.laporan === "string"
        ? data.laporan.trim()
        : undefined;

  return {
    code,
    recordedAt,
    qcScheduleCode,
    inspected,
    passed,
    rejected,
    note,
    correctiveAction,
    productionResultCode,
    reportCode,
  };
}

export function parseQcResultUpdateInput(
  body: unknown,
): Omit<ParsedQcResultInput, "code"> | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const rawRecordedAt = data.recordedAt ?? data.tanggal_pencatatan ?? data.tanggalPencatatan;
  const recordedAt = parseDate(rawRecordedAt);
  if (!recordedAt) return null;

  const rawQcSchedule = data.qcSchedule ?? data.qcScheduleCode ?? data.id_jadwalqc;
  if (!rawQcSchedule || typeof rawQcSchedule !== "string") return null;
  const qcScheduleCode = rawQcSchedule.trim();
  if (!qcScheduleCode) return null;

  const inspected = parseInteger(data.inspected ?? data.jumlah_diperiksa);
  if (inspected === null) return null;

  const passed = parseInteger(data.passed ?? data.jumlah_lolos);
  if (passed === null) return null;

  const rejected = parseInteger(data.rejected ?? data.jumlah_reject);
  if (rejected === null) return null;

  if (passed + rejected !== inspected) {
    return null;
  }

  const rawNote = data.note ?? data.keterangan;
  const note = typeof rawNote === "string" ? rawNote.trim() : "Hasil pemeriksaan QC dicatat.";

  const correctiveAction =
    typeof data.correctiveAction === "string" ? data.correctiveAction.trim() : undefined;

  const productionResultCode =
    typeof data.productionResult === "string"
      ? data.productionResult.trim()
      : typeof data.productionResultCode === "string"
        ? data.productionResultCode.trim()
        : undefined;

  const reportCode =
    typeof data.reportCode === "string"
      ? data.reportCode.trim()
      : typeof data.laporan === "string"
        ? data.laporan.trim()
        : undefined;

  return {
    recordedAt,
    qcScheduleCode,
    inspected,
    passed,
    rejected,
    note,
    correctiveAction,
    productionResultCode,
    reportCode,
  };
}
