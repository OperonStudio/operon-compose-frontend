import { ArrowRight, FileEdit, X, Zap } from "@operonstudio/icons";
import { Box, Button, Chip } from "@operonstudio/ui";
import type { Decision } from "../types";

interface DecisionListProps {
  decisions: Decision[];
  onEditDecision: (decision: Decision) => void;
  onDeleteDecision: (id: string) => void;
}

export const DecisionList = ({
  decisions,
  onEditDecision,
  onDeleteDecision,
}: DecisionListProps) => {
  const getOutcomeBadge = (decision: Decision) => {
    switch (decision.outcome) {
      case "visible":
        return (
          <Chip
            variant="subtle"
            style={{
              background: "rgba(51, 214, 166, 0.12)",
              color: "#0D9A73",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Visible
          </Chip>
        );
      case "hidden":
        return (
          <Chip
            variant="subtle"
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              color: "#DC2626",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Hidden
          </Chip>
        );
      case "redirect":
        return (
          <Chip
            variant="subtle"
            style={{
              background: "rgba(61, 90, 254, 0.12)",
              color: "#3D5AFE",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Redirect
          </Chip>
        );
      case "transform":
        return (
          <Chip
            variant="subtle"
            style={{
              background: "rgba(255, 176, 32, 0.15)",
              color: "#C97B12",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Transform
          </Chip>
        );
      default:
        return null;
    }
  };

  return (
    <Box display="flex" direction="column" gap="16px">
      <Box display="flex" align="center" justify="space-between">
        <Box display="flex" align="center" gap="10px">
          <Box
            style={{
              fontWeight: 700,
              fontSize: "16px",
              color: "var(--operon-color-text)",
            }}
          >
            Evaluated Decision Pipeline
          </Box>
          <Chip
            variant="subtle"
            color="primary"
            style={{
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            {decisions.length} {decisions.length === 1 ? "rule" : "rules"}
          </Chip>
        </Box>
      </Box>

      {decisions.length === 0 ? (
        <Box
          style={{
            padding: "40px 24px",
            textAlign: "center",
            background: "var(--operon-color-surface)",
            border: "1px border var(--operon-color-border)",
            borderRadius: "var(--operon-radius-lg, 8px)",
            color: "var(--operon-color-text-muted)",
            fontSize: "14px",
          }}
        >
          No decisions defined yet. Click "+ Define Decision" to add rule logic.
        </Box>
      ) : (
        <Box display="flex" direction="column" gap="12px">
          {decisions.map((decision) => (
            <Box
              key={decision.id}
              style={{
                border: "1px solid var(--operon-color-border)",
                borderRadius: "var(--operon-radius-lg, 8px)",
                padding: "20px",
                background: "var(--operon-color-surface)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                transition: "all 0.2s ease",
              }}
            >
              {/* Header row */}
              <Box display="flex" justify="space-between" align="flex-start">
                <Box display="flex" direction="column" gap="4px">
                  <Box display="flex" align="center" gap="10px">
                    <Box
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--operon-color-text)",
                      }}
                    >
                      {decision.label}
                    </Box>
                    {getOutcomeBadge(decision)}
                    <Chip
                      variant="subtle"
                      style={{
                        background: "var(--operon-color-surface-sunken)",
                        color: "var(--operon-color-text-subtle)",
                        fontWeight: 600,
                        fontSize: "11px",
                      }}
                    >
                      Priority #{decision.priority}
                    </Chip>
                  </Box>
                  {decision.description && (
                    <Box
                      style={{
                        fontSize: "13px",
                        color: "var(--operon-color-text-muted)",
                      }}
                    >
                      {decision.description}
                    </Box>
                  )}
                </Box>

                {/* Actions */}
                <Box display="flex" align="center" gap="6px">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Edit Rule"
                    style={{ padding: "6px", minWidth: 0 }}
                    onClick={() => onEditDecision(decision)}
                  >
                    <FileEdit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Delete Rule"
                    style={{ padding: "6px", minWidth: 0 }}
                    onClick={() => onDeleteDecision(decision.id)}
                  >
                    <X size={16} />
                  </Button>
                </Box>
              </Box>

              {/* Conditions Row */}
              <Box
                display="flex"
                align="center"
                gap="8px"
                style={{ flexWrap: "wrap" }}
              >
                <Box
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--operon-color-text-subtle)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginRight: "4px",
                  }}
                >
                  IF
                </Box>
                {decision.conditions.length === 0 ? (
                  <Chip
                    variant="subtle"
                    style={{
                      fontSize: "12px",
                      color: "var(--operon-color-text-muted)",
                    }}
                  >
                    Always Matches
                  </Chip>
                ) : (
                  decision.conditions.map((cond, idx) => (
                    <Box key={idx} display="flex" align="center" gap="8px">
                      {idx > 0 && (
                        <Box
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "var(--operon-color-primary)",
                            textTransform: "uppercase",
                          }}
                        >
                          AND
                        </Box>
                      )}
                      <Chip
                        variant="subtle"
                        style={{
                          background: "var(--operon-color-surface-sunken)",
                          color: "var(--operon-color-text)",
                          fontFamily: "var(--operon-typography-mono)",
                          fontSize: "12px",
                          fontWeight: 500,
                          padding: "4px 10px",
                          border: "1px solid var(--operon-color-border)",
                        }}
                      >
                        <strong>{cond.attribute}</strong> {cond.operator}{" "}
                        <span style={{ color: "var(--operon-color-primary)" }}>
                          "{String(cond.value)}"
                        </span>
                      </Chip>
                    </Box>
                  ))
                )}
              </Box>

              {/* Outcome Extra Config Preview */}
              {decision.outcome === "redirect" && decision.redirectUrl && (
                <Box
                  display="flex"
                  align="center"
                  gap="8px"
                  style={{
                    padding: "8px 12px",
                    background: "rgba(61, 90, 254, 0.05)",
                    border: "1px solid rgba(61, 90, 254, 0.2)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#3D5AFE",
                    fontFamily: "var(--operon-typography-mono)",
                  }}
                >
                  <ArrowRight size={14} /> Redirect Target:{" "}
                  {decision.redirectUrl}
                </Box>
              )}

              {decision.outcome === "transform" && decision.transformKey && (
                <Box
                  display="flex"
                  align="center"
                  gap="8px"
                  style={{
                    padding: "8px 12px",
                    background: "rgba(255, 176, 32, 0.08)",
                    border: "1px solid rgba(255, 176, 32, 0.25)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#C97B12",
                    fontFamily: "var(--operon-typography-mono)",
                  }}
                >
                  <Zap size={14} /> Transform Key: {decision.transformKey}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
