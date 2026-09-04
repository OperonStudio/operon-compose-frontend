import { css } from "@morph-css/kit";

/**
 * Layout for the decision editor.
 *
 * The pieces here were all inline styles, which cannot carry media queries, so
 * the dialog kept its desktop shape on a phone: a three-step header with two
 * flexible connectors, and a four-column condition row whose dropdowns ended up
 * about 70px wide.
 */

export const modalBodyStyle = css({
  display: "flex",
  flexDirection: "column",
  minHeight: "240px",
  // The dialog's own body scrolls, independently of the shell.
  maxHeight: "calc(100vh - 220px)",
  overflowY: "auto",
  "@media (min-width: 641px)": {
    minHeight: "340px",
  },
});

// ── Stepper ─────────────────────────────────────────────────────────────────

export const stepperStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  padding: "0 2px 16px",
  borderBottom: "1px solid var(--operon-color-border)",
  marginBottom: "20px",
  "@media (min-width: 641px)": {
    padding: "4px 8px 20px",
  },
});

export const stepStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  color: "inherit",
  minWidth: 0,
});

export const stepMarkerStyle = css({
  width: "26px",
  height: "26px",
  borderRadius: "var(--operon-radius-full)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 600,
  flexShrink: 0,
  transition:
    "background-color var(--operon-motion-fast) var(--operon-motion-easing)",
});

/** Hidden on narrow screens; the numbered markers carry the sequence there. */
export const stepLabelStyle = css({
  display: "none",
  fontSize: "13px",
  whiteSpace: "nowrap",
  "@media (min-width: 641px)": {
    display: "block",
  },
});

export const stepConnectorStyle = css({
  flex: 1,
  height: "2px",
  minWidth: "12px",
  margin: "0 4px",
  transition:
    "background-color var(--operon-motion-fast) var(--operon-motion-easing)",
  "@media (min-width: 641px)": {
    margin: "0 16px",
  },
});

// ── Conditions ──────────────────────────────────────────────────────────────

export const conditionListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  maxHeight: "320px",
  overflowY: "auto",
  paddingRight: "4px",
});

/**
 * One column per field on a phone, with the remove button pinned to the row
 * header. Four columns only once there is room for them.
 */
export const conditionRowStyle = css({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "10px",
  alignItems: "start",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-sm)",
  padding: "12px",
  backgroundColor: "var(--operon-color-surface-sunken)",
  "@media (min-width: 721px)": {
    gridTemplateColumns: "1.2fr 1.2fr 1.5fr auto",
    gap: "12px",
    alignItems: "center",
    padding: "12px 14px",
  },
});

/** Spans the full width on a phone so each field gets a usable control. */
export const conditionFieldStyle = css({
  gridColumn: "1 / -1",
  minWidth: 0,
  "@media (min-width: 721px)": {
    gridColumn: "auto",
  },
});

/** Sits beside the first field on a phone, at the end of the row on desktop. */
export const conditionRemoveStyle = css({
  gridColumn: "2",
  gridRow: "1",
  alignSelf: "start",
  "@media (min-width: 721px)": {
    gridColumn: "auto",
    gridRow: "auto",
    alignSelf: "center",
  },
});
