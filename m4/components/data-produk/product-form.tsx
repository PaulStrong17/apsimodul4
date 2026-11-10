"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import type { Product } from "./data";
import { Button } from "../ui/button";

const fieldClassName =
  "h-12 w-full rounded-[10px] border border-[#d9e3ed] bg-white px-[6px] text-[17px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10";

type ProductFormProps = {
  mode: "add" | "edit";
  product?: Product;
};

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = isEdit ? product?.code : "PRD-006";
    if (!code) {
      throw new Error("Kode produk tidak tersedia untuk proses pembaruan.");
    }

    router.push(
      isEdit
        ? `/data-produk/update/berhasil/${encodeURIComponent(code)}`
        : `/data-produk/tambah/berhasil/${encodeURIComponent(code)}`,
    );
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
        <div className="flex flex-col gap-2">
          <label
            htmlFor="nama"
            className="text-[14px] font-bold leading-[1.2] text-[#17263b] md:text-[16px]"
          >
            Nama Produk *
          </label>
          <input
            id="nama"
            name="nama"
            required
            defaultValue={product?.name}
            autoComplete="off"
            placeholder="Masukkan nama produk"
            className={`${fieldClassName} ${
              isEdit ? "text-[17px]" : "text-[18px]"
            }`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="variasi"
            className="text-[14px] font-bold leading-[1.2] text-[#17263b] md:text-[16px]"
          >
            Variasi
          </label>
          <input
            id="variasi"
            name="variasi"
            defaultValue={product?.variation}
            autoComplete="off"
            placeholder="Masukkan variasi"
            className={`${fieldClassName} ${
              isEdit ? "text-[17px]" : "text-[18px]"
            }`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="stok"
            className="text-[14px] font-bold leading-[1.2] text-[#17263b] md:text-[16px]"
          >
            Stok Produk *
          </label>
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product?.stock}
            placeholder="Masukkan jumlah stok"
            className={`${fieldClassName} ${
              isEdit ? "text-[17px]" : "text-[18px]"
            }`}
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="resep"
            className="mb-2 block text-[14px] font-bold leading-[1.2] text-[#17263b] md:text-[16px]"
          >
            Resep Produk *
          </label>
          <textarea
            id="resep"
            name="resep"
            required
            maxLength={255}
            placeholder="Masukkan resep produk"
            className="h-[88px] w-full resize-y rounded-[10px] border border-[#d9e3ed] bg-white px-[6px] py-3 text-[18px] leading-[1.5] text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10"
          />
        </div>
      </div>

      <div
        className={`flex h-12 flex-wrap items-start gap-3 pt-1 ${
          isEdit ? "mt-auto" : ""
        }`}
      >
        <Button
          type="submit"
          className="h-11 rounded-[9px] px-[18px] text-[15px] md:text-[17px]"
        >
          {isEdit ? "Simpan Perubahan" : "Simpan Data"}
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
    </form>
  );
}
