import { operonApiClient } from "#/libs/apiClient";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Project } from "./interface";

import { Endpoints } from "#/common/api/endpoints";
import { getActiveIds } from "#/libs/utils";

export const getProjectsOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: async () => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId) return [];
    return await operonApiClient.get<Project[]>(
      Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId),
    );
  },
});

export const createProjectOptions = mutationOptions({
  mutationFn: async (project: Project) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.post<Project>(
      Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId),
      project,
    );
  },
});

export const updateProjectOptions = mutationOptions({
  mutationFn: async ({
    id,
    project,
  }: {
    id: string;
    project: Partial<Project>;
  }) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.patch<Project>(
      Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId, id),
      project,
    );
  },
});

export const deleteProjectOptions = mutationOptions({
  mutationFn: async (id: string) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId, id),
    );
  },
});
