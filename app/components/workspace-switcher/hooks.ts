import { toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getActiveWorkspaceId,
  setActiveWorkspace,
} from "#/common/active-scope";
import { queryKeys } from "#/common/api/query-keys";
import {
  createWorkspaceOptions,
  getWorkspacesOptions,
  type Workspace,
} from "#/components/workspace-switcher/api";

/**
 * Routes that address a single project, collection or key. None of those ids
 * exist in another workspace, so a switch has to leave them behind.
 */
const SCOPED_ROUTE_PREFIXES = ["/projects/", "/rule-engine/", "/api-keys/"];

export function useActiveWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: workspaces = [] } = useQuery(getWorkspacesOptions);
  const [activeId, setActiveId] = useState<string | null>(getActiveWorkspaceId);

  const applyWorkspace = useCallback(
    (id: string) => {
      setActiveId(id);
      // Also clears the active environment, which belonged to the workspace we
      // are leaving.
      setActiveWorkspace(id);
      // Only this workspace's subtree is stale. Workspace-independent data —
      // the CMS page copy, the workspace list itself — stays cached.
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace(id) });

      const { pathname } = router.state.location;
      const prefix = SCOPED_ROUTE_PREFIXES.find((p) => pathname.startsWith(p));
      if (prefix) router.navigate({ to: prefix.slice(0, -1) });
    },
    [queryClient, router],
  );

  useEffect(() => {
    if (workspaces.length === 0) return;
    if (workspaces.some((w) => w.id === activeId)) return;
    applyWorkspace(workspaces[0].id);
  }, [workspaces, activeId, applyWorkspace]);

  const activeWorkspace =
    workspaces.find((w) => w.id === activeId) ?? workspaces[0] ?? null;

  return { workspaces, activeWorkspace, switchWorkspace: applyWorkspace };
}

export const useWorkspaceSwitcher = () => {
  const queryClient = useQueryClient();
  const { workspaces, activeWorkspace, switchWorkspace } = useActiveWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: createWorkspace, isPending } = useMutation({
    ...createWorkspaceOptions,
    onSuccess: (ws: Workspace) => {
      toast.success(`Workspace "${ws.name}" created`);
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces() });
      switchWorkspace(ws.id);
      setIsCreating(false);
      setNewName("");
      setIsOpen(false);
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Takes the name so a caller holding its own draft — the shared switcher
  // does — need not push it through this hook's state first and then wait a
  // tick for the write to land.
  const handleCreate = (name?: string) => {
    const trimmed = (name ?? newName).trim();
    if (!trimmed) return;
    createWorkspace({ name: trimmed });
  };

  return {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    isOpen,
    setIsOpen,
    isCreating,
    setIsCreating,
    newName,
    setNewName,
    dropdownRef,
    isPending,
    handleCreate,
  };
};
