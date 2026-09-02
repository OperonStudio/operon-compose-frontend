import { FlowPage } from "#/modules/flow";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/flow/")({
  component: FlowPage,
});
