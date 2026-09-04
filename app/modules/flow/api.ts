import { mutationOptions } from "@tanstack/react-query";
import { getActiveScope } from "#/common/active-scope";
import { Endpoints } from "#/common/api/endpoints";
import { operonApiClient } from "#/libs/apiClient";

/** One condition, and how it fared against the supplied attributes. */
export interface ConditionTrace {
  attribute: string;
  operator: string;
  expected: unknown;
  actual?: string;
  present: boolean;
  matched: boolean;
  /** The declared type the comparison used. Undeclared attributes read as strings. */
  type: string;
}

export interface DecisionTrace {
  id: string;
  label: string;
  priority: number;
  enabled: boolean;
  outcome: string;
  variant?: string;
  matched: boolean;
  /** Only the first matching decision is applied. */
  applied: boolean;
  /** Set when the decision was not evaluated at all, such as "disabled". */
  skipped?: string;
  conditions: ConditionTrace[];
}

export interface Attribute {
  id: string;
  name: string;
  type: string;
}

export interface Simulation {
  version: number;
  outcome: string;
  variant: string;
  fellBack: boolean;
  data: Record<string, unknown>;
  decisions: DecisionTrace[];
  availableAttributes: Attribute[];
}

/**
 * Asks the server what a request carrying these attributes would receive.
 *
 * Deliberately a round trip rather than evaluating in the browser: a
 * re-implementation of the matching would drift from what actually gets served,
 * and a simulator you cannot trust is worse than none.
 */
export const simulateOptions = (projectId: string, collectionId: string) =>
  mutationOptions({
    mutationFn: async (attributes: Record<string, string>) => {
      const { workspaceId, environmentId, hasEnvironment } = getActiveScope();
      if (!hasEnvironment)
        throw new Error("No active workspace or environment");
      return await operonApiClient.post<Simulation>(
        Endpoints.composeEndpoints.COLLECTION_SIMULATE(
          workspaceId,
          environmentId,
          projectId,
          collectionId,
        ),
        { attributes },
      );
    },
  });
