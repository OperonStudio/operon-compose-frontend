import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import { getActiveIds } from "#/libs/utils";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Decision } from "./types";

export const getRulesOptions = (projectId: string, collectionId: string) =>
  queryOptions({
    queryKey: ["rules", projectId, collectionId],
    queryFn: async () => {
      const { workspaceId, environmentId } = getActiveIds();
      if (!workspaceId || !environmentId) return [];
      return await operonApiClient.get<Decision[]>(
        Endpoints.composeEndpoints.COLLECTION_RULES(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
      );
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

export const createRuleOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    collectionId,
    rule,
  }: {
    projectId: string;
    collectionId: string;
    rule: Partial<Decision>;
  }) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.post<Decision>(
      Endpoints.composeEndpoints.COLLECTION_RULES(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
      ),
      rule,
    );
  },
});

export const updateRuleOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    collectionId,
    ruleId,
    rule,
  }: {
    projectId: string;
    collectionId: string;
    ruleId: string;
    rule: Partial<Decision>;
  }) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.patch<Decision>(
      Endpoints.composeEndpoints.COLLECTION_RULE(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
        ruleId,
      ),
      rule,
    );
  },
});

export const deleteRuleOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    collectionId,
    ruleId,
  }: {
    projectId: string;
    collectionId: string;
    ruleId: string;
  }) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.COLLECTION_RULE(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
        ruleId,
      ),
    );
  },
});

// ---- Project-level rules (stored on the project model) ----

export const getProjectRulesOptions = (projectId: string) =>
  queryOptions({
    queryKey: ["rules", projectId, "__project__"],
    queryFn: async () => {
      const { workspaceId, environmentId } = getActiveIds();
      if (!workspaceId || !environmentId) return [];
      return await operonApiClient.get<Decision[]>(
        Endpoints.composeEndpoints.PROJECT_RULES(workspaceId, environmentId, projectId),
      );
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

export const createProjectRuleOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    rule,
  }: {
    projectId: string;
    collectionId: string;
    rule: Partial<Decision>;
  }) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.post<Decision>(
      Endpoints.composeEndpoints.PROJECT_RULES(workspaceId, environmentId, projectId),
      rule,
    );
  },
});

export const updateProjectRuleOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    ruleId,
    rule,
  }: {
    projectId: string;
    collectionId: string;
    ruleId: string;
    rule: Partial<Decision>;
  }) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.patch<Decision>(
      Endpoints.composeEndpoints.PROJECT_RULE(workspaceId, environmentId, projectId, ruleId),
      rule,
    );
  },
});

export const deleteProjectRuleOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    ruleId,
  }: {
    projectId: string;
    collectionId: string;
    ruleId: string;
  }) => {
    const { workspaceId, environmentId } = getActiveIds();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.PROJECT_RULE(workspaceId, environmentId, projectId, ruleId),
    );
  },
});
