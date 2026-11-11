"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import type { MaterialFormOptions } from "@/lib/admin/materials";

const fieldClassName =
  "h-12 w-full rounded-[10px] border border-[#d9e3ed] bg-white px-[10px] text-[15px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[14px] font-bold leading-[1.2] text-[#17263b] md:text-[15px]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function BahanBakuAddForm({
  options,
}: {
  options?: MaterialFormOptions;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suppliers = options?.suppliers ?? [];
  const recipes = options?.recipes ?? [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/bahan-baku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.get("kode"),
          name: formData.get("nama"),
          unit: formData.get("satuan"),
          stock: formData.get("stok"),
          minimumStock: formData.get("stokMinimum"),
          recipeId: formData.get("recipeId") || undefined,
          supplierId: formData.get("supplierId") || undefined,
          receiptDate: formData.get("receiptDate") || undefined,
          receiptAmount: formData.get("stok"),
          receiptNote: formData.get("receiptNote") || undefined,
        }),
      });
      const result: { code?: string; error?: string } = await response.json();

      if (!response.ok || !result.code) {
        setError(result.error ?? "Bahan baku tidak dapat disimpan.");
        return;
      }

      router.replace(
        `/bahan-baku/tambah/berhasil?kode=${encodeURIComponent(result.code)}`,
      );
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 w-full max-w-[900px] rounded-[24px] border border-[#d6e3ed] bg-white/80 p-5 shadow-[0_3px_4px_rgba(0,0,0,0.15)] md:rounded-[36px] md:p-7"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] font-bold leading-[1.5] text-[#17263b] md:text-[20px]">
          Form Tambah Bahan Baku
        </h2>
        <p className="text-[13px] text-[#61738a] md:text-[14px]">
          Lengkapi data bahan baku beserta resep acuan dan penerimaan supplier.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <FormField label="Nama Bahan Baku *" htmlFor="nama">
          <input
            id="nama"
            name="nama"
            type="text"
            autoComplete="off"
            placeholder="Contoh: Cabai Merah"
            required
            maxLength={100}
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Kode Bahan Baku *" htmlFor="kode">
          <input
            id="kode"
            name="kode"
            type="text"
            autoComplete="off"
            placeholder="Contoh: BB-008 atau B08"
            required
            maxLength={10}
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Satuan *" htmlFor="satuan">
          <span className="relative block">
            <select
              id="satuan"
              name="satuan"
              defaultValue=""
              required
              className={`${fieldClassName} appearance-none pr-10 text-[#61738a]`}
            >
              <option value="" disabled>
                Pilih Satuan
              </option>
              <option value="kg">Kg</option>
              <option value="gram">Gram</option>
              <option value="liter">Liter</option>
              <option value="pcs">Pcs</option>
            </select>
            <Image
              aria-hidden="true"
              alt=""
              src="/images/bahan-baku/chevron-down.svg"
              width={16}
              height={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
          </span>
        </FormField>

        <FormField label="Stok Awal *" htmlFor="stok">
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            step="any"
            placeholder="Jumlah stok"
            required
            className={fieldClassName}
          />
        </FormField>

        <FormField label="Stok Minimum *" htmlFor="stok-minimum">
          <input
            id="stok-minimum"
            name="stokMinimum"
            type="number"
            min="0"
            step="any"
            placeholder="Batas minimum stok"
            required
            className={fieldClassName}
          />
        </FormField>

        {/* Resep */}
        <FormField label="Resep Produk" htmlFor="recipe-id">
          <span className="relative block">
            <select
              id="recipe-id"
              name="recipeId"
              defaultValue=""
              className={`${fieldClassName} appearance-none pr-10 text-[#61738a]`}
            >
              <option value="">Pilih Resep Produk (Opsional)</option>
              {recipes.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>
            <Image
              aria-hidden="true"
              alt=""
              src="/images/bahan-baku/chevron-down.svg"
              width={16}
              height={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
          </span>
        </FormField>

        {/* Supplier */}
        <FormField label="Supplier" htmlFor="supplier-id">
          <span className="relative block">
            <select
              id="supplier-id"
              name="supplierId"
              defaultValue=""
              className={`${fieldClassName} appearance-none pr-10 text-[#61738a]`}
            >
              <option value="">Pilih Supplier (Opsional)</option>
              {suppliers.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.label}
                </option>
              ))}
            </select>
            <Image
              aria-hidden="true"
              alt=""
              src="/images/bahan-baku/chevron-down.svg"
              width={16}
              height={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            />
          </span>
        </FormField>

        {/* Penerimaan Bahan Baku */}
        <FormField
          label="Tanggal Penerimaan"
          htmlFor="receipt-date"
        >
          <input
            id="receipt-date"
            name="receiptDate"
            type="date"
            className={fieldClassName}
          />
        </FormField>
      </div>

      <div className="mt-5">
        <FormField
          label="Keterangan Penerimaan (Opsional)"
          htmlFor="receipt-note"
        >
          <input
            id="receipt-note"
            name="receiptNote"
            type="text"
            placeholder="Contoh: Kondisi baik dan segar dari supplier"
            className={fieldClassName}
          />
        </FormField>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-[9px] px-[20px] text-[15px] font-bold md:text-[16px]"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Bahan Baku"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/menu-bahan-baku")}
          className="h-11 px-[18px] text-[15px] md:text-[16px]"
        >
          Batal
        </Button>
      </div>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
