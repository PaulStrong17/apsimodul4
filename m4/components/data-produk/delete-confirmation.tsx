"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminProduct } from "./data";

export function ProductDeleteConfirmation({
  product,
}: {
  product: AdminProduct;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteProduct() {
    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/produk/${encodeURIComponent(product.code)}`,
        { method: "DELETE" },
      );
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Produk tidak dapat dihapus.");
        return;
      }

      router.replace(
        `/data-produk/hapus/berhasil/${encodeURIComponent(product.code)}`,
      );
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section
      aria-labelledby="delete-title"
      className="relative z-10 flex min-h-[300px] w-full max-w-[620px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white px-6 py-7 text-center shadow-[0_3px_8px_rgba(0,0,0,0.16)] md:min-h-[352px] md:pt-10"
    >
      <div
        aria-hidden="true"
        className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#fff0d6] text-[42px] font-bold leading-none text-[#e5a528] md:h-[96px] md:w-[96px]"
      >
        !
      </div>
      <h2
        id="delete-title"
        className="mt-5 text-[20px] font-bold text-[#17263b] md:text-[24px]"
      >
        Hapus Produk?
      </h2>
      <p className="mt-2 max-w-[460px] text-[14px] leading-[1.5] text-[#61738a] md:text-[17px]">
        Apakah Anda yakin ingin menghapus produk{" "}
        <span className="font-bold text-[#17263b]">{product.name}</span> (
        {product.code})? Tindakan ini tidak dapat dibatalkan.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/data-produk/hapus"
          className="inline-flex h-11 items-center justify-center rounded-[9px] border border-[#d6e3ed] bg-white px-[18px] text-[15px] font-semibold text-[#0a3d62] transition-colors hover:bg-[#f6f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] md:text-[17px]"
        >
          Batal
        </Link>
        <button
          type="button"
          disabled={isDeleting}
          onClick={deleteProduct}
          className="inline-flex h-11 items-center justify-center rounded-[9px] bg-[#b82926] px-[18px] text-[15px] font-semibold text-white transition-colors hover:bg-[#9d201e] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b82926] md:text-[17px]"
        >
          {isDeleting ? "Menghapus..." : "Ya, Hapus"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="mt-4 max-w-[460px] text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}
