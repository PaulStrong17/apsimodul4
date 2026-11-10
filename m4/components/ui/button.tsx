import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-[9px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a3d62] disabled:cursor-not-allowed disabled:opacity-60 ${
        variant === "secondary"
          ? "border border-[#d6e3ed] bg-white text-[#0a3d62] hover:bg-[#f6f9fc]"
          : variant === "danger"
            ? "bg-[#b82926] text-white hover:bg-[#9d201e]"
          : "bg-[#0a3d62] text-white hover:bg-[#083451]"
      } ${className}`}
      {...props}
    />
  );
}
