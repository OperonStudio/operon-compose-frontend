import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import { getActiveIds } from "#/libs/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
  CreateEnvironmentReq,
  Environment,
  UpdateEnvironmentReq,
} from "./types";

export const getEnvironmentsOptions = queryOptions({
  queryKey: ["environments"],
  queryFn: async () => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) return [];
    return await operonApiClient.get<Environment[]>(
      Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId),
    );
  },
});

export const createEnvironmentOptions = mutationOptions({
  mutationFn: async (req: CreateEnvironmentReq) => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) throw new Error("No active workspace");
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
    const { workspaceId } = getActiveIds();
    if (!workspaceId) throw new Error("No active workspace");
    return await operonApiClient.patch<Environment>(
      Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId, id),
      req,
    );
  },
});

export const deleteEnvironmentOptions = mutationOptions({
  mutationFn: async (id: string) => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) throw new Error("No active workspace");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId, id),
    );
  },
});
