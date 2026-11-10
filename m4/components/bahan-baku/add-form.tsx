"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

const fieldClassName =
  "h-12 w-full rounded-[10px] border border-[#d9e3ed] bg-white px-[10px] text-[16px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] focus:border-[#0a3d62] focus:ring-2 focus:ring-[#0a3d62]/10 md:text-[17px]";

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
        className="text-[14px] font-bold leading-[1.2] text-[#17263b] md:text-[16px]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function BahanBakuAddForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      className="relative z-10 w-full max-w-[900px] rounded-[30px] border border-[#d6e3ed] bg-[linear-gradient(90deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)),linear-gradient(90deg,rgba(255,255,255,0.26),rgba(255,255,255,0.26))] p-[18px] shadow-[0_3px_4px_rgba(0,0,0,0.45)] md:min-h-[621px] md:rounded-[clamp(38px,4.65vw,67px)] md:p-[clamp(18px,1.6vw,23px)]"
    >
      <h2 className="text-[18px] font-bold leading-[1.5] text-[#17263b] md:text-[20px]">
        Form Data Bahan Baku
      </h2>

      <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-5 md:mt-[clamp(36px,3.54vw,51px)] md:grid-cols-2 md:gap-y-[26px]">
        <FormField label="Nama Bahan Baku *" htmlFor="nama">
          <input
            id="nama"
            name="nama"
            type="text"
            autoComplete="off"
            placeholder="Masukkan nama bahan baku"
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
            placeholder="Contoh: BB-007"
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

        <FormField label="Stok *" htmlFor="stok">
          <input
            id="stok"
            name="stok"
            type="number"
            min="0"
            step="any"
            placeholder="Masukkan jumlah stok"
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
            placeholder="Masukkan batas minimum stok"
            required
            className={fieldClassName}
          />
        </FormField>

      </div>

      <div className="mt-6 flex items-center gap-3 md:mt-[26px]">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-[9px] px-[18px] text-[15px] md:text-[17px]"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/menu-bahan-baku")}
          className="h-11 px-[18px] text-[15px] md:text-[17px]"
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
