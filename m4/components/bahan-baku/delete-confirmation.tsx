"use client";

import { useRouter } from "next/navigation";
import type { BahanBaku } from "./data";
import { Button } from "../ui/button";

export function BahanBakuDeleteConfirmation({
  material,
}: {
  material: BahanBaku;
}) {
  const router = useRouter();

  return (
    <section
      aria-labelledby="delete-title"
      className="relative h-[376px] w-full max-w-[620px] rounded-[14px] border border-[#d6e3ed] bg-white"
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[67px] flex h-[110px] w-[110px] -translate-x-1/2 items-center justify-center rounded-full bg-[#ffe3e3]"
      >
        <span className="text-[36px] font-bold leading-none text-[#9c660d]">
          !
        </span>
      </div>
      <h2
        id="delete-title"
        className="absolute left-1/2 top-[183px] w-[calc(100%-32px)] -translate-x-1/2 text-center text-[23px] font-bold leading-normal text-[#17263b] md:text-[26px]"
      >
        Hapus bahan baku?
      </h2>
      <p className="absolute left-1/2 top-[217px] w-[calc(100%-32px)] -translate-x-1/2 text-center text-[14px] leading-normal text-[#61738a] md:text-[17px]">
        Data yang dihapus tidak dapat dikembalikan.
      </p>
      <div className="absolute inset-x-5 top-[275px] flex flex-wrap justify-center gap-3 md:inset-x-[90px] md:gap-7">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/bahan-baku/hapus")}
          className="h-[46px] min-w-[150px] px-5 text-[16px] md:w-[180px] md:px-0 md:text-[17px]"
        >
          Batal
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() =>
            router.push(`/bahan-baku/hapus/berhasil/${material.code}`)
          }
          className="h-[46px] min-w-[150px] px-5 text-[16px] md:w-[220px] md:px-0 md:text-[17px]"
        >
          Ya, Hapus
        </Button>
      </div>
    </section>
  );
}
