import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Endpoints } from "#/common/api/endpoints";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";

export type ContextVariable = {
  id: string;
  name: string;
  type: string;
};

export const getContextsOptions = () => {
  const { workspaceId, hasWorkspace } = activeScope();
  return queryOptions({
    queryKey: queryKeys.contexts(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<ContextVariable[]>(
        Endpoints.composeEndpoints.CONTEXTS(workspaceId),
      ),
    enabled: hasWorkspace,
  });
};

export const createContextOptions = mutationOptions({
  mutationFn: async (data: { name: string; type: string }) => {
    const { workspaceId, hasWorkspace } = activeScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.post<ContextVariable>(
      Endpoints.composeEndpoints.CONTEXTS(workspaceId),
      data,
    );
  },
});

export const updateContextOptions = mutationOptions({
  mutationFn: async (data: { id: string; name: string; type: string }) => {
    const { workspaceId, hasWorkspace } = activeScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.put<ContextVariable>(
      Endpoints.composeEndpoints.CONTEXTS(workspaceId, data.id),
      { name: data.name, type: data.type },
    );
  },
});

export const deleteContextOptions = mutationOptions({
  mutationFn: async (id: string) => {
    const { workspaceId, hasWorkspace } = activeScope();
    if (!hasWorkspace) throw new Error("No active workspace");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.CONTEXTS(workspaceId, id),
    );
  },
});
