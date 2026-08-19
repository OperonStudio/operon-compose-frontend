export type OutcomeType = "visible" | "hidden" | "redirect" | "transform";

export interface Condition {
  attribute: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains";
  value: any;
}

export interface Decision {
  id: string;
  label: string;
  description?: string;
  priority: number;
  enabled: boolean;
  outcome: OutcomeType;
  redirectUrl?: string;
  transformKey?: string;
  conditions: Condition[];
}
