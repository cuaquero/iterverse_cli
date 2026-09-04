// Gates the whole app behind a valid, entitlement-checked session - see
// src/routes/auth/access/+server.js for how that session gets created.
// SvelteKit has one server hook, not per-folder Pages Functions
// middleware (emu_print/Simulations' pattern), so the equivalent guard
// lives here instead of a _middleware.js per subtree.
import { getSessionUser } from "$lib/server/session";

const PUBLIC_PATHS = ["/auth/access", "/no-access"];

export async function handle({ event, resolve }) {
  if (PUBLIC_PATHS.some((path) => event.url.pathname.startsWith(path))) {
    return resolve(event);
  }

  // `event.platform.env` only exists when this runs through Cloudflare
  // (wrangler dev / a real deploy) - `npm run dev` is plain `vite dev`
  // with no Worker runtime at all, so there's no Access/session to check
  // against. Skip the gate rather than 500 on every request; the gate
  // itself can only be verified for real via `wrangler dev` or a deploy,
  // same limitation iterverse_hub's own README notes for Access-fronted
  // routes.
  const env = event.platform?.env;
  if (!env) return resolve(event);

  const user = await getSessionUser(event.request, env);
  if (!user) {
    const redirect = encodeURIComponent(event.url.pathname + event.url.search);
    return Response.redirect(`${event.url.origin}/auth/access?redirect=${redirect}`, 302);
  }

  event.locals.user = user;
  return resolve(event);
}
