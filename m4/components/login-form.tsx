"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { TextInput } from "./ui/text-input";

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-[14px] w-[14px]"
    >
      <rect
        x="2.5"
        y="4.5"
        width="15"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="m3.5 6 6.5 4.8L16.5 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VisibilityIcon({ visible }: { visible: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-[16px] w-[16px]"
    >
      <path
        d="M2.5 10s2.7-4.5 7.5-4.5 7.5 4.5 7.5 4.5-2.7 4.5-7.5 4.5S2.5 10 2.5 10Z"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      <circle
        cx="10"
        cy="10"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.35"
      />
      {visible ? (
        <path
          d="m4 16 12-12"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-[17px] w-[17px]"
    >
      <path
        d="M4.5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const result: { error?: string; redirectTo?: string } =
        await response.json();

      if (!response.ok || !result.redirectTo) {
        setError(result.error ?? "Login tidak berhasil.");
        return;
      }

      router.replace(result.redirectTo);
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
      className="mt-6 flex flex-col md:mt-[clamp(20px,2.57vw,37px)]"
    >
      <TextInput
        id="username"
        name="username"
        label="Username"
        type="text"
        autoComplete="username"
        placeholder="Masukkan username"
        trailing={<MailIcon />}
      />
      <div className="mt-3 md:mt-[clamp(10px,1.32vw,19px)]">
        <TextInput
          id="password"
          name="password"
          label="Kata sandi"
          type={passwordVisible ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Masukkan username"
          trailing={
            <button
              type="button"
              onClick={() => setPasswordVisible((visible) => !visible)}
              aria-label={
                passwordVisible
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
              aria-pressed={passwordVisible}
              className="flex items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0a3d62]"
            >
              <VisibilityIcon visible={passwordVisible} />
            </button>
          }
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="relative mt-[52px] h-10 w-full px-4 text-[13px] md:mt-[clamp(48px,5.2vw,75px)] md:h-[clamp(40px,3.89vw,56px)] md:text-[clamp(12px,1.25vw,18px)]"
      >
        {isSubmitting ? "Memeriksa..." : "Masuk ke Dashboard"}
        <span className="absolute right-4 inline-flex items-center md:right-[clamp(12px,1.3vw,19px)]">
          <ArrowRightIcon />
        </span>
      </Button>
      {error ? (
        <p role="alert" className="mt-3 text-center text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}
