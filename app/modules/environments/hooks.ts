import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  getActiveEnvironmentId,
  getActiveScope,
  setActiveEnvironment,
} from "#/common/active-scope";
import { queryKeys } from "#/common/api/query-keys";
import { getEnvironmentsOptions } from "./api";

/** Routes addressing a single project, collection or key — see useActiveWorkspace. */
const SCOPED_ROUTE_PREFIXES = ["/projects/", "/rule-engine/", "/api-keys/"];

export function useActiveEnvironment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: environments = [], isLoading } = useQuery(
    getEnvironmentsOptions(),
  );
  const [activeId, setActiveId] = useState<string | null>(
    getActiveEnvironmentId,
  );

  const applyEnvironment = useCallback(
    (id: string | null) => {
      setActiveId(id);
      setActiveEnvironment(id);
      // Projects, collections, rules and keys all hang off the environment in
      // the key tree, so invalidate that subtree rather than the whole cache.
      const { workspaceId } = getActiveScope();
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.environments(workspaceId),
        });
      }

      const { pathname } = router.state.location;
      const prefix = SCOPED_ROUTE_PREFIXES.find((p) => pathname.startsWith(p));
      if (prefix) router.navigate({ to: prefix.slice(0, -1) });
    },
    [queryClient, router],
  );

  useEffect(() => {
    if (isLoading) return;

    if (environments.length === 0) {
      // A workspace with no environments must not keep pointing at one.
      if (activeId !== null) applyEnvironment(null);
      return;
    }

    if (!environments.some((env) => env.id === activeId)) {
      applyEnvironment(environments[0].id);
    }
  }, [environments, activeId, isLoading, applyEnvironment]);

  const activeEnvironment =
    environments.find((e) => e.id === activeId) ?? environments[0] ?? null;

  return {
    environments,
    activeEnvironment,
    switchEnvironment: applyEnvironment,
    isLoading,
  };
}
