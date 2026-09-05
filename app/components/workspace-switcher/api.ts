import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { Endpoints } from "#/common/api/endpoints";
import { queryKeys } from "#/common/api/query-keys";
import { operonApiClient } from "#/libs/apiClient";

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceReq {
  name: string;
}

export interface UpdateWorkspaceReq {
  name?: string;
}

/**
 * A function, not a module-scope constant.
 *
 * `queryOptions({ queryKey: <keys>.workspaces(), ... })` evaluated while this
 * module is being defined reads the key builder during module evaluation. The
 * builder lives in another module, the bundler split the two into chunks that
 * import each other, and the chunk holding this file ran first — so the builder
 * was still undefined and the SSR bundle threw
 * "Cannot read properties of undefined (reading 'workspaces')" before it served
 * a single route. Every sibling query here already took a parameter and was
 * therefore lazy, which is why this was the only one that fell over.
 *
 * Deferring the call to render time removes the dependency on chunk evaluation
 * order entirely, rather than relying on the bundler to keep grouping these
 * modules the way it happens to today.
 */
export const getWorkspacesOptions = () =>
  queryOptions({
    queryKey: queryKeys.workspaces(),
    queryFn: async () =>
      await operonApiClient.get<Workspace[]>(
        Endpoints.composeEndpoints.WORKSPACES(),
      ),
  });

export const createWorkspaceOptions = mutationOptions({
  mutationFn: async (req: CreateWorkspaceReq) =>
    await operonApiClient.post<Workspace>(
      Endpoints.composeEndpoints.WORKSPACES(),
      req,
    ),
});

export const updateWorkspaceOptions = mutationOptions({
  mutationFn: async ({ id, req }: { id: string; req: UpdateWorkspaceReq }) =>
    await operonApiClient.patch<Workspace>(
      Endpoints.composeEndpoints.WORKSPACES(id),
      req,
    ),
});

export const deleteWorkspaceOptions = mutationOptions({
  mutationFn: async (id: string) =>
    await operonApiClient.delete(Endpoints.composeEndpoints.WORKSPACES(id)),
});
