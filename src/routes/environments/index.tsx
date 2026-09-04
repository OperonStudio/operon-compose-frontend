import { createFileRoute } from "@tanstack/react-router";
import { EnvironmentsPage } from "#/modules/environments";

export const Route = createFileRoute("/environments/")({
  component: EnvironmentsPage,
});
