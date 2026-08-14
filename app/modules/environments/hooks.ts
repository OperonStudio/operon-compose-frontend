import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getEnvironmentsOptions } from "./api";

const ACTIVE_ENVIRONMENT_KEY = "operon_active_environment_id";

function getStoredEnvironmentId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_ENVIRONMENT_KEY);
}

function storeEnvironmentId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVE_ENVIRONMENT_KEY, id);
  }
}

export function useActiveEnvironment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading } = useQuery(getEnvironmentsOptions);
  const environments = data || [];
  const [activeId, setActiveId] = useState<string | null>(getStoredEnvironmentId);

  const handleRedirect = () => {
    const pathname = router.state.location.pathname;
    if (pathname.startsWith("/projects/")) router.navigate({ to: "/projects" });
    else if (pathname.startsWith("/rule-engine/")) router.navigate({ to: "/rule-engine" });
    else if (pathname.startsWith("/api-keys/")) router.navigate({ to: "/api-keys" });
  };

  useEffect(() => {
    if (environments.length > 0) {
      // If we have no active ID, or the active ID is not in the current list (e.g. workspace changed),
      // fallback to the first environment in the list.
      const isValid = environments.some((env) => env.id === activeId);
      if (!isValid) {
        const id = environments[0].id;
        setActiveId(id);
        storeEnvironmentId(id);
        queryClient.invalidateQueries();
        handleRedirect();
      }
    } else if (environments.length === 0 && !isLoading) {
      // If no environments exist in the current workspace, clear the active environment.
      if (activeId !== null) {
        setActiveId(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(ACTIVE_ENVIRONMENT_KEY);
        }
        queryClient.invalidateQueries();
        handleRedirect();
      }
    }
  }, [environments, activeId, isLoading, queryClient, router]);

  const activeEnvironment = environments.find((e) => e.id === activeId) ?? environments[0] ?? null;

  const switchEnvironment = (id: string) => {
    setActiveId(id);
    storeEnvironmentId(id);
    queryClient.invalidateQueries();
    handleRedirect();
  };

  return { environments, activeEnvironment, switchEnvironment, isLoading };
}
