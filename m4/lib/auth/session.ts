import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const sessionCookieName = "apsi-session";
const sessionDurationSeconds = 60 * 60 * 8;

export type AuthSession = {
  userId: string;
  username: string;
  role: string;
  expiresAt: number;
};

function getSessionSecret() {
  return (
    process.env.SESSION_SECRET ||
    "apsi-production-secret-key-fallback-2026-cabe-onang"
  );
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function encodeSession(session: AuthSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token: string): AuthSession | null {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AuthSession;
    if (
      typeof session.userId !== "string" ||
      typeof session.username !== "string" ||
      typeof session.role !== "string" ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function createAuthSession(user: Omit<AuthSession, "expiresAt">) {
  const expiresAt = Date.now() + sessionDurationSeconds * 1000;
  const cookieStore = await cookies();

  cookieStore.set(
    sessionCookieName,
    encodeSession({ ...user, expiresAt }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDurationSeconds,
    },
  );
}

export async function getAuthSession() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  return token ? decodeSession(token) : null;
}

export async function clearAuthSession() {
  (await cookies()).delete(sessionCookieName);
}
