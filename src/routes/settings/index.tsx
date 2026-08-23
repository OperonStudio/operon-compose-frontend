import { SettingsPage } from "#/modules/settings";
import { getInvitationsOptions } from "#/modules/settings/team/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});
