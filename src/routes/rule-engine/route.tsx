import { createFileRoute } from "@tanstack/react-router";
import { RuleEngineLayout } from "#/modules/rule-engine";

export const Route = createFileRoute("/rule-engine")({
  component: RuleEngineLayout,
});
