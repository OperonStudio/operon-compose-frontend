import { SettingsPage } from "#/modules/settings";
import { getInvitationsOptions } from "#/modules/settings/team/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/")({
  loader: ({ context: { queryClient } }) =>
    Promise.all([queryClient.ensureQueryData(getInvitationsOptions())]),
  component: SettingsPage,
});
