import { useSyncExternalStore } from "react";
import {
  type ActiveScope,
  getActiveScope,
  getServerScope,
  subscribeToScope,
} from "./active-scope";

/**
 * The active workspace and environment, as reactive state.
 *
 * Any screen whose queries are keyed by the scope has to use this rather than
 * calling `getActiveScope()` during render. That call is a snapshot: a screen
 * mounted before the environment had resolved kept the empty one it read, its
 * queries stayed disabled, and the page showed an empty state until something
 * else happened to re-render it.
 */
export function useActiveScope(): ActiveScope {
  return useSyncExternalStore(subscribeToScope, getActiveScope, getServerScope);
}
