import { EnvironmentsPage } from "#/modules/environments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/environments/")({
  component: EnvironmentsPage,
});
