// Rule outcomes. The old `redirect` and `transform` outcomes let a
// client-authored URL or key drive server-side behaviour and were removed.
export type OutcomeType = "visible" | "hidden";

export type OperatorType = "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains";

export interface Condition {
  attribute: string;
  operator: OperatorType;
  /** Compared against the query value using the attribute's declared type. */
  value: string | number | boolean;
}

export interface Decision {
  id: string;
  label: string;
  description?: string;
  priority: number;
  enabled: boolean;
  outcome: OutcomeType;
  /**
   * Which payload to serve when this rule matches and the outcome is visible.
   * Empty means the default variant, which is how a rule acts as a plain gate.
   */
  variant?: string;
  conditions: Condition[];
}
