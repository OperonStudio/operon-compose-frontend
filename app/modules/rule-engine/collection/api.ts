import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getActiveScope } from "#/common/active-scope";
import { Endpoints } from "#/common/api/endpoints";
import { queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";
import type { Decision } from "./types";

/** Cache key for a project's decisions, or a collection's when one is given. */
export const decisionsKey = (
  projectId: string,
  collectionId: string | null,
) => {
  const { workspaceId, environmentId } = getActiveScope();
  return collectionId
    ? queryKeys.collectionRules(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
      )
    : queryKeys.projectRules(workspaceId, environmentId, projectId);
};

/**
 * Decisions for one project, or for one collection inside it.
 *
 * Both levels share a shape and a screen, so they share one options builder —
 * branching between two differently-keyed `queryOptions` at the call site
 * produced a union React Query cannot resolve.
 *
 * Pass `collectionId: null` for the project level.
 */
export const getDecisionsOptions = (
  projectId: string,
  collectionId: string | null,
) => {
  const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
  return queryOptions({
    queryKey: decisionsKey(projectId, collectionId),
    queryFn: async () =>
      await operonApiClient.get<Decision[]>(
        collectionId
          ? Endpoints.composeEndpoints.COLLECTION_RULES(
              workspaceId,
              environmentId,
              projectId,
              collectionId,
            )
          : Endpoints.composeEndpoints.PROJECT_RULES(
              workspaceId,
              environmentId,
              projectId,
            ),
      ),
    enabled: hasEnvironment && Boolean(projectId),
    staleTime: 15_000,
  });
};

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
    const { workspaceId, environmentId } = getActiveScope();
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
    const { workspaceId, environmentId } = getActiveScope();
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
    const { workspaceId, environmentId } = getActiveScope();
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

export const createProjectRuleOptions = mutationOptions({
  mutationFn: async ({
    projectId,
    rule,
  }: {
    projectId: string;
    collectionId: string;
    rule: Partial<Decision>;
  }) => {
    const { workspaceId, environmentId } = getActiveScope();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.post<Decision>(
      Endpoints.composeEndpoints.PROJECT_RULES(
        workspaceId,
        environmentId,
        projectId,
      ),
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
    const { workspaceId, environmentId } = getActiveScope();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.patch<Decision>(
      Endpoints.composeEndpoints.PROJECT_RULE(
        workspaceId,
        environmentId,
        projectId,
        ruleId,
      ),
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
    const { workspaceId, environmentId } = getActiveScope();
    if (!workspaceId || !environmentId)
      throw new Error("No active workspace or environment");
    return await operonApiClient.delete(
      Endpoints.composeEndpoints.PROJECT_RULE(
        workspaceId,
        environmentId,
        projectId,
        ruleId,
      ),
    );
  },
});
