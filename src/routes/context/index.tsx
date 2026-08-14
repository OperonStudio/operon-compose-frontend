import { getPageContentOptions } from "#/common/api/content-api";
import { ContextPage } from "#/modules/context-module";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/context/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPageContentOptions("context")),
  component: ContextPage,
});
