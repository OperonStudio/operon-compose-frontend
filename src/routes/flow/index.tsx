import { getPageContentOptions } from "#/common/api/content-api";
import { FlowPage } from "#/modules/flow";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/flow/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPageContentOptions("flow")),
  component: FlowPage,
});
