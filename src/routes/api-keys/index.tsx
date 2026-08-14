import { getPageContentOptions } from "#/common/api/content-api";
import { ApiKeysPage } from "#/modules/api-keys";
import { getApiKeysOptions } from "#/modules/api-keys/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api-keys/")({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(getApiKeysOptions()),
      queryClient.ensureQueryData(getPageContentOptions("api-keys")),
    ]),
  component: ApiKeysPage,
});
