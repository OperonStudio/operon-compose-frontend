import { css } from "@morph-css/kit";

// ── Content editor ──────────────────────────────────────────────────────────

export const editorPaneStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  flex: 1,
  minHeight: 0,
});

export const variantBarStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
});

export const variantTabStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "5px 12px",
  borderRadius: "var(--operon-radius-full)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  fontSize: "13px",
  fontFamily: "var(--operon-typography-mono)",
  cursor: "pointer",
  whiteSpace: "nowrap",
});

export const variantHintStyle = css({
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--operon-color-text-subtle)",
  fontFamily: "var(--operon-typography-body)",
});

export const editorStyle = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
});

export const editorFooterStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});

export const versionNoteStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
  fontVariantNumeric: "tabular-nums",
});

export const modalHintStyle = css({
  fontSize: "13px",
  lineHeight: 1.55,
  color: "var(--operon-color-text-muted)",
});

// ── History ─────────────────────────────────────────────────────────────────

export const panelEmptyStyle = css({
  padding: "32px 4px",
  fontSize: "13px",
  lineHeight: 1.55,
  color: "var(--operon-color-text-muted)",
  maxWidth: "56ch",
});

/**
 * Detail on the left, version rail on the right. The rail moves above the
 * detail on a narrow screen, where two columns would leave neither readable.
 */
export const historyLayoutStyle = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  alignItems: "start",
  "@media (min-width: 981px)": {
    gridTemplateColumns: "minmax(0, 1fr) 280px",
  },
});

export const historyDetailStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  minWidth: 0,
  order: 2,
  "@media (min-width: 981px)": {
    order: 1,
  },
});

export const historyDetailHeaderStyle = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});

export const historyDetailTitleStyle = css({
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const historyDetailMetaStyle = css({
  marginTop: "2px",
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
});

export const historyRailStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  order: 1,
  maxHeight: "520px",
  overflowY: "auto",
  paddingRight: "2px",
  "@media (min-width: 981px)": {
    order: 2,
  },
});

export const historyRailHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--operon-color-text-muted)",
  paddingBottom: "2px",
});

export const historyCountStyle = css({
  fontFamily: "var(--operon-typography-mono)",
  fontVariantNumeric: "tabular-nums",
});

export const versionCardStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "5px",
  width: "100%",
  padding: "10px 12px",
  borderRadius: "var(--operon-radius-lg)",
  backgroundColor: "var(--operon-color-surface)",
  textAlign: "left",
  cursor: "pointer",
  font: "inherit",
  color: "inherit",
  transition:
    "border-color var(--operon-motion-fast) var(--operon-motion-easing), background-color var(--operon-motion-fast) var(--operon-motion-easing)",
});

export const versionCardTopStyle = css({
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
  width: "100%",
});

export const versionCardNumberStyle = css({
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const versionCardTimeStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
  marginLeft: "auto",
});

export const versionCardWhoStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
});

export const currentMarkerStyle = css({
  marginLeft: "5px",
  color: "var(--operon-color-primary)",
  fontWeight: 600,
});

export const kindBadgeStyle = css({
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "2px 7px",
  borderRadius: "var(--operon-radius-sm)",
});

// ── Promote ─────────────────────────────────────────────────────────────────

export const promotePaneStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const promoteHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});

export const promoteTargetStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
});

export const diffSummaryStyle = css({
  fontSize: "13px",
  lineHeight: 1.55,
  color: "var(--operon-color-text)",
});

export const inSyncStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: "var(--operon-color-success)",
});

export const diffTableStyle = css({
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-sm)",
  overflow: "hidden",
});

export const diffHeadStyle = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1px",
  backgroundColor: "var(--operon-color-border-subtle)",
  borderBottom: "1px solid var(--operon-color-border)",
});

export const diffHeadCellStyle = css({
  padding: "8px 12px",
  backgroundColor: "var(--operon-color-surface-sunken)",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--operon-color-text-muted)",
});

export const diffVariantHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  padding: "7px 12px",
  backgroundColor: "var(--operon-color-surface-sunken)",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  fontWeight: 600,
});

export const diffKindStyle = css({
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--operon-color-text-subtle)",
  fontFamily: "var(--operon-typography-body)",
});

export const diffRowStyle = css({
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  "&:last-child": { borderBottom: "none" },
});

export const diffPathStyle = css({
  padding: "6px 12px 0",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
});

/** Stacks below 641px, where two columns of JSON are unreadable. */
export const diffCellsStyle = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "6px",
  padding: "6px 12px 10px",
  "@media (min-width: 641px)": {
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
});

export const diffCellStyle = css({
  padding: "6px 8px",
  borderRadius: "var(--operon-radius-xs)",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  minWidth: 0,
});

export const diffAbsentStyle = css({
  color: "var(--operon-color-text-subtle)",
  fontStyle: "italic",
});
