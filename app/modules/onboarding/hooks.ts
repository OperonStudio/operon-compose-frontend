import { toast } from "@operonstudio/ui";
import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getActiveScope,
  setActiveEnvironment,
  setActiveWorkspace,
} from "#/common/active-scope";
import { Endpoints } from "#/common/api/endpoints";
import { queryKeys } from "#/common/api/query-keys";
import type { Workspace } from "#/components/workspace-switcher/api";
import { operonApiClient } from "#/libs/apiClient";
import type { Environment } from "#/modules/environments/types";

// ── Query / mutation options ───────────────────────────────────────────────

/** Lazy for the reason set out in components/workspace-switcher/api.ts. */
const workspacesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.workspaces(),
    queryFn: async () =>
      await operonApiClient.get<Workspace[]>(
        Endpoints.composeEndpoints.WORKSPACES(),
      ),
  });

const environmentsQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: queryKeys.environments(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<Environment[]>(
        Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId),
      ),
    enabled: Boolean(workspaceId),
  });

const createWorkspaceMutation = mutationOptions({
  mutationFn: async (name: string) =>
    await operonApiClient.post<Workspace>(
      Endpoints.composeEndpoints.WORKSPACES(),
      { name },
    ),
});

const createEnvironmentMutation = mutationOptions({
  mutationFn: async ({
    workspaceId,
    name,
    description,
  }: {
    workspaceId: string;
    name: string;
    description?: string;
  }) =>
    await operonApiClient.post<Environment>(
      Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId),
      { name, description },
    ),
});

// ── The gate hook ──────────────────────────────────────────────────────────

export type OnboardingStep = "idle" | "workspace" | "environment" | "ready";

/**
 * Decides whether the signed-in user can be shown the product yet.
 *
 * Compose needs a workspace and, inside it, an environment before any other
 * screen has a URL to call. This hook also repairs the stored ids when they
 * point at something the user can no longer see — a workspace they were removed
 * from, or an environment that was deleted.
 */
export function useOnboarding() {
  const qc = useQueryClient();

  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError: workspacesErrored,
  } = useQuery(workspacesQueryOptions());

  const stored = getActiveScope();

  // Keep the stored workspace if it is still one the user belongs to, else take
  // the first one they do.
  const storedWorkspaceIsValid = workspaces?.some(
    (w) => w.id === stored.workspaceId,
  );
  const effectiveWorkspaceId = storedWorkspaceIsValid
    ? stored.workspaceId
    : (workspaces?.[0]?.id ?? "");

  useEffect(() => {
    if (!effectiveWorkspaceId || effectiveWorkspaceId === stored.workspaceId) {
      return;
    }
    setActiveWorkspace(effectiveWorkspaceId);
    qc.invalidateQueries({
      queryKey: queryKeys.workspace(effectiveWorkspaceId),
    });
  }, [effectiveWorkspaceId, stored.workspaceId, qc]);

  const {
    data: environments,
    isLoading: environmentsLoading,
    isError: environmentsErrored,
  } = useQuery(environmentsQueryOptions(effectiveWorkspaceId));

  const storedEnvironmentIsValid = environments?.some(
    (e) => e.id === stored.environmentId,
  );
  const effectiveEnvironmentId = storedEnvironmentIsValid
    ? stored.environmentId
    : (environments?.[0]?.id ?? "");

  useEffect(() => {
    if (
      !effectiveEnvironmentId ||
      effectiveEnvironmentId === stored.environmentId
    ) {
      return;
    }
    setActiveEnvironment(effectiveEnvironmentId);
    if (effectiveWorkspaceId) {
      qc.invalidateQueries({
        queryKey: queryKeys.environments(effectiveWorkspaceId),
      });
    }
  }, [effectiveEnvironmentId, stored.environmentId, effectiveWorkspaceId, qc]);

  // ── Mutations ────────────────────────────────────────────────────────────

  const createWorkspace = useMutation({
    ...createWorkspaceMutation,
    onSuccess: (ws: Workspace) => {
      setActiveWorkspace(ws.id);
      qc.invalidateQueries({ queryKey: queryKeys.workspaces() });
      toast.success(`Workspace "${ws.name}" created`);
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  const createEnvironment = useMutation({
    ...createEnvironmentMutation,
    onSuccess: (env: Environment) => {
      setActiveEnvironment(env.id);
      if (effectiveWorkspaceId) {
        qc.invalidateQueries({
          queryKey: queryKeys.environments(effectiveWorkspaceId),
        });
      }
      toast.success(`Environment "${env.name}" created`);
    },
    onError: () => toast.error("Failed to create environment"),
  });

  // ── Step machine ─────────────────────────────────────────────────────────

  const isLoading =
    workspacesLoading || (Boolean(effectiveWorkspaceId) && environmentsLoading);
  const isErrored = workspacesErrored || environmentsErrored;

  let step: OnboardingStep = "idle";
  if (!isLoading && !isErrored) {
    if (!effectiveWorkspaceId) step = "workspace";
    else if (!effectiveEnvironmentId) step = "environment";
    else step = "ready";
  }

  return {
    step,
    isLoading,
    isErrored,
    createWorkspace: (name: string) => createWorkspace.mutate(name),
    isCreatingWorkspace: createWorkspace.isPending,
    createEnvironment: (name: string, description?: string) => {
      if (!effectiveWorkspaceId) return;
      createEnvironment.mutate({
        workspaceId: effectiveWorkspaceId,
        name,
        description,
      });
    },
    isCreatingEnvironment: createEnvironment.isPending,
  };
}
