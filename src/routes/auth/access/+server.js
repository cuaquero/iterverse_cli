// Sign-in via Iterverse's platform auth (Cloudflare Access, One-Time PIN),
// same pattern as emu_print's functions/api/auth/access.js (Simulations)
// and koodo-bridge's functions/api/auth/access.ts (Reader). This route is
// expected to sit behind a Cloudflare Access Application of its own,
// scoped to /auth/access* only - hitting it at all is what makes Access
// run its OTP challenge before the request ever reaches this handler. By
// the time we see the request, Access has already authenticated the
// visitor and attached the signed assertion; this just verifies that
// assertion properly rather than trusting the plain
// Cf-Access-Authenticated-User-Email header on its own.
import { verifyAccessJwt } from "$lib/server/access";
import { createSession, setCookieHeader, SESSION_COOKIE, SESSION_TTL_SECONDS } from "$lib/server/session";

async function checkRosterEntitlement(env, email) {
  const response = await fetch(`${env.ROSTER_API_URL}/api/entitlement/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ROSTER_SERVICE_KEY}`,
    },
    body: JSON.stringify({ email, product: "cli" }),
  });
  if (!response.ok) return false;
  const data = await response.json().catch(() => ({ entitled: false }));
  return data.entitled === true;
}

// Only a same-origin relative path is allowed here, never an absolute
// URL or a protocol-relative "//host" - this value comes straight from a
// query param on an otherwise-public redirect target.
function safeRedirectPath(raw) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export async function GET({ request, url, platform }) {
  const redirectTo = safeRedirectPath(url.searchParams.get("redirect"));
  const env = platform.env;

  const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
  const email = jwt ? await verifyAccessJwt(jwt, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD) : null;
  if (!email) {
    return new Response("Sign-in required.", { status: 403 });
  }

  const entitled = await checkRosterEntitlement(env, email);
  if (!entitled) {
    return new Response(null, { status: 302, headers: { Location: "/no-access" } });
  }

  const sessionId = await createSession(env, email);

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": setCookieHeader(SESSION_COOKIE, sessionId, { maxAge: SESSION_TTL_SECONDS }),
    },
  });
}
