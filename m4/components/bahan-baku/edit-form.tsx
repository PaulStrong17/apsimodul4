"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { AdminBahanBaku } from "./data";
import { Button } from "../ui/button";
import type { MaterialFormOptions } from "@/lib/admin/materials";

const fieldClassName =
  "h-12 w-full rounded-[10px] border border-[#d9e3ed] bg-white px-[10px] text-[15px] leading-normal text-[#17263b] outline-none focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[16px]";

function EditField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[14px] font-bold leading-[1.2] text-[#17263b] md:text-[15px]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function BahanBakuEditForm({
  material,
  options,
}: {
  material: AdminBahanBaku;
  options?: MaterialFormOptions;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suppliers = options?.suppliers ?? [];
  const recipes = options?.recipes ?? [];
  const initialRecipeCode = material.recipes?.[0]?.recipeCode ?? "";
  const initialSupplierCode = material.receipts?.[0]?.supplierCode ?? "";
  const initialReceiptDate = material.receipts?.[0]?.receiptDate ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `/api/admin/bahan-baku/${encodeURIComponent(material.code)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
        },
      );
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Bahan baku tidak dapat diperbarui.");
        return;
      }

      router.replace(
        `/bahan-baku/update/berhasil/${encodeURIComponent(material.code)}`,
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
          Form Edit Bahan Baku
        </h2>
        <p className="text-[13px] text-[#61738a] md:text-[14px]">
          Perbarui data {material.code} • {material.name} beserta resep dan riwayat penerimaan supplier.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <EditField id="nama" label="Nama Bahan Baku *">
          <input
            id="nama"
            name="nama"
            type="text"
            defaultValue={material.name}
            autoComplete="off"
            required
            maxLength={100}
            className={fieldClassName}
          />
        </EditField>

        <EditField id="kode" label="Kode Bahan Baku *">
          <input
            id="kode"
            name="kode"
            type="text"
            value={material.code}
            readOnly
            className={`${fieldClassName} bg-[#f6f9fc] text-[#61738a]`}
          />
        </EditField>

        <EditField id="satuan" label="Satuan *">
          <span className="relative block">
            <select
              id="satuan"
              name="satuan"
              defaultValue={material.unit}
              required
              className={`${fieldClassName} appearance-none pr-10`}
            >
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
        </EditField>

        <EditField id="stok" label="Stok *">
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            step="any"
            defaultValue={material.stock}
            required
            className={fieldClassName}
          />
        </EditField>

        <EditField id="stok-minimum" label="Stok Minimum *">
          <input
            id="stok-minimum"
            name="stokMinimum"
            type="number"
            min="0"
            step="any"
            defaultValue={material.minimumStock}
            required
            className={fieldClassName}
          />
        </EditField>

        {/* Resep */}
        <EditField id="recipe-id" label="Resep Produk">
          <span className="relative block">
            <select
              id="recipe-id"
              name="recipeId"
              defaultValue={initialRecipeCode}
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
        </EditField>

        {/* Supplier */}
        <EditField id="supplier-id" label="Supplier">
          <span className="relative block">
            <select
              id="supplier-id"
              name="supplierId"
              defaultValue={initialSupplierCode}
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
        </EditField>

        {/* Penerimaan Bahan Baku */}
        <EditField id="receipt-date" label="Tanggal Penerimaan">
          <input
            id="receipt-date"
            name="receiptDate"
            type="date"
            defaultValue={initialReceiptDate}
            className={fieldClassName}
          />
        </EditField>
      </div>

      <div className="mt-5">
        <EditField id="receipt-note" label="Keterangan Penerimaan (Opsional)">
          <input
            id="receipt-note"
            name="receiptNote"
            type="text"
            placeholder="Keterangan kondisi penerimaan bahan baku"
            className={fieldClassName}
          />
        </EditField>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-[9px] px-[20px] text-[15px] font-bold md:text-[16px]"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/bahan-baku/update")}
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
