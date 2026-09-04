import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getActiveScope } from "#/common/active-scope";
import { Endpoints } from "#/common/api/endpoints";
import { queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";
import type { Decision } from "#/modules/rule-engine/collection/types";

/** The payload served when no rule selects another one. */
export const DEFAULT_VARIANT = "default";

export interface Variant {
  key: string;
  description?: string;
  data: Record<string, unknown>;
}

/**
 * One immutable snapshot of a collection's content and rules, in one
 * environment. Promoting copies a version, history is the list of them, and a
 * rollback republishes an old one.
 */
export interface ContentVersion {
  id: string;
  collectionId: string;
  environmentId: string;
  version: number;
  variants: Variant[];
  note?: string;
  sourceEnvironmentId?: string;
  sourceVersion?: number;
  createdBy: string;
  createdAt: string;
}

/** A history row: enough to render the audit trail without every payload. */
/** How a version came about, used to label a history row. */
export type VersionKind = "created" | "modified" | "promoted" | "restored";

export interface VersionSummary {
  id: string;
  version: number;
  kind: VersionKind;
  note?: string;
  variantKeys: string[];
  ruleCount: number;
  sourceEnvironmentId?: string;
  sourceVersion?: number;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
}

export type ChangeKind = "added" | "removed" | "modified";

export interface FieldChange {
  path: string;
  kind: ChangeKind;
  before?: unknown;
  after?: unknown;
}

export interface VariantDiff {
  key: string;
  kind: ChangeKind;
  changes: FieldChange[];
}

export interface Diff {
  collectionId: string;
  fromEnvironmentId: string;
  fromVersion: number;
  toEnvironmentId: string;
  toVersion: number;
  identical: boolean;
  fromMissing: boolean;
  toMissing: boolean;
  variants: VariantDiff[];
  rulesChanged: boolean;
}

export const getVersionsOptions = (projectId: string, collectionId: string) => {
  const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
  return queryOptions({
    queryKey: queryKeys.versions(
      workspaceId,
      environmentId,
      projectId,
      collectionId,
    ),
    queryFn: async () =>
      await operonApiClient.get<VersionSummary[]>(
        Endpoints.composeEndpoints.COLLECTION_VERSIONS(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
      ),
    enabled: hasEnvironment && Boolean(projectId && collectionId),
  });
};

/**
 * Compares this environment against another, answering "what changes over
 * there if I promote". Only enabled once a target is chosen.
 */
export const getDiffOptions = (
  projectId: string,
  collectionId: string,
  targetEnvironmentId: string | null,
) => {
  const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
  return queryOptions({
    queryKey: queryKeys.diff(
      workspaceId,
      environmentId,
      projectId,
      collectionId,
      targetEnvironmentId ?? "",
    ),
    queryFn: async () =>
      await operonApiClient.get<Diff>(
        Endpoints.composeEndpoints.COLLECTION_DIFF(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
          targetEnvironmentId ?? "",
        ),
      ),
    enabled:
      hasEnvironment &&
      Boolean(projectId && collectionId && targetEnvironmentId),
    staleTime: 0,
  });
};

/**
 * What a single version changed, against the version before it. This is what
 * makes a history readable: a list of timestamps tells you when something
 * happened, not what.
 */
export const getVersionDiffOptions = (
  projectId: string,
  collectionId: string,
  version: number | null,
) => {
  const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
  return queryOptions({
    queryKey: queryKeys.versionDiff(
      workspaceId,
      environmentId,
      projectId,
      collectionId,
      version ?? 0,
    ),
    queryFn: async () =>
      await operonApiClient.get<Diff>(
        Endpoints.composeEndpoints.COLLECTION_VERSION_DIFF(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
          version ?? 0,
        ),
      ),
    enabled:
      hasEnvironment && Boolean(projectId && collectionId) && Boolean(version),
  });
};

export const saveVersionOptions = (projectId: string, collectionId: string) =>
  mutationOptions({
    mutationFn: async ({
      variants,
      note,
    }: {
      variants: Variant[];
      note?: string;
    }) => {
      const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
      if (!hasEnvironment)
        throw new Error("No active workspace or environment");
      return await operonApiClient.post<ContentVersion>(
        Endpoints.composeEndpoints.COLLECTION_VERSIONS(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
        { variants, note },
      );
    },
  });

export const promoteOptions = (projectId: string, collectionId: string) =>
  mutationOptions({
    mutationFn: async ({
      targetEnvironmentId,
      note,
    }: {
      targetEnvironmentId: string;
      note?: string;
    }) => {
      const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
      if (!hasEnvironment)
        throw new Error("No active workspace or environment");
      return await operonApiClient.post<ContentVersion>(
        Endpoints.composeEndpoints.COLLECTION_PROMOTE(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
        { targetEnvironmentId, note },
      );
    },
  });

export const rollbackOptions = (projectId: string, collectionId: string) =>
  mutationOptions({
    mutationFn: async ({
      version,
      note,
    }: {
      version: number;
      note?: string;
    }) => {
      const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
      if (!hasEnvironment)
        throw new Error("No active workspace or environment");
      return await operonApiClient.post<ContentVersion>(
        Endpoints.composeEndpoints.COLLECTION_ROLLBACK(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
        { version, note },
      );
    },
  });

/** A rule may target any variant defined on the current version. */
export type { Decision };
