import { NextResponse } from "next/server";
import {
  clearAuthSession,
  getAuthSession,
} from "@/lib/auth/session";

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      username: session.username,
      role: session.role,
    },
  });
}

export async function DELETE() {
  await clearAuthSession();
  return NextResponse.json({ success: true });
}
