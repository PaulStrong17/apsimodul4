import Link from "next/link";

type MaterialActionSuccessCardProps = {
  action: "updated" | "deleted";
  code: string;
};

const successCopy = {
  updated: {
    title: "Bahan Baku Berhasil Diperbarui!",
    description: (code: string) =>
      `Bahan baku ${code} telah berhasil diperbarui.`,
  },
  deleted: {
    title: "Bahan Baku Berhasil Dihapus!",
    description: (code: string) => `Bahan baku ${code} telah berhasil dihapus.`,
  },
};

export function MaterialActionSuccessCard({
  action,
  code,
}: MaterialActionSuccessCardProps) {
  const copy = successCopy[action];

  return (
    <section
      aria-labelledby="success-title"
      className="relative flex h-[352px] w-full max-w-[620px] flex-col items-center rounded-[14px] border border-[#d6e3ed] bg-white"
    >
      <div
        aria-hidden="true"
        className="absolute top-8 flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#87de9b] md:top-10"
      >
        <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
          <path
            d="m11 24 9 9 18-19"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2
        id="success-title"
        className="absolute top-[calc(50%-9px)] w-[calc(100%-32px)] text-center text-[20px] font-bold leading-normal text-[#17263b] md:text-[24px]"
      >
        {copy.title}
      </h2>
      <p className="absolute top-[213px] w-[calc(100%-32px)] text-center text-[14px] leading-normal text-[#61738a] md:text-[17px]">
        {copy.description(code)}
      </p>
      <Link
        href="/menu-bahan-baku"
        className="absolute top-[269px] inline-flex h-11 items-center justify-center rounded-[9px] bg-[#28a745] px-[18px] text-center text-[14px] font-bold text-white transition-colors hover:bg-[#218838] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#218838] md:text-[17px]"
      >
        Kembali ke Menu Bahan Baku
      </Link>
    </section>
  );
}
