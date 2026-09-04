import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Endpoints } from "#/common/api/endpoints";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";

export interface ApiKey {
  id: string;
  name: string;
  environment: string;
  prefix: string;
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

// The one-shot response. The server returns the plaintext key exactly once
// on regeneration; it is never persisted and cannot be fetched again.
export interface RegenerateKeyResult {
  id: string;
  projectId: string;
  environment: string;
  prefix: string;
  plaintextValue: string;
  createdAt: string;
}

export const getApiKeysOptions = () => {
  const { workspaceId, environmentId, hasEnvironment } = activeScope();
  return queryOptions({
    queryKey: queryKeys.apiKeys(workspaceId, environmentId),
    queryFn: async () =>
      await operonApiClient.get<ProjectWithKeys[]>(
        `${Endpoints.composeEndpoints.API_KEYS(workspaceId)}?environment=${encodeURIComponent(environmentId)}`,
      ),
    enabled: hasEnvironment,
    staleTime: 60_000,
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
    const { workspaceId, hasWorkspace } = activeScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.post<RegenerateKeyResult>(
      `${Endpoints.composeEndpoints.API_KEYS(workspaceId, projectId)}?environment=${encodeURIComponent(req.environmentId)}`,
      {},
    );
  },
});
