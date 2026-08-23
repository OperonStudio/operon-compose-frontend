import { ApiKeysPage } from "#/modules/api-keys";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api-keys/")({
  component: ApiKeysPage,
});
