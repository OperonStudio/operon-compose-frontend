import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import { getActiveIds } from "#/libs/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export type ContextVariable = {
  id: string;
  name: string;
  type: string;
};

export const getContextsOptions = queryOptions({
  queryKey: ["contexts"],
  queryFn: async () => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) return [];
    const res = await operonApiClient.get<ContextVariable[]>(
      Endpoints.composeEndpoints.CONTEXTS(workspaceId),
    );
    return res;
  },
});

export const createContextOptions = mutationOptions({
  mutationFn: async (data: { name: string; type: string }) => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) throw new Error("No active workspace");
    return operonApiClient.post<ContextVariable>(
      Endpoints.composeEndpoints.CONTEXTS(workspaceId),
      data,
    );
  },
});

export const updateContextOptions = mutationOptions({
  mutationFn: async (data: { id: string; name: string; type: string }) => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) throw new Error("No active workspace");
    return operonApiClient.put<ContextVariable>(
      Endpoints.composeEndpoints.CONTEXTS(workspaceId, data.id),
      {
        name: data.name,
        type: data.type,
      },
    );
  },
});

export const deleteContextOptions = mutationOptions({
  mutationFn: async (id: string) => {
    const { workspaceId } = getActiveIds();
    if (!workspaceId) throw new Error("No active workspace");
    return operonApiClient.delete(
      Endpoints.composeEndpoints.CONTEXTS(workspaceId, id),
    );
  },
});
