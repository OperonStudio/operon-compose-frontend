import {
  type Workspace,
  createWorkspaceOptions,
  getWorkspacesOptions,
} from "#/components/workspace-switcher/api";
import { toast } from "@operon/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const ACTIVE_WORKSPACE_KEY = "operon_active_workspace_id";

function getStoredWorkspaceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_WORKSPACE_KEY);
}

function storeWorkspaceId(id: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
  }
}

export function useActiveWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data } = useQuery(getWorkspacesOptions);
  const workspaces = data || [];
  const [activeId, setActiveId] = useState<string | null>(getStoredWorkspaceId);

  const handleRedirect = () => {
    const pathname = router.state.location.pathname;
    if (pathname.startsWith("/projects/")) router.navigate({ to: "/projects" });
    else if (pathname.startsWith("/rule-engine/"))
      router.navigate({ to: "/rule-engine" });
    else if (pathname.startsWith("/api-keys/"))
      router.navigate({ to: "/api-keys" });
  };

  useEffect(() => {
    if (workspaces.length > 0) {
      const isValid = workspaces.some((w) => w.id === activeId);
      if (!isValid) {
        const id = workspaces[0].id;
        setActiveId(id);
        storeWorkspaceId(id);
        queryClient.invalidateQueries();
        handleRedirect();
      }
    }
  }, [workspaces, activeId, queryClient, router]);

  const activeWorkspace =
    workspaces.find((w) => w.id === activeId) ?? workspaces[0] ?? null;

  const switchWorkspace = (id: string) => {
    setActiveId(id);
    storeWorkspaceId(id);
    queryClient.invalidateQueries();
    handleRedirect();
  };

  return { workspaces, activeWorkspace, switchWorkspace };
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
      queryClient.invalidateQueries({
        queryKey: getWorkspacesOptions.queryKey,
      });
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

  const handleCreate = () => {
    if (!newName.trim()) return;
    createWorkspace({ name: newName.trim() });
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
