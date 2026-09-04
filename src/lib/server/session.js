// Session cookie + KV-backed session store, same trimmed-down shape as
// emu_print's functions/_lib/session.js (Simulations): no userId/name/
// role/D1 user record, just "is this email currently signed in with an
// entitlement-checked session."
//
// Short-lived on purpose, same reasoning as Reader/Simulations: this app
// has no standing "disable this account" mechanism of its own, so
// access-while-enrolled is enforced by forcing periodic re-auth (through
// Access OTP + a fresh roster entitlement check) rather than a long-lived
// grant that could outlive a revoked enrollment.

export const SESSION_COOKIE = "cli_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours, matches Reader/Simulations

export function readCookie(request, name) {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function setCookieHeader(name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${opts.path ?? "/"}`, "HttpOnly", "Secure", "SameSite=Lax"];
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`);
  return parts.join("; ");
}

export function clearCookieHeader(name, path = "/") {
  return `${name}=; Path=${path}; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function createSession(env, email) {
  const sessionId = crypto.randomUUID();
  await env.SESSIONS.put(`session:${sessionId}`, JSON.stringify({ email }), {
    expirationTtl: SESSION_TTL_SECONDS,
  });
  return sessionId;
}

export async function getSessionUser(request, env) {
  const sessionId = readCookie(request, SESSION_COOKIE);
  if (!sessionId) return null;
  const raw = await env.SESSIONS.get(`session:${sessionId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function destroySession(request, env) {
  const sessionId = readCookie(request, SESSION_COOKIE);
  if (sessionId) await env.SESSIONS.delete(`session:${sessionId}`);
}
