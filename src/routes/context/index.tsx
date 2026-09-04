import { createFileRoute } from "@tanstack/react-router";
import { ContextPage } from "#/modules/context-module";

export const Route = createFileRoute("/context/")({
  component: ContextPage,
});
