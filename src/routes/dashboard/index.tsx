import { getPageContentOptions } from "#/common/api/content-api";
import { DashboardPage } from "#/modules/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(getPageContentOptions("dashboard")),
  component: DashboardPage,
});
