/**
 * The platform prefix.
 *
 * Workspaces, environments, projects, members, invitations and API keys are not
 * Compose's records. They belong to every Operon product and are served by
 * operon-homepage-backend, which the dev server proxies under this prefix so
 * the browser still talks to one origin and the session cookie still applies.
 *
 * Compose used to own them, which made it the only console that could create a
 * workspace and made every other product a guest in this one.
 */
const PLATFORM = "/platform/api";

export const ComposeEndpoints = {
  CONTENT: (collectionId: string) =>
    `/api/content/operon-compose/${collectionId}`,

  WORKSPACES: (workspaceId?: string) =>
    workspaceId
      ? `${PLATFORM}/workspaces/${workspaceId}`
      : `${PLATFORM}/workspaces`,

  ENVIRONMENTS: (workspaceId: string, environmentId?: string) =>
    environmentId
      ? `${PLATFORM}/workspaces/${workspaceId}/environments/${environmentId}`
      : `${PLATFORM}/workspaces/${workspaceId}/environments`,

  CONTEXTS: (workspaceId: string, contextId?: string) =>
    contextId
      ? `/api/workspaces/${workspaceId}/contexts/${contextId}`
      : `/api/workspaces/${workspaceId}/contexts`,

  API_KEYS: (workspaceId: string, projectId?: string) =>
    projectId
      ? `${PLATFORM}/workspaces/${workspaceId}/api-keys/${projectId}`
      : `${PLATFORM}/workspaces/${workspaceId}/api-keys`,

  USAGE: (workspaceId: string) => `/api/workspaces/${workspaceId}/usage`,

  USAGE_DAILY: (workspaceId: string, days = 7) =>
    `/api/workspaces/${workspaceId}/usage/daily?days=${days}`,

  WORKSPACE_MEMBERS: (workspaceId: string) =>
    `${PLATFORM}/workspaces/${workspaceId}/members`,

  INVITATIONS: (workspaceId: string, invitationId?: string) =>
    invitationId
      ? `${PLATFORM}/workspaces/${workspaceId}/invitations/${invitationId}`
      : `${PLATFORM}/workspaces/${workspaceId}/invitations`,

  INVITATION_INFO: (token: string) =>
    `${PLATFORM}/invitations/info?token=${encodeURIComponent(token)}`,

  INVITATION_ACCEPT: () => `${PLATFORM}/invitations/accept`,

  // A project belongs to a workspace and spans its environments, so the
  // environment is no longer in this path. The parameter is kept so existing
  // callers do not all have to change on the same day; it is ignored.
  PROJECTS: (
    workspaceId: string,
    _environmentId: string,
    projectId?: string,
  ) =>
    projectId
      ? `${PLATFORM}/workspaces/${workspaceId}/projects/${projectId}?product=compose`
      : `${PLATFORM}/workspaces/${workspaceId}/projects?product=compose`,

  PROJECT_COLLECTIONS: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
  ) =>
    `/api/workspaces/${workspaceId}/environments/${environmentId}/projects/${projectId}/collections`,

  PROJECT_COLLECTION: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    `/api/workspaces/${workspaceId}/environments/${environmentId}/projects/${projectId}/collections/${collectionId}`,

  COLLECTION_VERSIONS: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    `${ComposeEndpoints.PROJECT_COLLECTION(workspaceId, environmentId, projectId, collectionId)}/versions`,

  COLLECTION_VERSION_DIFF: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
    version: number,
  ) =>
    `${ComposeEndpoints.COLLECTION_VERSIONS(workspaceId, environmentId, projectId, collectionId)}/${version}/diff`,

  COLLECTION_SIMULATE: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    `${ComposeEndpoints.PROJECT_COLLECTION(workspaceId, environmentId, projectId, collectionId)}/simulate`,

  COLLECTION_PROMOTE: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    `${ComposeEndpoints.PROJECT_COLLECTION(workspaceId, environmentId, projectId, collectionId)}/promote`,

  COLLECTION_ROLLBACK: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    `${ComposeEndpoints.PROJECT_COLLECTION(workspaceId, environmentId, projectId, collectionId)}/rollback`,

  COLLECTION_DIFF: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
    targetEnvironmentId: string,
  ) =>
    `${ComposeEndpoints.PROJECT_COLLECTION(workspaceId, environmentId, projectId, collectionId)}/diff?target=${encodeURIComponent(targetEnvironmentId)}`,

  COLLECTION_RULES: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
  ) =>
    `/api/workspaces/${workspaceId}/environments/${environmentId}/projects/${projectId}/collections/${collectionId}/rules`,

  COLLECTION_RULE: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    collectionId: string,
    ruleId: string,
  ) =>
    `/api/workspaces/${workspaceId}/environments/${environmentId}/projects/${projectId}/collections/${collectionId}/rules/${ruleId}`,

  PROJECT_RULES: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
  ) =>
    `/api/workspaces/${workspaceId}/environments/${environmentId}/projects/${projectId}/rules`,

  PROJECT_RULE: (
    workspaceId: string,
    environmentId: string,
    projectId: string,
    ruleId: string,
  ) =>
    `/api/workspaces/${workspaceId}/environments/${environmentId}/projects/${projectId}/rules/${ruleId}`,
} as const;

export const Endpoints = {
  composeEndpoints: ComposeEndpoints,
} as const;
