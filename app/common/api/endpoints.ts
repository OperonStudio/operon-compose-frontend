export const ComposeEndpoints = {
  CONTENT: (collectionId: string) =>
    `/api/content/operon-compose/${collectionId}`,

  WORKSPACES: (workspaceId?: string) =>
    workspaceId ? `/api/workspaces/${workspaceId}` : `/api/workspaces`,

  ENVIRONMENTS: (workspaceId: string, environmentId?: string) =>
    environmentId
      ? `/api/workspaces/${workspaceId}/environments/${environmentId}`
      : `/api/workspaces/${workspaceId}/environments`,

  CONTEXTS: (workspaceId: string, contextId?: string) =>
    contextId
      ? `/api/workspaces/${workspaceId}/contexts/${contextId}`
      : `/api/workspaces/${workspaceId}/contexts`,

  API_KEYS: (workspaceId: string, projectId?: string) =>
    projectId
      ? `/api/workspaces/${workspaceId}/api-keys/${projectId}`
      : `/api/workspaces/${workspaceId}/api-keys`,

  USAGE: (workspaceId: string) => `/api/workspaces/${workspaceId}/usage`,

  PROJECTS: (workspaceId: string, environmentId: string, projectId?: string) =>
    projectId
      ? `/api/workspaces/${workspaceId}/environments/${environmentId}/projects/${projectId}`
      : `/api/workspaces/${workspaceId}/environments/${environmentId}/projects`,

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
