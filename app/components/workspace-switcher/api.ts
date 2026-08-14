import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceReq {
  name: string;
}

export interface UpdateWorkspaceReq {
  name?: string;
}

export const getWorkspacesOptions = queryOptions({
  queryKey: ["workspaces"],
  queryFn: async () =>
    await operonApiClient.get<Workspace[]>(
      Endpoints.composeEndpoints.WORKSPACES(),
    ),
});

export const createWorkspaceOptions = mutationOptions({
  mutationFn: async (req: CreateWorkspaceReq) =>
    await operonApiClient.post<Workspace>(
      Endpoints.composeEndpoints.WORKSPACES(),
      req,
    ),
});

export const updateWorkspaceOptions = mutationOptions({
  mutationFn: async ({ id, req }: { id: string; req: UpdateWorkspaceReq }) =>
    await operonApiClient.patch<Workspace>(
      Endpoints.composeEndpoints.WORKSPACES(id),
      req,
    ),
});

export const deleteWorkspaceOptions = mutationOptions({
  mutationFn: async (id: string) =>
    await operonApiClient.delete(Endpoints.composeEndpoints.WORKSPACES(id)),
});
