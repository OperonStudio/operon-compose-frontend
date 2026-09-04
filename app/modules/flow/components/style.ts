import { css } from "@morph-css/kit";

export const simulatorStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "20px",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  backgroundColor: "var(--operon-color-surface)",
});

export const simulatorHeaderStyle = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});

export const simulatorTitleStyle = css({
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const simulatorHintStyle = css({
  marginTop: "2px",
  fontSize: "12px",
  lineHeight: 1.5,
  color: "var(--operon-color-text-muted)",
  maxWidth: "62ch",
});

export const attributeGridStyle = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "12px",
  "@media (min-width: 641px)": {
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  },
});

export const attributeLabelStyle = css({
  display: "flex",
  alignItems: "baseline",
  gap: "6px",
  marginBottom: "5px",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--operon-color-text)",
});

export const attributeTypeStyle = css({
  fontSize: "10px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--operon-color-text-subtle)",
  fontFamily: "var(--operon-typography-mono)",
});

export const resultStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  paddingTop: "16px",
  borderTop: "1px solid var(--operon-color-border-subtle)",
});

export const resultHeadlineStyle = css({
  fontSize: "13px",
  lineHeight: 1.55,
  color: "var(--operon-color-text)",
});

export const warningStyle = css({
  padding: "8px 12px",
  borderRadius: "var(--operon-radius-sm)",
  fontSize: "12px",
  lineHeight: 1.5,
  color: "var(--operon-color-warning)",
  backgroundColor: "var(--operon-color-warning-ghost)",
});

export const traceListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

/**
 * A left rule carries the verdict: primary for the decision that applied,
 * warning for one that matched but lost on priority, neutral for the rest.
 */
export const traceRowStyle = css({
  paddingLeft: "10px",
  borderLeft: "2px solid var(--operon-color-border)",
});

export const traceHeadStyle = css({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
});

export const traceLabelStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--operon-color-text)",
});

export const traceVerdictStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
});

export const conditionLineStyle = css({
  marginTop: "3px",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "11px",
  lineHeight: 1.6,
  wordBreak: "break-word",
});

export const conditionActualStyle = css({
  marginLeft: "8px",
  color: "var(--operon-color-text-subtle)",
});

export const payloadStyle = css({
  padding: "12px",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  maxHeight: "260px",
  overflowY: "auto",
});
