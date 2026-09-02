import { SettingsPage } from "#/modules/settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});
