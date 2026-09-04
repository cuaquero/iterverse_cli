import { clearCookieHeader, destroySession, SESSION_COOKIE } from "$lib/server/session";

export async function POST({ request, platform }) {
  await destroySession(request, platform.env);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/auth/access",
      "Set-Cookie": clearCookieHeader(SESSION_COOKIE),
    },
  });
}
