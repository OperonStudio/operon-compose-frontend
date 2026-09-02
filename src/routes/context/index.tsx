import { ContextPage } from "#/modules/context-module";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/context/")({
  component: ContextPage,
});
