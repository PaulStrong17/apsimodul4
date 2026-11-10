import type { InputHTMLAttributes, ReactNode } from "react";

type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id"
> & {
  id: string;
  label: string;
  trailing?: ReactNode;
};

export function TextInput({
  id,
  label,
  trailing,
  ...inputProps
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-[5px] md:gap-[clamp(4px,0.42vw,6px)]">
      <label
        htmlFor={id}
        className="text-[13px] font-semibold leading-[1.2] text-[#17263b] md:text-[clamp(12px,1.18vw,17px)]"
      >
        {label}
      </label>
      <span className="relative block h-10 rounded-[9px] border border-[#d9e3ed] bg-white focus-within:border-[#0a3d62] focus-within:ring-2 focus-within:ring-[#0a3d62]/10 md:h-[clamp(40px,3.89vw,56px)]">
        <input
          id={id}
          className="h-full w-full rounded-[9px] bg-transparent px-3 pr-10 text-[13px] leading-normal text-[#17263b] outline-none placeholder:text-[#8c99a8] md:px-[clamp(10px,1vw,14px)] md:pr-[clamp(32px,3vw,44px)] md:text-[clamp(12px,1.25vw,18px)]"
          {...inputProps}
        />
        {trailing ? (
          <span className="absolute inset-y-0 right-3 flex items-center text-[#61738a] md:right-[clamp(10px,1vw,14px)]">
            {trailing}
          </span>
        ) : null}
      </span>
    </div>
  );
}
