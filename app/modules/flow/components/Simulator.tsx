import { Zap } from "@operonstudio/icons";
import { Box, Button, Input } from "@operonstudio/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getContextsOptions } from "#/modules/context-module/api";
import { type Simulation, simulateOptions } from "../api";
import * as classes from "./style";

interface SimulatorProps {
  projectId: string;
  collectionId: string;
}

/**
 * Runs a request against the real evaluator and shows its working.
 *
 * A rule that does not fire looks identical whether its attribute was never
 * sent, its value differed, or the rule is disabled. This is the screen that
 * tells them apart, which is otherwise the hardest thing to debug in the
 * product.
 */
export const Simulator = ({ projectId, collectionId }: SimulatorProps) => {
  const { data: contextVariables = [] } = useQuery(getContextsOptions());
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Simulation | null>(null);

  const simulate = useMutation({
    ...simulateOptions(projectId, collectionId),
    onSuccess: setResult,
  });

  const run = () => simulate.mutate(values);

  return (
    <Box {...classes.simulatorStyle}>
      <Box {...classes.simulatorHeaderStyle}>
        <Box>
          <Box {...classes.simulatorTitleStyle}>Try a request</Box>
          <Box {...classes.simulatorHintStyle}>
            These are your workspace context variables. Fill in what a real
            caller would send and see which rule wins.
          </Box>
        </Box>
        <Button
          size="sm"
          onClick={run}
          disabled={simulate.isPending}
          style={{ gap: 6 }}
        >
          <Zap size={14} /> {simulate.isPending ? "Running…" : "Run"}
        </Button>
      </Box>

      {contextVariables.length === 0 ? (
        <Box {...classes.simulatorHintStyle}>
          No context variables defined yet. Add them under Context, then rules
          can match on them.
        </Box>
      ) : (
        <Box {...classes.attributeGridStyle}>
          {contextVariables.map((variable) => (
            <Box key={variable.id}>
              <label
                {...classes.attributeLabelStyle}
                htmlFor={`sim-${variable.id}`}
              >
                {variable.name}
                <span {...classes.attributeTypeStyle}>{variable.type}</span>
              </label>
              <Input
                id={`sim-${variable.id}`}
                value={values[variable.name] ?? ""}
                placeholder={placeholderFor(variable.type)}
                onChange={(e) =>
                  setValues((current) => ({
                    ...current,
                    [variable.name]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") run();
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {result && <SimulationResult result={result} />}
    </Box>
  );
};

function SimulationResult({ result }: { result: Simulation }) {
  const applied = result.decisions.find((d) => d.applied);

  return (
    <Box {...classes.resultStyle}>
      <Box {...classes.resultHeadlineStyle}>
        {result.outcome === "hidden" ? (
          <span>
            The response would be <strong>empty</strong>, hidden by{" "}
            <strong>{applied?.label}</strong>.
          </span>
        ) : applied ? (
          <span>
            <strong>{applied.label}</strong> wins, serving the{" "}
            <strong>{result.variant}</strong> variant of v{result.version}.
          </span>
        ) : (
          <span>
            No rule matches, so the <strong>default</strong> variant of v
            {result.version} is served.
          </span>
        )}
      </Box>

      {result.fellBack && (
        <Box {...classes.warningStyle}>
          That rule points at a variant that no longer exists, so the default is
          served instead. Fix the rule or add the variant back.
        </Box>
      )}

      <Box {...classes.traceListStyle}>
        {result.decisions.map((decision) => (
          <Box
            key={decision.id}
            {...classes.traceRowStyle}
            style={{
              borderLeftColor: decision.applied
                ? "var(--operon-color-primary)"
                : decision.matched
                  ? "var(--operon-color-warning)"
                  : "var(--operon-color-border)",
            }}
          >
            <Box {...classes.traceHeadStyle}>
              <span {...classes.traceLabelStyle}>{decision.label}</span>
              <span {...classes.traceVerdictStyle}>{verdict(decision)}</span>
            </Box>

            {decision.conditions.map((condition) => (
              <Box
                key={`${condition.attribute}-${condition.operator}`}
                {...classes.conditionLineStyle}
                style={{
                  color: condition.matched
                    ? "var(--operon-color-success)"
                    : "var(--operon-color-text-muted)",
                }}
              >
                {condition.attribute} {condition.operator}{" "}
                {JSON.stringify(condition.expected)}
                <span {...classes.conditionActualStyle}>
                  {condition.present
                    ? `got ${JSON.stringify(condition.actual)} as ${condition.type}`
                    : "not sent"}
                </span>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box {...classes.payloadStyle}>
        {JSON.stringify(result.data, null, 2)}
      </Box>
    </Box>
  );
}

/** Only the first match applies, so a later match is worth naming differently. */
function verdict(decision: {
  applied: boolean;
  matched: boolean;
  skipped?: string;
}): string {
  if (decision.applied) return "applied";
  if (decision.skipped) return decision.skipped;
  if (decision.matched) return "matched, but a higher rule won";
  return "no match";
}

function placeholderFor(type: string): string {
  switch (type) {
    case "number":
      return "10";
    case "boolean":
      return "true";
    case "date":
      return "2026-01-01T00:00:00Z";
    default:
      return "US";
  }
}
