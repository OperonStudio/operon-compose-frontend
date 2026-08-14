import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import { getActiveIds } from "#/libs/utils";
import { queryOptions } from "@tanstack/react-query";

export interface Collection {
  id?: string;
  projectId: string;
  name: string;
  data: any;
}

export interface CreateCollectionDTO {
  id: string;
  name: string;
  data: any;
}

export const getCollectionsOptions = (projectId: string) =>
  queryOptions({
    queryKey: ["projects", projectId, "collections"],
    queryFn: async () => {
      const { workspaceId, environmentId } = getActiveIds();
      if (!workspaceId || !environmentId) return [];
      return await operonApiClient.get<Collection[]>(
        Endpoints.composeEndpoints.PROJECT_COLLECTIONS(
          workspaceId,
          environmentId,
          projectId,
        ),
      );
    },
  });

export const getCollectionOptions = (projectId: string, collectionId: string) =>
  queryOptions({
    queryKey: ["projects", projectId, "collections", collectionId],
    queryFn: async () => {
      const { workspaceId, environmentId } = getActiveIds();
      if (!workspaceId || !environmentId)
        throw new Error("No active workspace or environment");
      return await operonApiClient.get<Collection>(
        Endpoints.composeEndpoints.PROJECT_COLLECTION(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
      );
    },
  });

export const createCollectionOptions = (projectId: string) => ({
  mutationFn: async (dto: CreateCollectionDTO) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.post<Collection>(
      Endpoints.composeEndpoints.PROJECT_COLLECTIONS(
        workspaceId,
        environmentId,
        projectId,
      ),
      dto,
    );
  },
});

export const updateCollectionOptions = (
  projectId: string,
  collectionId: string,
) => ({
  mutationFn: async (data: any) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.patch<Collection>(
      Endpoints.composeEndpoints.PROJECT_COLLECTION(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
      ),
      data,
    );
  },
});
