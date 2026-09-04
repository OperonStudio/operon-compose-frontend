import { createFileRoute } from "@tanstack/react-router";
import { ApiKeysPage } from "#/modules/api-keys";

export const Route = createFileRoute("/api-keys/")({
  component: ApiKeysPage,
});
