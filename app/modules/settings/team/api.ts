import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getActiveScope } from "#/common/active-scope";
import { Endpoints } from "#/common/api/endpoints";
import { queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";

export interface Invitation {
  id: string;
  workspaceId: string;
  email: string;
  role: string;
  invitedBy: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  token: string;
  createdAt: string;
  expiresAt: string;
}

export interface InvitationInfo {
  email: string;
  role: string;
  workspaceId: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  expired: boolean;
  expiresAt: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CreateInvitationInput {
  email: string;
  role: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const getWorkspaceOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: queryKeys.workspace(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<Workspace>(
        Endpoints.composeEndpoints.WORKSPACES(workspaceId),
      ),
    enabled: Boolean(workspaceId),
    staleTime: 5 * 60 * 1000,
  });

export const getInvitationsOptions = () => {
  const { workspaceId, hasWorkspace } = getActiveScope();
  return queryOptions({
    queryKey: queryKeys.invitations(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<Invitation[]>(
        Endpoints.composeEndpoints.INVITATIONS(workspaceId),
      ),
    enabled: hasWorkspace,
  });
};

// Fetches the joined workspace_members × users list so the settings page can
// render a real team roster instead of just the signed-in user.
export const getWorkspaceMembersOptions = () => {
  const { workspaceId, hasWorkspace } = getActiveScope();
  return queryOptions({
    queryKey: queryKeys.members(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<WorkspaceMember[]>(
        Endpoints.composeEndpoints.WORKSPACE_MEMBERS(workspaceId),
      ),
    enabled: hasWorkspace,
    staleTime: 60 * 1000,
  });
};

// Fetch the safe public projection of an invitation. Used to render the
// confirmation / mismatch modal on the settings page before the user commits
// to accepting a token. Returns null when no token is provided.
export const getInvitationInfoOptions = (token?: string | null) =>
  queryOptions({
    queryKey: queryKeys.invitationInfo(token),
    queryFn: async () => {
      if (!token) return null;
      return await operonApiClient.get<InvitationInfo>(
        Endpoints.composeEndpoints.INVITATION_INFO(token),
      );
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 60 * 1000,
  });

export const createInvitationOptions = mutationOptions({
  mutationFn: async (data: CreateInvitationInput) => {
    const { workspaceId, hasWorkspace } = getActiveScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.post<Invitation>(
      Endpoints.composeEndpoints.INVITATIONS(workspaceId),
      data,
    );
  },
});

export const revokeInvitationOptions = mutationOptions({
  mutationFn: async (invitationId: string) => {
    const { workspaceId, hasWorkspace } = getActiveScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.INVITATIONS(workspaceId, invitationId),
    );
  },
});

export const acceptInvitationOptions = mutationOptions({
  mutationFn: async (token: string) =>
    await operonApiClient.post<{ message: string; status?: string }>(
      Endpoints.composeEndpoints.INVITATION_ACCEPT(),
      { token },
    ),
});
