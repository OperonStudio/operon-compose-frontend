import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Endpoints } from "#/common/api/endpoints";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";
import type { Project } from "./interface";

export const getProjectsOptions = () => {
  const { workspaceId, environmentId, hasEnvironment } = activeScope();
  return queryOptions({
    queryKey: queryKeys.projects(workspaceId, environmentId),
    queryFn: async () =>
      await operonApiClient.get<Project[]>(
        Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId),
      ),
    enabled: hasEnvironment,
  });
};

export const createProjectOptions = mutationOptions({
  mutationFn: async (project: Project) => {
    const { workspaceId, environmentId, hasEnvironment } = activeScope();
    if (!hasEnvironment) throw new Error("No active workspace or environment");
    // Tagging the project tells the platform which consoles it is set up for,
    // so Analytics does not offer a project that exists only to hold Compose
    // content, and this console does not offer one created from Analytics.
    return await operonApiClient.post<Project>(
      Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId),
      { ...project, products: ["compose"] },
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
    const { workspaceId, environmentId, hasEnvironment } = activeScope();
    if (!hasEnvironment) throw new Error("No active workspace or environment");
    return await operonApiClient.patch<Project>(
      Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId, id),
      project,
    );
  },
});

export const deleteProjectOptions = mutationOptions({
  mutationFn: async (id: string) => {
    const { workspaceId, environmentId, hasEnvironment } = activeScope();
    if (!hasEnvironment) throw new Error("No active workspace or environment");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.PROJECTS(workspaceId, environmentId, id),
    );
  },
});
