import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const roleDestinations: Record<string, string> = {
  admin: "/menu-bahan-baku",
  owner: "/owner",
  karyawan_produksi: "/karyawan-produksi",
  karyawan_qc: "/karyawan-qc",
};

function matchesPassword(storedPassword: string, submittedPassword: string) {
  if (/^[0-9a-f]{32}$/i.test(storedPassword)) {
    const storedHash = Buffer.from(storedPassword, "hex");
    const submittedHash = createHash("md5")
      .update(submittedPassword)
      .digest();

    return timingSafeEqual(storedHash, submittedHash);
  }

  const stored = Buffer.from(storedPassword);
  const submitted = Buffer.from(submittedPassword);
  return (
    stored.length === submitted.length && timingSafeEqual(stored, submitted)
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("username" in body) ||
    !("password" in body) ||
    typeof body.username !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      { error: "Username dan kata sandi wajib diisi." },
      { status: 400 },
    );
  }

  const username = body.username.trim();
  const password = body.password;
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username dan kata sandi wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.pengguna.findUnique({
      where: { username },
      select: {
        id_pengguna: true,
        username: true,
        password: true,
        role: true,
        status_aktif: true,
      },
    });

    if (!user || !user.status_aktif || !matchesPassword(user.password, password)) {
      return NextResponse.json(
        { error: "Username atau kata sandi salah." },
        { status: 401 },
      );
    }

    const role = user.role.trim().toLocaleLowerCase().replace(/[\s-]+/g, "_");
    const redirectTo = roleDestinations[role];
    if (!redirectTo) {
      return NextResponse.json(
        { error: "Peran akun belum didukung untuk masuk." },
        { status: 403 },
      );
    }

    await createAuthSession({
      userId: user.id_pengguna,
      username: user.username,
      role,
    });

    return NextResponse.json({ redirectTo });
  } catch (error) {
    console.error("Login request failed:", error);
    return NextResponse.json(
      { error: "Login tidak dapat diproses saat ini." },
      { status: 500 },
    );
  }
}
