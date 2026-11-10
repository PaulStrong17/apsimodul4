import Image from "next/image";
import { LoginForm } from "../../components/login-form";

export default function LoginPage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#ecf6fd]">
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/login-background.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[14.5vw] -top-[16.8svh] hidden h-[66.5svh] w-[52.6vw] rounded-br-[18vw] bg-[#0e3861] md:block"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-[3.2svh] -right-[10.6vw] hidden h-[37svh] w-[27.8vw] rounded-full bg-[#092b4f] md:block"
      />

      <header className="relative z-10 flex items-center gap-3 px-6 pt-6 md:absolute md:left-[4.3%] md:top-[5.1%] md:gap-[1.3vw] md:px-0 md:pt-0">
        <Image
          src="/images/onang-mark.png"
          alt=""
          width={58}
          height={54}
          className="h-11 w-12 rounded-[10px] object-cover md:h-[5vh] md:w-[4.03vw] md:rounded-[0.85vw]"
        />
        <div className="leading-tight">
          <p className="text-[12px] font-bold text-[#0e3861] md:text-[clamp(12px,1.25vw,18px)] md:text-white">
            SISTEM INFORMASI PRODUKSI
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-[#61738a] md:mt-0 md:text-[clamp(10px,0.98vw,14px)] md:text-[#add1ed]">
            KERIPIK CABE ONANG
          </p>
        </div>
      </header>

      <section
        aria-label="Selamat datang"
        className="absolute left-[5%] top-[20%] z-10 hidden w-[37%] text-white md:block"
      >
        <h1 className="text-[clamp(2.5rem,4vw,3.625rem)] font-bold leading-[1.3] drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
          Selamat datang
          <br />
          kembali.
        </h1>
      </section>

      <p className="absolute bottom-[13.5%] left-[5%] z-10 hidden text-[clamp(10px,0.98vw,14px)] font-medium text-[#94b8d4] md:block">
        SISTEM INFORMASI PRODUKSI
      </p>

      <section
        aria-labelledby="login-title"
        className="relative z-10 mx-4 mt-8 flex min-h-[520px] flex-col rounded-2xl bg-white px-6 pb-3 pt-8 shadow-[0_16px_35px_rgba(13,31,56,0.1)] sm:mx-auto sm:max-w-[520px] md:absolute md:right-[7.7%] md:top-[8.5svh] md:mx-0 md:mt-0 md:h-[68.2svh] md:min-h-[520px] md:w-[45.1vw] md:max-w-none md:rounded-[1.67vw] md:px-[clamp(36px,3.6vw,52px)] md:pb-[clamp(8px,0.85vw,12px)] md:pt-[clamp(38px,3.75vw,54px)]"
      >
        <h2
          id="login-title"
          className="text-[clamp(24px,2.36vw,34px)] font-bold leading-[1.2] text-[#17263b]"
        >
          Masuk ke akun Anda
        </h2>
        <p className="mt-[clamp(16px,2.05vw,30px)] text-[clamp(13px,1.25vw,18px)] leading-[1.35] text-[#61738a]">
          Gunakan username dan kata sandi yang terdaftar.
        </p>

        <LoginForm />

        <div className="mt-[clamp(18px,2.35vw,34px)] border-t border-[#d9e3ed]" />
        <p className="mt-auto text-center text-[clamp(10px,0.98vw,14px)] leading-[1.4] text-[#94a1b0]">
          © 2026 Sistem Informasi Produksi
        </p>
      </section>
    </main>
  );
}
