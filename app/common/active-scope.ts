/**
 * The active workspace and environment.
 *
 * These two ids decide which URL every Compose request goes to and which cache
 * entry it lands in, so exactly one module is allowed to read or write them.
 * They were previously touched by four different hooks through raw
 * `localStorage` calls, which is how the environment of a workspace you had
 * left could survive a switch into a workspace that never had it.
 *
 * Reads are subscribable. `getActiveScope` alone is a snapshot taken during
 * render, and a screen that took one before the environment had resolved never
 * heard that it had: the projects list stayed empty on a first visit and only
 * filled in after a reload, because nothing re-ran the query once the id
 * arrived. Components use `useActiveScope`, which re-renders on a write.
 */
const ACTIVE_WORKSPACE_KEY = "operon_active_workspace_id";
const ACTIVE_ENVIRONMENT_KEY = "operon_active_environment_id";

export interface ActiveScope {
  workspaceId: string;
  environmentId: string;
  hasWorkspace: boolean;
  hasEnvironment: boolean;
}

function read(key: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

const listeners = new Set<() => void>();

function write(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
  for (const listener of listeners) listener();
}

/** Subscribes to scope changes. The return value unsubscribes. */
export function subscribeToScope(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const EMPTY_SCOPE: ActiveScope = {
  workspaceId: "",
  environmentId: "",
  hasWorkspace: false,
  hasEnvironment: false,
};

// useSyncExternalStore compares by reference, so an unchanged scope has to give
// back the same object or every render would look like a change.
let snapshot: ActiveScope = EMPTY_SCOPE;

export function getActiveScope(): ActiveScope {
  const workspaceId = read(ACTIVE_WORKSPACE_KEY);
  const environmentId = read(ACTIVE_ENVIRONMENT_KEY);
  if (
    workspaceId !== snapshot.workspaceId ||
    environmentId !== snapshot.environmentId
  ) {
    snapshot = {
      workspaceId,
      environmentId,
      hasWorkspace: Boolean(workspaceId),
      hasEnvironment: Boolean(workspaceId && environmentId),
    };
  }
  return snapshot;
}

/** The server has no localStorage, so it renders with nothing selected. */
export const getServerScope = (): ActiveScope => EMPTY_SCOPE;

export function getActiveWorkspaceId(): string | null {
  return read(ACTIVE_WORKSPACE_KEY) || null;
}

export function getActiveEnvironmentId(): string | null {
  return read(ACTIVE_ENVIRONMENT_KEY) || null;
}

/**
 * Switches workspace and drops the active environment.
 *
 * Environments belong to a workspace, so an id carried across a switch names
 * something the new workspace cannot see. Clearing it lets the environment hook
 * pick a valid default instead of issuing requests against a foreign id.
 */
export function setActiveWorkspace(workspaceId: string) {
  const previous = read(ACTIVE_WORKSPACE_KEY);
  write(ACTIVE_WORKSPACE_KEY, workspaceId);
  if (previous !== workspaceId) write(ACTIVE_ENVIRONMENT_KEY, null);
}

export function setActiveEnvironment(environmentId: string | null) {
  write(ACTIVE_ENVIRONMENT_KEY, environmentId);
}
