import { getPageContentOptions } from "#/common/api/content-api";
import { EnvironmentsPage } from "#/modules/environments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/environments/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPageContentOptions("environments")),
  component: EnvironmentsPage,
});
