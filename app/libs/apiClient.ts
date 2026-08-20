import { getAuthMiddlewareOptions } from "@operonstudio/auth";
import { createClient } from "@operonstudio/request";
import { withLogger, withAuth } from "@operonstudio/request/middleware";

export const operonApiClient = createClient({
  baseURL: import.meta.env.DEV
    ? (import.meta.env.VITE_OPERON_COMPOSE_BACKEND_URL ?? "http://localhost:8080")
    : "",
});

operonApiClient.use(async (ctx, next) => {
  if (typeof window !== "undefined") {
    const workspaceId = localStorage.getItem("operon_active_workspace_id");
    if (workspaceId) {
      ctx.request.headers.set("x-workspace-id", workspaceId);
    }
    const environmentId = localStorage.getItem("operon_active_environment_id");
    if (environmentId) {
      ctx.request.headers.set("x-environment-id", environmentId);
    }
  }
  return await next(ctx);
});

operonApiClient.use(
  withAuth({
    ...getAuthMiddlewareOptions({
      refreshUrl: "/api/auth/refresh",
    }),
    strict: false,
  })
);

if (import.meta.env.DEV) {
  operonApiClient.use(withLogger());
}
