import { X, ChevronDown } from "@operon/icons";
import { Box, Button, Input, Modal, Radio, Dropdown, toast } from "@operon/ui";
import type { Condition, Decision } from "../types";
import { useEffect, useState } from "react";

interface DefineDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision?: Decision | null;
  onSave?: (decision: Partial<Decision>) => void;
  selectedAttributes?: { id: string; name: string; type: string }[];
}

export const DefineDecisionModal = ({
  isOpen,
  onClose,
  decision,
  onSave,
  selectedAttributes = [],
}: DefineDecisionModalProps) => {
  const [outcome, setOutcome] = useState<"Visible" | "Invisible">(
    decision?.outcome || "Visible",
  );
  const [label, setLabel] = useState(decision?.label || "");
  const [priority, setPriority] = useState(decision?.priority || 1);
  const [matchType, setMatchType] = useState<"ANY" | "ALL">(
    (decision?.matchType as "ANY" | "ALL") || "ANY",
  );
  const [conditions, setConditions] = useState<Condition[]>(
    decision?.conditions || [],
  );

  useEffect(() => {
    if (isOpen) {
      setOutcome(decision?.outcome || "Visible");
      setLabel(decision?.label || "");
      setPriority(decision?.priority || 1);
      setMatchType((decision?.matchType as "ANY" | "ALL") || "ANY");
      setConditions(decision?.conditions || []);
    }
  }, [decision, isOpen]);

  const handleSave = () => {
    if (!label.trim()) {
      toast.error("Please enter a logic label.");
      return;
    }

    if (onSave) {
      onSave({
        id: decision?.id,
        label: label.trim(),
        priority: Number(priority),
        outcome,
        conditions,
        matchType,
      });
    }
    onClose();
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Math.random().toString(36).substring(7),
        attribute: selectedAttributes[0]?.name || "",
        operator: "equals",
        values: [],
      },
    ]);
  };

  const updateCondition = (id: string, patch: Partial<Condition>) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const OPERATORS = [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Define Decision"
      footer={
        <Box display="flex" justify="flex-end" gap="12px" style={{ width: "100%" }}>
          <Button variant="outline" onClick={onClose} style={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ fontWeight: 600 }}>
            Save Decision
          </Button>
        </Box>
      }
    >
      <Box display="flex" direction="column" gap="24px">

        {/* ── Identification ── */}
        <Box
          style={{
            background: "var(--operon-color-surface)",
            border: "1px solid var(--operon-color-border)",
            borderRadius: "var(--operon-radius-lg, 8px)",
            padding: "24px",
          }}
        >
          <Box
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--operon-color-text-muted)",
              letterSpacing: "1.2px",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            Identification
          </Box>
          <Box display="flex" gap="20px">
            <Box style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--operon-color-text)", marginBottom: "8px" }}>
                Logic Label
              </label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Show banner for premium users"
              />
            </Box>
            <Box style={{ width: "130px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--operon-color-text)", marginBottom: "8px" }}>
                Priority
              </label>
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min={1}
              />
            </Box>
          </Box>
        </Box>

        {/* ── Conditions ── */}
        <Box
          style={{
            background: "var(--operon-color-surface)",
            border: "1px solid var(--operon-color-border)",
            borderRadius: "var(--operon-radius-lg, 8px)",
            padding: "24px",
          }}
        >
          {/* Header */}
          <Box display="flex" justify="space-between" align="center" style={{ marginBottom: "16px" }}>
            <Box
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--operon-color-text-muted)",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              Conditions
            </Box>
            <Box display="flex" align="center" gap="12px">
              {/* Match type toggle */}
              {conditions.length > 1 && (
                <Box display="flex" align="center" gap="8px">
                  <span style={{ fontSize: "12px", color: "var(--operon-color-text-muted)" }}>Match</span>
                  <Box display="flex" style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid var(--operon-color-border)" }}>
                    {(["ANY", "ALL"] as const).map((mt) => (
                      <button
                        key={mt}
                        type="button"
                        onClick={() => setMatchType(mt)}
                        style={{
                          padding: "4px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: matchType === mt ? "var(--operon-color-primary)" : "transparent",
                          color: matchType === mt ? "#fff" : "var(--operon-color-text-muted)",
                          transition: "background 0.15s",
                        }}
                      >
                        {mt}
                      </button>
                    ))}
                  </Box>
                </Box>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={addCondition}
                style={{ color: "#ea580c", borderColor: "#fed7aa", background: "#fff7ed", fontWeight: 600 }}
              >
                + Add Condition
              </Button>
            </Box>
          </Box>

          {/* Condition rows */}
          {conditions.length === 0 ? (
            <Box style={{ textAlign: "center", padding: "24px 0", color: "var(--operon-color-text-muted)", fontSize: "13px" }}>
              No conditions yet — click "+ Add Condition" to get started.
            </Box>
          ) : (
            <Box display="flex" direction="column" gap="12px">
              {conditions.map((cond, index) => (
                <Box key={cond.id}>
                  {/* Connector badge between rows */}
                  {index > 0 && (
                    <Box style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                      <Box
                        style={{
                          background: "var(--operon-color-primary)",
                          color: "#fff",
                          borderRadius: "16px",
                          padding: "3px 14px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {matchType}
                      </Box>
                    </Box>
                  )}
                  {/* Row */}
                  <Box
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 160px 1fr auto",
                      gap: "12px",
                      alignItems: "flex-end",
                      border: "1px solid var(--operon-color-border)",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      background: "var(--operon-color-background, #f9f9ff)",
                    }}
                  >
                    {/* Attribute */}
                    <Box>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px", color: "var(--operon-color-text-muted)" }}>
                        ATTRIBUTE
                      </label>
                      <Dropdown
                        onSelect={(val) => updateCondition(cond.id, { attribute: val })}
                        trigger={
                          <Button
                            variant="outline"
                            style={{ width: "100%", justifyContent: "space-between", fontWeight: 400, fontSize: "13px" }}
                          >
                            {cond.attribute || "Select…"}
                            <ChevronDown size={12} />
                          </Button>
                        }
                        items={
                          selectedAttributes.length > 0
                            ? selectedAttributes.map((a) => ({ value: a.name, label: a.name }))
                            : [{ value: cond.attribute, label: cond.attribute || "—" }]
                        }
                      />
                    </Box>

                    {/* Operator */}
                    <Box>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px", color: "var(--operon-color-text-muted)" }}>
                        OPERATOR
                      </label>
                      <Dropdown
                        onSelect={(val) => updateCondition(cond.id, { operator: val })}
                        trigger={
                          <Button
                            variant="outline"
                            style={{ width: "100%", justifyContent: "space-between", fontWeight: 400, fontSize: "13px" }}
                          >
                            {OPERATORS.find((o) => o.value === cond.operator)?.label ?? cond.operator}
                            <ChevronDown size={12} />
                          </Button>
                        }
                        items={OPERATORS}
                      />
                    </Box>

                    {/* Values */}
                    <Box>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px", color: "var(--operon-color-text-muted)" }}>
                        VALUES (comma-separated)
                      </label>
                      <Input
                        value={cond.values.join(", ")}
                        onChange={(e) => {
                          const vals = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          updateCondition(cond.id, { values: vals });
                        }}
                        placeholder="value1, value2"
                        style={{ fontSize: "13px" }}
                      />
                    </Box>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(cond.id)}
                      style={{ padding: "8px", minWidth: 0, color: "var(--operon-color-text-muted)", alignSelf: "flex-end" }}
                    >
                      <X size={16} />
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ── Outcome ── */}
        <Box
          style={{
            background: "var(--operon-color-surface)",
            border: "1px solid var(--operon-color-border)",
            borderRadius: "var(--operon-radius-lg, 8px)",
            padding: "24px",
          }}
        >
          <Box
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--operon-color-text-muted)",
              letterSpacing: "1.2px",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            When matched, show content as…
          </Box>
          <Box display="flex" gap="32px">
            <Radio
              name="outcome"
              value="Visible"
              label="Visible (return data)"
              checked={outcome === "Visible"}
              onChange={() => setOutcome("Visible")}
            />
            <Radio
              name="outcome"
              value="Invisible"
              label="Invisible (hide data)"
              checked={outcome === "Invisible"}
              onChange={() => setOutcome("Invisible")}
            />
          </Box>
        </Box>

      </Box>
    </Modal>
  );
};
