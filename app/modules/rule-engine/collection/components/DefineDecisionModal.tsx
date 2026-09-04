import { ChevronDown, X } from "@operonstudio/icons";
import {
  Box,
  Button,
  Dropdown,
  Input,
  Modal,
  Radio,
  toast,
} from "@operonstudio/ui";
import { Fragment, useEffect, useState } from "react";
import { Field } from "#/components/field";
import { DEFAULT_VARIANT } from "#/modules/project/projectId/content-api";
import type { Condition, Decision, OperatorType, OutcomeType } from "../types";
import * as classes from "./style";

const STEPS = [
  { number: 1, label: "Rule details" },
  { number: 2, label: "Conditions" },
  { number: 3, label: "Outcome" },
] as const;

let conditionKeySeq = 0;
const newConditionKey = () => `condition-${++conditionKeySeq}`;

interface DefineDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision?: Decision | null;
  onSave?: (decision: Partial<Decision>) => void;
  selectedAttributes?: { id: string; name: string; type: string }[];
  /** Variant keys defined on the collection's current version. */
  availableVariants?: string[];
}

export const DefineDecisionModal = ({
  isOpen,
  onClose,
  decision,
  onSave,
  selectedAttributes = [],
  availableVariants = [DEFAULT_VARIANT],
}: DefineDecisionModalProps) => {
  const variantOptions = availableVariants.map((key) => ({
    value: key,
    label: key === DEFAULT_VARIANT ? `${key} (fallback)` : key,
  }));
  const [activeStep, setActiveStep] = useState<number>(1);
  const [outcome, setOutcome] = useState<OutcomeType>(
    decision?.outcome === "hidden" ? "hidden" : "visible",
  );
  const [variant, setVariant] = useState(decision?.variant || DEFAULT_VARIANT);
  const [label, setLabel] = useState(decision?.label || "");
  const [description, setDescription] = useState(decision?.description || "");
  const [priority, setPriority] = useState(decision?.priority || 1);
  const [conditions, setConditions] = useState<Condition[]>(
    decision?.conditions || [],
  );
  // A condition has no id of its own, but the rows are editable, so React needs
  // a key that survives editing and reordering. Indices would make a removal
  // re-key every row below it and carry the wrong input state upward.
  const [conditionKeys, setConditionKeys] = useState<string[]>(() =>
    (decision?.conditions || []).map(() => newConditionKey()),
  );

  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
      // Coerce legacy outcomes (redirect/transform) that may still live in the
      // database into a safe default so the modal can still edit them.
      setOutcome(decision?.outcome === "hidden" ? "hidden" : "visible");
      setVariant(decision?.variant || DEFAULT_VARIANT);
      setLabel(decision?.label || "");
      setDescription(decision?.description || "");
      setPriority(decision?.priority || 1);
      const next = decision?.conditions || [];
      setConditions(next);
      setConditionKeys(next.map(() => newConditionKey()));
    }
  }, [decision, isOpen]);

  const handleSave = () => {
    if (!label.trim()) {
      setActiveStep(1);
      toast.error("Please enter a decision label.");
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
        // A gate does not name a payload, so hidden rules clear it rather than
        // carrying a stale key that would confuse the next reader.
        variant: outcome === "visible" ? variant : "",
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
    setConditionKeys([...conditionKeys, newConditionKey()]);
  };

  const updateCondition = (index: number, patch: Partial<Condition>) => {
    setConditions(
      conditions.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
    setConditionKeys(conditionKeys.filter((_, i) => i !== index));
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
            <Button
              variant="outline"
              onClick={onClose}
              style={{ fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              style={{ fontWeight: 600 }}
            >
              Save Decision
            </Button>
          </Box>
        </Box>
      }
    >
      <Box {...classes.modalBodyStyle}>
        <Box {...classes.stepperStyle}>
          {STEPS.map((step, index) => (
            <Fragment key={step.number}>
              {index > 0 && (
                <Box
                  {...classes.stepConnectorStyle}
                  style={{
                    backgroundColor:
                      activeStep > index
                        ? "var(--operon-color-primary)"
                        : "var(--operon-color-border)",
                  }}
                />
              )}
              <button
                type="button"
                {...classes.stepStyle}
                onClick={() => setActiveStep(step.number)}
                aria-current={activeStep === step.number ? "step" : undefined}
              >
                <Box
                  {...classes.stepMarkerStyle}
                  style={{
                    backgroundColor:
                      activeStep === step.number
                        ? "var(--operon-color-primary)"
                        : "var(--operon-color-surface-sunken)",
                    color:
                      activeStep === step.number
                        ? "var(--operon-color-text-inverse)"
                        : "var(--operon-color-text-muted)",
                  }}
                >
                  {activeStep > step.number ? "\u2713" : step.number}
                </Box>
                <Box
                  {...classes.stepLabelStyle}
                  style={{
                    fontWeight: activeStep === step.number ? 600 : 500,
                    color:
                      activeStep === step.number
                        ? "var(--operon-color-text-strong)"
                        : "var(--operon-color-text-muted)",
                  }}
                >
                  {step.label}
                </Box>
              </button>
            </Fragment>
          ))}
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
                  <Field
                    label="Decision label"
                    htmlFor="decision-label"
                    required
                  >
                    <Input
                      id="decision-label"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="e.g. Hide pricing for guests"
                    />
                  </Field>
                </Box>
                <Box style={{ width: "130px" }}>
                  <Field label="Priority" htmlFor="decision-priority">
                    <Input
                      id="decision-priority"
                      type="number"
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                      min={1}
                    />
                  </Field>
                </Box>
              </Box>
              <Field label="Description" htmlFor="decision-description">
                <Input
                  id="decision-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="When and why this rule should fire"
                />
              </Field>
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
                No conditions set yet. Click "+ Add Condition" to define context
                rules.
              </Box>
            ) : (
              <Box {...classes.conditionListStyle}>
                {conditions.map((cond, index) => (
                  <Box
                    key={conditionKeys[index]}
                    {...classes.conditionRowStyle}
                  >
                    {/* Attribute */}
                    <Box {...classes.conditionFieldStyle}>
                      <Field
                        label="Context variable"
                        id={`condition-${index}-attribute-label`}
                      >
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
                      </Field>
                    </Box>

                    {/* Operator */}
                    <Box {...classes.conditionFieldStyle}>
                      <Field
                        label="Operator"
                        id={`condition-${index}-operator-label`}
                      >
                        <Dropdown
                          onSelect={(val) =>
                            updateCondition(index, {
                              operator: val as OperatorType,
                            })
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
                      </Field>
                    </Box>

                    {/* Value */}
                    <Box {...classes.conditionFieldStyle}>
                      <Field
                        label="Expected value"
                        htmlFor={`condition-${index}-value`}
                      >
                        <Input
                          id={`condition-${index}-value`}
                          value={String(cond.value ?? "")}
                          onChange={(e) =>
                            updateCondition(index, { value: e.target.value })
                          }
                          placeholder="e.g. US, true, 10"
                          style={{ fontSize: "13px" }}
                        />
                      </Field>
                    </Box>

                    {/* Remove */}
                    <Box {...classes.conditionRemoveStyle}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(index)}
                        aria-label={`Remove condition ${index + 1}`}
                        style={{
                          padding: "6px",
                          minWidth: 0,
                          color: "var(--operon-color-text-muted)",
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </Box>
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
                label="Hidden — return an empty response"
                checked={outcome === "hidden"}
                onChange={() => setOutcome("hidden")}
              />
            </Box>

            {/* Which payload to serve. This is what makes a rule a choice
                rather than a switch: without it, serving Spanish copy meant a
                second collection at a second URL that the client had to pick
                between itself. */}
            {outcome === "visible" && (
              <Box style={{ marginTop: "20px" }}>
                <Field label="Serve this variant" id="decision-variant-label">
                  <Dropdown
                    onSelect={setVariant}
                    containerStyle={{ width: "100%" }}
                    items={variantOptions}
                    trigger={
                      <Button
                        variant="outline"
                        aria-labelledby="decision-variant-label"
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {variantOptions.find((o) => o.value === variant)
                          ?.label ?? "default"}
                        <ChevronDown size={16} />
                      </Button>
                    }
                  />
                </Field>
                <Box
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    color: "var(--operon-color-text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {availableVariants.length > 1
                    ? "The default is served when no rule matches."
                    : "This collection has only a default payload. Add a variant on the Content tab to give this rule something else to serve."}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};
