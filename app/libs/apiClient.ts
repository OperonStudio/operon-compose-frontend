import { createClient } from "@operonstudio/request";
import { withAuth, withLogger } from "@operonstudio/request/middleware";

export const operonApiClient = createClient({
  baseURL: "",
});

/**
 * The console reads its own page copy through the public delivery API, which
 * authenticates with a project key. Every other call is authenticated by the
 * session cookie and scoped by ids in the path.
 *
 * Nothing else is attached here: `x-workspace-id` and `x-environment-id` used
 * to be sent on every request, but no handler ever read them — they only cost a
 * CORS preflight, because a custom header makes the request non-simple.
 */
operonApiClient.use(async (ctx, next) => {
  const apiKey = import.meta.env.VITE_OPERON_KEY;
  if (apiKey) {
    ctx.request.headers.set("x-Operon-key", apiKey);
  }
  return await next(ctx);
});

operonApiClient.use(
  withAuth({
    refreshUrl: "/api/auth/refresh",
  }),
);

if (import.meta.env.DEV) {
  operonApiClient.use(withLogger());
}
