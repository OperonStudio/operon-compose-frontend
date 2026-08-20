import { ChevronDown, X } from "@operonstudio/icons";
import { Box, Button, Dropdown, Input, Modal, Radio, toast } from "@operonstudio/ui";
import { useEffect, useState } from "react";
import type { Condition, Decision, OutcomeType } from "../types";

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
  const [activeStep, setActiveStep] = useState<number>(1);
  const [outcome, setOutcome] = useState<OutcomeType>(
    decision?.outcome || "visible",
  );
  const [label, setLabel] = useState(decision?.label || "");
  const [description, setDescription] = useState(decision?.description || "");
  const [priority, setPriority] = useState(decision?.priority || 1);
  const [redirectUrl, setRedirectUrl] = useState(decision?.redirectUrl || "");
  const [transformKey, setTransformKey] = useState(
    decision?.transformKey || "",
  );
  const [conditions, setConditions] = useState<Condition[]>(
    decision?.conditions || [],
  );

  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
      setOutcome(decision?.outcome || "visible");
      setLabel(decision?.label || "");
      setDescription(decision?.description || "");
      setPriority(decision?.priority || 1);
      setRedirectUrl(decision?.redirectUrl || "");
      setTransformKey(decision?.transformKey || "");
      setConditions(decision?.conditions || []);
    }
  }, [decision, isOpen]);

  const handleSave = () => {
    if (!label.trim()) {
      setActiveStep(1);
      toast.error("Please enter a decision label.");
      return;
    }

    if (outcome === "redirect" && !redirectUrl.trim()) {
      setActiveStep(3);
      toast.error("Please specify a target Redirect URL.");
      return;
    }

    if (outcome === "transform" && !transformKey.trim()) {
      setActiveStep(3);
      toast.error("Please specify a Transform key.");
      return;
    }

    if (onSave) {
      onSave({
        id: decision?.id,
        label: label.trim(),
        description: description.trim() || undefined,
        priority: Number(priority),
        enabled: decision?.enabled ?? true,
        outcome,
        redirectUrl: outcome === "redirect" ? redirectUrl.trim() : undefined,
        transformKey: outcome === "transform" ? transformKey.trim() : undefined,
        conditions,
      });
    }
    onClose();
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        attribute: selectedAttributes[0]?.name || "",
        operator: "=",
        value: "",
      },
    ]);
  };

  const updateCondition = (index: number, patch: Partial<Condition>) => {
    setConditions(
      conditions.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const OPERATORS = [
    { value: "=", label: "Equals (=)" },
    { value: "!=", label: "Not Equals (!=)" },
    { value: "contains", label: "Contains" },
    { value: ">", label: "Greater Than (>)" },
    { value: "<", label: "Less Than (<)" },
    { value: ">=", label: "Greater or Equal (>=)" },
    { value: "<=", label: "Less or Equal (<=)" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={decision ? "Edit Rule Decision" : "Define New Rule Decision"}
      footer={
        <Box
          display="flex"
          justify="space-between"
          align="center"
          style={{ width: "100%" }}
        >
          <Box display="flex" gap="8px">
            {activeStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setActiveStep(activeStep - 1)}
                style={{ fontWeight: 600 }}
              >
                Back
              </Button>
            )}
            {activeStep < 3 && (
              <Button
                variant="outline"
                onClick={() => setActiveStep(activeStep + 1)}
                style={{ fontWeight: 600 }}
              >
                Next Step
              </Button>
            )}
          </Box>

          <Box display="flex" gap="12px">
            <Button variant="outline" onClick={onClose} style={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} style={{ fontWeight: 600 }}>
              Save Decision
            </Button>
          </Box>
        </Box>
      }
    >
      <Box
        display="flex"
        direction="column"
        style={{
          minHeight: "340px",
          maxHeight: "calc(78vh - 120px)",
          overflowY: "auto",
        }}
      >
        {/* ── Timeline Progress Indicator ── */}
        <Box
          display="flex"
          align="center"
          justify="space-between"
          style={{
            padding: "4px 8px 20px",
            borderBottom: "1px solid var(--operon-color-border)",
            marginBottom: "20px",
          }}
        >
          {/* Step 1: Rule Details */}
          <Box
            display="flex"
            align="center"
            gap="10px"
            style={{ cursor: "pointer" }}
            onClick={() => setActiveStep(1)}
          >
            <Box
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background:
                  activeStep === 1
                    ? "var(--operon-color-primary)"
                    : activeStep > 1
                    ? "var(--operon-color-primary)"
                    : "var(--operon-color-surface-raised, #e2e8f0)",
                color: activeStep >= 1 ? "#ffffff" : "var(--operon-color-text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                transition: "all 0.2s ease",
              }}
            >
              {activeStep > 1 ? "✓" : "1"}
            </Box>
            <Box
              style={{
                fontSize: "13px",
                fontWeight: activeStep === 1 ? 700 : 500,
                color:
                  activeStep === 1
                    ? "var(--operon-color-text)"
                    : "var(--operon-color-text-muted)",
              }}
            >
              Rule Details
            </Box>
          </Box>

          {/* Timeline Line 1-2 */}
          <Box
            style={{
              flex: 1,
              height: "2px",
              margin: "0 16px",
              background:
                activeStep > 1
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-border)",
              transition: "background 0.2s ease",
            }}
          />

          {/* Step 2: Conditions */}
          <Box
            display="flex"
            align="center"
            gap="10px"
            style={{ cursor: "pointer" }}
            onClick={() => setActiveStep(2)}
          >
            <Box
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background:
                  activeStep === 2
                    ? "var(--operon-color-primary)"
                    : activeStep > 2
                    ? "var(--operon-color-primary)"
                    : "var(--operon-color-surface-raised, #e2e8f0)",
                color: activeStep >= 2 ? "#ffffff" : "var(--operon-color-text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                transition: "all 0.2s ease",
              }}
            >
              {activeStep > 2 ? "✓" : "2"}
            </Box>
            <Box
              style={{
                fontSize: "13px",
                fontWeight: activeStep === 2 ? 700 : 500,
                color:
                  activeStep === 2
                    ? "var(--operon-color-text)"
                    : "var(--operon-color-text-muted)",
              }}
            >
              Conditions ({conditions.length})
            </Box>
          </Box>

          {/* Timeline Line 2-3 */}
          <Box
            style={{
              flex: 1,
              height: "2px",
              margin: "0 16px",
              background:
                activeStep > 2
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-border)",
              transition: "background 0.2s ease",
            }}
          />

          {/* Step 3: Outcome Strategy */}
          <Box
            display="flex"
            align="center"
            gap="10px"
            style={{ cursor: "pointer" }}
            onClick={() => setActiveStep(3)}
          >
            <Box
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background:
                  activeStep === 3
                    ? "var(--operon-color-primary)"
                    : "var(--operon-color-surface-raised, #e2e8f0)",
                color: activeStep === 3 ? "#ffffff" : "var(--operon-color-text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                transition: "all 0.2s ease",
              }}
            >
              3
            </Box>
            <Box
              style={{
                fontSize: "13px",
                fontWeight: activeStep === 3 ? 700 : 500,
                color:
                  activeStep === 3
                    ? "var(--operon-color-text)"
                    : "var(--operon-color-text-muted)",
              }}
            >
              Outcome Strategy
            </Box>
          </Box>
        </Box>

        {/* ── STEP 1: Rule Details ── */}
        {activeStep === 1 && (
          <Box
            style={{
              background: "var(--operon-color-surface)",
              border: "1px solid var(--operon-color-border)",
              borderRadius: "var(--operon-radius-lg, 8px)",
              padding: "20px",
            }}
          >
            <Box
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--operon-color-text-muted)",
                letterSpacing: "1.2px",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              Rule Identification & Priority
            </Box>
            <Box display="flex" direction="column" gap="16px">
              <Box display="flex" gap="16px">
                <Box style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--operon-color-text)",
                      marginBottom: "6px",
                    }}
                  >
                    Decision Label *
                  </label>
                  <Input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Redirect EU users or Hide pricing for guests"
                  />
                </Box>
                <Box style={{ width: "130px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--operon-color-text)",
                      marginBottom: "6px",
                    }}
                  >
                    Priority Order
                  </label>
                  <Input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    min={1}
                  />
                </Box>
              </Box>
              <Box>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--operon-color-text)",
                    marginBottom: "6px",
                  }}
                >
                  Description (Optional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain when and why this rule should execute..."
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* ── STEP 2: Conditions Builder ── */}
        {activeStep === 2 && (
          <Box
            style={{
              background: "var(--operon-color-surface)",
              border: "1px solid var(--operon-color-border)",
              borderRadius: "var(--operon-radius-lg, 8px)",
              padding: "20px",
            }}
          >
            <Box
              display="flex"
              justify="space-between"
              align="center"
              style={{ marginBottom: "16px" }}
            >
              <Box
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--operon-color-text-muted)",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                Conditions (All Must Match)
              </Box>
              <Button
                variant="outline"
                size="sm"
                onClick={addCondition}
                style={{ fontWeight: 600 }}
              >
                + Add Condition
              </Button>
            </Box>

            {conditions.length === 0 ? (
              <Box
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--operon-color-text-muted)",
                  fontSize: "13px",
                }}
              >
                No conditions set yet. Click "+ Add Condition" to define context rules.
              </Box>
            ) : (
              <Box
                display="flex"
                direction="column"
                gap="12px"
                style={{
                  maxHeight: "320px",
                  overflowY: "auto",
                  paddingRight: "6px",
                }}
              >
                {conditions.map((cond, index) => (
                  <Box
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1.2fr 1.5fr auto",
                      gap: "12px",
                      alignItems: "center",
                      border: "1px solid var(--operon-color-border)",
                      borderRadius: "6px",
                      padding: "12px 14px",
                      background: "var(--operon-color-surface-sunken)",
                    }}
                  >
                    {/* Attribute */}
                    <Box>
                      <label
                        style={{
                          display: "block",
                          fontSize: "10px",
                          fontWeight: 700,
                          marginBottom: "4px",
                          color: "var(--operon-color-text-muted)",
                        }}
                      >
                        CONTEXT VARIABLE
                      </label>
                      <Dropdown
                        onSelect={(val) =>
                          updateCondition(index, { attribute: val })
                        }
                        trigger={
                          <Button
                            variant="outline"
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                              fontWeight: 500,
                              fontSize: "13px",
                            }}
                          >
                            {cond.attribute || "Select…"}
                            <ChevronDown size={12} />
                          </Button>
                        }
                        items={
                          selectedAttributes.length > 0
                            ? selectedAttributes.map((a) => ({
                                value: a.name,
                                label: a.name,
                              }))
                            : [
                                {
                                  value: cond.attribute,
                                  label: cond.attribute || "—",
                                },
                              ]
                        }
                      />
                    </Box>

                    {/* Operator */}
                    <Box>
                      <label
                        style={{
                          display: "block",
                          fontSize: "10px",
                          fontWeight: 700,
                          marginBottom: "4px",
                          color: "var(--operon-color-text-muted)",
                        }}
                      >
                        OPERATOR
                      </label>
                      <Dropdown
                        onSelect={(val) =>
                          updateCondition(index, { operator: val as any })
                        }
                        trigger={
                          <Button
                            variant="outline"
                            style={{
                              width: "100%",
                              justifyContent: "space-between",
                              fontWeight: 500,
                              fontSize: "13px",
                            }}
                          >
                            {OPERATORS.find((o) => o.value === cond.operator)
                              ?.label ?? cond.operator}
                            <ChevronDown size={12} />
                          </Button>
                        }
                        items={OPERATORS}
                      />
                    </Box>

                    {/* Value */}
                    <Box>
                      <label
                        style={{
                          display: "block",
                          fontSize: "10px",
                          fontWeight: 700,
                          marginBottom: "4px",
                          color: "var(--operon-color-text-muted)",
                        }}
                      >
                        EXPECTED VALUE
                      </label>
                      <Input
                        value={cond.value ?? ""}
                        onChange={(e) =>
                          updateCondition(index, { value: e.target.value })
                        }
                        placeholder="e.g. US or true or 10"
                        style={{ fontSize: "13px" }}
                      />
                    </Box>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(index)}
                      style={{
                        padding: "6px",
                        minWidth: 0,
                        color: "var(--operon-color-text-muted)",
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* ── STEP 3: Outcome Selection ── */}
        {activeStep === 3 && (
          <Box
            style={{
              background: "var(--operon-color-surface)",
              border: "1px solid var(--operon-color-border)",
              borderRadius: "var(--operon-radius-lg, 8px)",
              padding: "20px",
            }}
          >
            <Box
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--operon-color-text-muted)",
                letterSpacing: "1.2px",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              Select Rule Outcome Strategy
            </Box>

            <Box
              display="grid"
              style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}
            >
              <Radio
                name="outcome"
                value="visible"
                label="Visible — Allow content response"
                checked={outcome === "visible"}
                onChange={() => setOutcome("visible")}
              />
              <Radio
                name="outcome"
                value="hidden"
                label="Hidden — Suppress content response"
                checked={outcome === "hidden"}
                onChange={() => setOutcome("hidden")}
              />
              <Radio
                name="outcome"
                value="redirect"
                label="Redirect — Forward request to URL"
                checked={outcome === "redirect"}
                onChange={() => setOutcome("redirect")}
              />
              <Radio
                name="outcome"
                value="transform"
                label="Transform — Pluck specific key"
                checked={outcome === "transform"}
                onChange={() => setOutcome("transform")}
              />
            </Box>

            {/* Conditional Outcome Inputs */}
            {outcome === "redirect" && (
              <Box style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--operon-color-text)",
                    marginBottom: "6px",
                  }}
                >
                  Target Redirect URL *
                </label>
                <Input
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://cdn.operon.io/v2/fallback-content"
                />
              </Box>
            )}

            {outcome === "transform" && (
              <Box style={{ marginTop: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--operon-color-text)",
                    marginBottom: "6px",
                  }}
                >
                  JSON Transform Property Key *
                </label>
                <Input
                  value={transformKey}
                  onChange={(e) => setTransformKey(e.target.value)}
                  placeholder="e.g. features or userPayload"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};
