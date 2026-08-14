import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import { getActiveIds } from "#/libs/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export interface ApiKey {
  id: string;
  name: string;
  environment: string;
  value: string;
  createdAt: string;
}

export interface ProjectWithKeys {
  id: string;
  name: string;
  keys: ApiKey[];
}

export interface RegenerateAPIKeyReq {
  environmentId: string;
}

export const getApiKeysOptions = () => {
  const { workspaceId, environmentId } = getActiveIds();
  return queryOptions({
    queryKey: ["api-keys", workspaceId, environmentId],
    queryFn: async () => {
      if (!workspaceId || !environmentId) return [];
      return await operonApiClient.get<ProjectWithKeys[]>(
        `${Endpoints.composeEndpoints.API_KEYS(workspaceId)}?environment=${environmentId}`,
      );
    },
  });
};

export const regenerateApiKeyOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    req,
  }: {
    projectId: string;
    req: RegenerateAPIKeyReq;
  }) => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) throw new Error("No active workspace");
    return await operonApiClient.post<ApiKey>(
      Endpoints.composeEndpoints.API_KEYS(workspaceId, projectId),
      req,
    );
  },
});
