import { getActiveScope } from "#/common/active-scope";

/**
 * Every cache key in Compose, in one place.
 *
 * Almost all Compose data is scoped to a workspace, and much of it to an
 * environment inside that workspace. Keys used to omit those ids and read them
 * from localStorage inside the query function instead, which meant two
 * different workspaces shared one cache entry — the app compensated by calling
 * `invalidateQueries()` with no arguments on every switch, throwing away the
 * entire cache to hide the aliasing.
 *
 * Rooting each key at `["workspaces", workspaceId, …]` makes the scope part of
 * the identity, so switching is just a matter of reading a different key, and
 * an invalidation can name exactly the subtree it means.
 */
export const queryKeys = {
  workspaces: () => ["workspaces"] as const,

  workspace: (workspaceId: string) => ["workspaces", workspaceId] as const,

  members: (workspaceId: string) =>
    ["workspaces", workspaceId, "members"] as const,

  invitations: (workspaceId: string) =>
    ["workspaces", workspaceId, "invitations"] as const,

  /** Keyed by token alone — an invitation is looked up before its workspace is known. */
  invitationInfo: (token: string | null | undefined) =>
    ["invitation-info", token ?? ""] as const,

  environments: (workspaceId: string) =>
    ["workspaces", workspaceId, "environments"] as const,

  contexts: (workspaceId: string) =>
    ["workspaces", workspaceId, "contexts"] as const,

  usage: (workspaceId: string) => ["workspaces", workspaceId, "usage"] as const,

  usageDaily: (workspaceId: string, days: number) =>
    ["workspaces", workspaceId, "usage", "daily", days] as const,

  apiKeys: (workspaceId: string, environmentId: string) =>
    [
      "workspaces",
      workspaceId,
      "environments",
      environmentId,
      "api-keys",
    ] as const,

  projects: (workspaceId: string, environmentId: string) =>
    [
      "workspaces",
      workspaceId,
      "environments",
      environmentId,
      "projects",
    ] as const,

  project: (workspaceId: string, environmentId: string, projectId: string) =>
    [...queryKeys.projects(workspaceId, environmentId), projectId] as const,

  collections: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
  ) =>
    [
      ...queryKeys.project(workspaceId, environmentId, projectId),
      "collections",
    ] as const,

  collection: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    [
      ...queryKeys.collections(workspaceId, environmentId, projectId),
      collectionId,
    ] as const,

  /** Version history for a collection in one environment. */
  versions: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    [
      ...queryKeys.collection(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
      ),
      "versions",
    ] as const,

  /** What one version changed, against its predecessor. */
  versionDiff: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
    version: number,
  ) =>
    [
      ...queryKeys.versions(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
      ),
      version,
      "diff",
    ] as const,

  /** A comparison of one environment against another. */
  diff: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
    targetEnvironmentId: string,
  ) =>
    [
      ...queryKeys.collection(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
      ),
      "diff",
      targetEnvironmentId,
    ] as const,

  collectionRules: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    [
      ...queryKeys.collection(
        workspaceId,
        environmentId,
        projectId,
        collectionId,
      ),
      "rules",
    ] as const,

  projectRules: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
  ) =>
    [
      ...queryKeys.project(workspaceId, environmentId, projectId),
      "rules",
    ] as const,

  /** CMS-driven page copy. Not workspace scoped. */
  content: (collectionId: string) => ["content", collectionId] as const,
} as const;

/**
 * Re-exported so a module building keys does not need two imports. A missing id
 * reads back as the empty string rather than undefined, keeping the key a
 * stable serialisable tuple; the query itself is disabled instead.
 */
export const activeScope = getActiveScope;
