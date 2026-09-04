import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Endpoints } from "#/common/api/endpoints";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";
import type { Decision } from "#/modules/rule-engine/collection/types";
import type { Variant } from "./content-api";

export interface Collection {
  id?: string;
  projectId: string;
  name: string;
}

/**
 * A collection together with its content in one environment. The console only
 * ever looks at one environment at a time, so the API returns them together.
 */
export interface CollectionView extends Collection {
  environmentId: string;
  /** 0 means nothing has been published here yet. */
  version: number;
  variants: Variant[];
  ruleEngine: { attributes: unknown[]; decisions: Decision[] };
  /** The default variant, flattened for convenience. */
  data: Record<string, unknown>;
}

export interface CreateCollectionDTO {
  name: string;
  data: Record<string, unknown>;
}

export const getCollectionsOptions = (projectId: string) => {
  const { workspaceId, environmentId, hasEnvironment } = activeScope();
  return queryOptions({
    queryKey: queryKeys.collections(workspaceId, environmentId, projectId),
    queryFn: async () =>
      await operonApiClient.get<Collection[]>(
        Endpoints.composeEndpoints.PROJECT_COLLECTIONS(
          workspaceId,
          environmentId,
          projectId,
        ),
      ),
    enabled: hasEnvironment && Boolean(projectId),
  });
};

export const getCollectionOptions = (
  projectId: string,
  collectionId: string,
) => {
  const { workspaceId, environmentId, hasEnvironment } = activeScope();
  return queryOptions({
    queryKey: queryKeys.collection(
      workspaceId,
      environmentId,
      projectId,
      collectionId,
    ),
    queryFn: async () =>
      await operonApiClient.get<CollectionView>(
        Endpoints.composeEndpoints.PROJECT_COLLECTION(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
      ),
    enabled: hasEnvironment && Boolean(projectId && collectionId),
  });
};

export const createCollectionOptions = (projectId: string) =>
  mutationOptions({
    mutationFn: async (dto: CreateCollectionDTO) => {
      const { workspaceId, environmentId, hasEnvironment } = activeScope();
      if (!hasEnvironment)
        throw new Error("No active workspace or environment");
      return await operonApiClient.post<CollectionView>(
        Endpoints.composeEndpoints.PROJECT_COLLECTIONS(
          workspaceId,
          environmentId,
          projectId,
        ),
        dto,
      );
    },
  });
