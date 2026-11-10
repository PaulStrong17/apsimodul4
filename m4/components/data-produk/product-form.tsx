"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { AdminProduct } from "./data";
import { Button } from "../ui/button";

const fieldClassName =
  "h-12 w-full rounded-[10px] border border-[#d9e3ed] bg-white px-[10px] text-[16px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[17px]";

type ProductFormProps = {
  mode: "add" | "edit";
  product?: AdminProduct;
};

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = mode === "edit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const code = isEdit ? product?.code : String(formData.get("kode") ?? "").trim();

    if (!code) {
      setError("Kode produk wajib diisi.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        isEdit
          ? `/api/admin/produk/${encodeURIComponent(code)}`
          : "/api/admin/produk",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            name: formData.get("nama"),
            variation: formData.get("varian"),
            stock: formData.get("stok"),
            recipe: formData.get("resep"),
          }),
        },
      );
      const result: { code?: string; error?: string } = await response.json();

      if (!response.ok || (!isEdit && !result.code)) {
        setError(
          result.error ??
            (isEdit
              ? "Produk tidak dapat diperbarui."
              : "Produk tidak dapat disimpan."),
        );
        return;
      }

      const savedCode = result.code ?? code;
      router.replace(
        isEdit
          ? `/data-produk/update/berhasil/${encodeURIComponent(savedCode)}`
          : `/data-produk/tambah/berhasil/${encodeURIComponent(savedCode)}`,
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
      className={`relative z-10 flex w-full max-w-[900px] flex-col gap-6 rounded-[clamp(38px,4.65vw,67px)] border border-[#d6e3ed] bg-[linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)),linear-gradient(90deg,rgba(255,255,255,0.26),rgba(255,255,255,0.26))] p-[clamp(18px,1.6vw,23px)] shadow-[0_3px_4px_rgba(0,0,0,0.45)] ${
        isEdit ? "md:min-h-[621px]" : ""
      }`}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] font-bold leading-[1.5] text-[#17263b] md:text-[20px]">
          {isEdit ? "Form Perbarui Produk" : "Form Data Produk"}
        </h2>
        {isEdit ? (
          <p className="text-[13px] leading-[1.5] text-[#61738a]">
            Periksa nilai sebelum menyimpan perubahan.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
        {!isEdit ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="kode" className="text-[14px] font-bold text-[#17263b] md:text-[16px]">
              Kode Produk *
            </label>
            <input
              id="kode"
              name="kode"
              required
              maxLength={10}
              autoComplete="off"
              placeholder="Contoh: P03"
              className={fieldClassName}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label htmlFor="kode" className="text-[14px] font-bold text-[#17263b] md:text-[16px]">
              Kode Produk
            </label>
            <input
              id="kode"
              name="kode"
              value={product?.code ?? ""}
              readOnly
              className={fieldClassName}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="nama" className="text-[14px] font-bold text-[#17263b] md:text-[16px]">
            Nama Produk *
          </label>
          <input
            id="nama"
            name="nama"
            required
            maxLength={100}
            defaultValue={product?.name}
            autoComplete="off"
            placeholder="Masukkan nama produk"
            className={fieldClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="varian" className="text-[14px] font-bold text-[#17263b] md:text-[16px]">
            Varian *
          </label>
          <input
            id="varian"
            name="varian"
            required
            maxLength={50}
            defaultValue={product?.variation}
            autoComplete="off"
            placeholder="Masukkan varian produk"
            className={fieldClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="stok" className="text-[14px] font-bold text-[#17263b] md:text-[16px]">
            Stok Produk *
          </label>
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            max="2147483647"
            step="1"
            required
            defaultValue={product?.stock}
            placeholder="Masukkan jumlah stok"
            className={fieldClassName}
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="resep" className="text-[14px] font-bold text-[#17263b] md:text-[16px]">
            Resep Produk *
          </label>
          <textarea
            id="resep"
            name="resep"
            required
            maxLength={255}
            defaultValue={product?.recipe}
            placeholder="Masukkan resep produk"
            className="min-h-[88px] w-full resize-y rounded-[10px] border border-[#d9e3ed] bg-white px-[10px] py-3 text-[16px] leading-[1.5] text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[17px]"
          />
        </div>
      </div>

      <div className={`flex flex-wrap items-start gap-3 pt-1 ${isEdit ? "mt-auto" : ""}`}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-[9px] px-[18px] text-[15px] md:text-[17px]"
        >
          {isSubmitting
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Simpan Data"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/menu-data-produk")}
          className="h-11 px-[18px] text-[15px] md:text-[17px]"
        >
          Batal
        </Button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
