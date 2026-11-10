import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function getOwnerFromSession() {
  const session = await getAuthSession();
  if (session && session.role === "owner") {
    const owner = await prisma.owner.findFirst({
      where: { id_pengguna: session.userId },
      include: { pengguna: true },
    });
    if (owner) return owner;
  }

  // Fallback to first owner in DB (default 'OW01') for smooth development / pairing
  const defaultOwner = await prisma.owner.findFirst({
    orderBy: { id_owner: "asc" },
    include: { pengguna: true },
  });
  return defaultOwner;
}

export async function requireOwnerApi() {
  const session = await getAuthSession();
  if (!session) {
    // If no session but development owner exists, fallback gracefully
    const fallbackOwner = await prisma.owner.findFirst({
      orderBy: { id_owner: "asc" },
      select: { id_owner: true },
    });
    if (fallbackOwner) {
      return { ownerId: fallbackOwner.id_owner };
    }

    return {
      error: NextResponse.json(
        { error: "Silakan masuk terlebih dahulu." },
        { status: 401 },
      ),
    };
  }

  if (session.role !== "owner" && session.role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Akses Owner diperlukan." },
        { status: 403 },
      ),
    };
  }

  const owner = await prisma.owner.findFirst({
    where: { id_pengguna: session.userId },
    select: { id_owner: true },
  });

  if (!owner) {
    const fallbackOwner = await prisma.owner.findFirst({
      orderBy: { id_owner: "asc" },
      select: { id_owner: true },
    });
    if (fallbackOwner) {
      return { ownerId: fallbackOwner.id_owner };
    }

    return {
      error: NextResponse.json(
        { error: "Akun belum terhubung ke data Owner." },
        { status: 403 },
      ),
    };
  }

  return { ownerId: owner.id_owner };
}

export async function requireOwnerPage() {
  const session = await getAuthSession();
  if (session && session.role === "owner") {
    const owner = await prisma.owner.findFirst({
      where: { id_pengguna: session.userId },
      include: { pengguna: true },
    });
    if (owner) return owner;
  }

  const fallbackOwner = await prisma.owner.findFirst({
    orderBy: { id_owner: "asc" },
    include: { pengguna: true },
  });

  if (!fallbackOwner) {
    redirect("/login");
  }

  return fallbackOwner;
}
