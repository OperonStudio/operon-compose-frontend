import { Endpoints } from "#/common/api/endpoints";
import type { Workspace } from "#/components/workspace-switcher/api";
import { operonApiClient } from "#/libs/apiClient";
import type { Environment } from "#/modules/environments/types";
import { toast } from "@operonstudio/ui";
import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

const ACTIVE_WORKSPACE_KEY = "operon_active_workspace_id";
const ACTIVE_ENVIRONMENT_KEY = "operon_active_environment_id";

// ── Query / mutation options ───────────────────────────────────────────────

const workspacesQueryOptions = queryOptions({
  queryKey: ["workspaces"],
  queryFn: async () =>
    await operonApiClient.get<Workspace[]>(Endpoints.composeEndpoints.WORKSPACES()),
});

const environmentsQueryOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: ["environments", workspaceId],
    queryFn: async () =>
      await operonApiClient.get<Environment[]>(
        Endpoints.composeEndpoints.ENVIRONMENTS(workspaceId),
      ),
    enabled: !!workspaceId,
  });

const createWorkspaceMutation = mutationOptions({
  mutationFn: async (name: string) =>
    await operonApiClient.post<Workspace>(Endpoints.composeEndpoints.WORKSPACES(), {
      name,
    }),
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

export function useOnboarding() {
  const qc = useQueryClient();

  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError: workspacesErrored,
  } = useQuery(workspacesQueryOptions);

  // Pick an active workspace id: stored value if still valid, else first workspace.
  const storedWorkspaceId =
    typeof window !== "undefined"
      ? localStorage.getItem(ACTIVE_WORKSPACE_KEY)
      : null;
  const validStoredWs = workspaces?.some((w) => w.id === storedWorkspaceId);
  const effectiveWorkspaceId = validStoredWs
    ? storedWorkspaceId
    : (workspaces?.[0]?.id ?? null);

  // Persist any correction back to localStorage so the rest of the app's
  // hooks (which read via getActiveIds()) see a consistent value.
  useEffect(() => {
    if (
      effectiveWorkspaceId &&
      effectiveWorkspaceId !== storedWorkspaceId &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, effectiveWorkspaceId);
      qc.invalidateQueries();
    }
  }, [effectiveWorkspaceId, storedWorkspaceId, qc]);

  const {
    data: environments,
    isLoading: environmentsLoading,
    isError: environmentsErrored,
  } = useQuery(environmentsQueryOptions(effectiveWorkspaceId ?? ""));

  const storedEnvironmentId =
    typeof window !== "undefined"
      ? localStorage.getItem(ACTIVE_ENVIRONMENT_KEY)
      : null;
  const validStoredEnv = environments?.some(
    (e) => e.id === storedEnvironmentId,
  );
  const effectiveEnvironmentId = validStoredEnv
    ? storedEnvironmentId
    : (environments?.[0]?.id ?? null);

  useEffect(() => {
    if (
      effectiveEnvironmentId &&
      effectiveEnvironmentId !== storedEnvironmentId &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem(ACTIVE_ENVIRONMENT_KEY, effectiveEnvironmentId);
      qc.invalidateQueries();
    }
  }, [effectiveEnvironmentId, storedEnvironmentId, qc]);

  // ── Mutations ────────────────────────────────────────────────────────────

  const createWorkspace = useMutation({
    ...createWorkspaceMutation,
    onSuccess: (ws: Workspace) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(ACTIVE_WORKSPACE_KEY, ws.id);
      }
      qc.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success(`Workspace "${ws.name}" created`);
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  const createEnvironment = useMutation({
    ...createEnvironmentMutation,
    onSuccess: (env: Environment) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(ACTIVE_ENVIRONMENT_KEY, env.id);
      }
      qc.invalidateQueries({ queryKey: ["environments"] });
      toast.success(`Environment "${env.name}" created`);
    },
    onError: () => toast.error("Failed to create environment"),
  });

  // ── Step machine ─────────────────────────────────────────────────────────

  const isLoading =
    workspacesLoading || (!!effectiveWorkspaceId && environmentsLoading);
  const isErrored = workspacesErrored || environmentsErrored;
  const hasWorkspace = !!effectiveWorkspaceId;
  const hasEnvironment = !!effectiveEnvironmentId;

  let step: OnboardingStep = "idle";
  if (!isLoading && !isErrored) {
    if (!hasWorkspace) step = "workspace";
    else if (!hasEnvironment) step = "environment";
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
