import { operonApiClient } from "#/libs/apiClient";
import { getActiveIds } from "#/libs/utils";
import { queryOptions } from "@tanstack/react-query";

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

export const getWorkspaceOptions = (workspaceId?: string) =>
  queryOptions({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      return await operonApiClient.get<Workspace>(`/api/workspaces/${workspaceId}`);
    },
    enabled: !!workspaceId,
  });

export const getInvitationsOptions = () =>
  queryOptions({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { workspaceId } = getActiveIds();
      if (!workspaceId) return [];
      return await operonApiClient.get<Invitation[]>(
        `/api/workspaces/${workspaceId}/invitations`,
      );
    },
  });


export const createInvitationOptions = {
  mutationFn: async (data: CreateInvitationInput) => {
    const { workspaceId } = getActiveIds();
    return await operonApiClient.post<Invitation>(
      `/api/workspaces/${workspaceId}/invitations`,
      data,
    );
  },
};

export const revokeInvitationOptions = {
  mutationFn: async (invitationId: string) => {
    const { workspaceId } = getActiveIds();
    return await operonApiClient.delete(
      `/api/workspaces/${workspaceId}/invitations/${invitationId}`,
    );
  },
};

export const acceptInvitationOptions = {
  mutationFn: async (token: string) => {
    return await operonApiClient.post("/api/invitations/accept", { token });
  },
};

