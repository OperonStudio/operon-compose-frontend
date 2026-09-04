import { createFileRoute } from "@tanstack/react-router";
import { FlowPage } from "#/modules/flow";

export const Route = createFileRoute("/flow/")({
  component: FlowPage,
});
