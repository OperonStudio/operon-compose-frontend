import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Endpoints } from "#/common/api/endpoints";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";
import type {
  CreateEnvironmentReq,
  Environment,
  UpdateEnvironmentReq,
} from "./types";

export const getEnvironmentsOptions = () => {
  const { workspaceId, hasWorkspace } = activeScope();
  return queryOptions({
    queryKey: queryKeys.environments(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<Environment[]>(
        Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId),
      ),
    enabled: hasWorkspace,
  });
};

export const createEnvironmentOptions = mutationOptions({
  mutationFn: async (req: CreateEnvironmentReq) => {
    const { workspaceId, hasWorkspace } = activeScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.post<Environment>(
      Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId),
      req,
    );
  },
});

export const updateEnvironmentOptions = mutationOptions({
  mutationFn: async ({
    id,
    req,
  }: {
    id: string;
    req: UpdateEnvironmentReq;
  }) => {
    const { workspaceId, hasWorkspace } = activeScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.patch<Environment>(
      Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId, id),
      req,
    );
  },
});

export const deleteEnvironmentOptions = mutationOptions({
  mutationFn: async (id: string) => {
    const { workspaceId, hasWorkspace } = activeScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId, id),
    );
  },
});
