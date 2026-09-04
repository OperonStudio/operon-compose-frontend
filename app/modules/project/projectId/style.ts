import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  maxWidth: "100vw",
  boxSizing: "border-box",
  minHeight: "calc(100vh - 140px)",
  borderTop: "1px solid var(--operon-color-border)",
  "@media (min-width: 901px)": {
    flexDirection: "row",
  },
});

/**
 * Below 901px this is a horizontal strip above the editor rather than a column
 * beside it. Stacking the full list vertically pushed the editor off a phone
 * screen once a project had more than a handful of collections.
 */
export const sidebarStyle = css({
  width: "100%",
  boxSizing: "border-box",
  borderBottom: "1px solid var(--operon-color-border)",
  backgroundColor: "var(--operon-color-surface)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "12px 16px",
  "@media (min-width: 901px)": {
    width: "280px",
    flexShrink: 0,
    borderBottom: "none",
    borderRight: "1px solid var(--operon-color-border)",
    padding: "24px 16px",
    gap: "12px",
    overflowY: "auto",
  },
});

export const sidebarTitleStyle = css({
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--operon-color-text-muted)",
});

export const collectionListStyle = css({
  display: "flex",
  flexDirection: "row",
  gap: "6px",
  overflowX: "auto",
  paddingBottom: "2px",
  "@media (min-width: 901px)": {
    flexDirection: "column",
    gap: "4px",
    overflowX: "visible",
    paddingBottom: 0,
  },
});

export const collectionItemStyle = css({
  padding: "6px 12px",
  borderRadius: "var(--operon-radius-lg)",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
  whiteSpace: "nowrap",
  flexShrink: 0,
  color: "var(--operon-color-text)",
  transition:
    "background-color var(--operon-motion-fast) var(--operon-motion-easing)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "var(--operon-color-surface-raised)",
  },
  "@media (min-width: 901px)": {
    padding: "8px 12px",
    borderRadius: "var(--operon-radius-sm)",
    border: "1px solid transparent",
    fontSize: "14px",
    whiteSpace: "normal",
  },
});

export const contentAreaStyle = css({
  flex: 1,
  width: "100%",
  maxWidth: "100vw",
  boxSizing: "border-box",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  overflowX: "hidden",
  minWidth: 0,
  "@media (min-width: 901px)": {
    padding: "32px 40px",
  },
});

export const titleStyle = css({
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
  fontFamily: "var(--operon-typography-mono)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
  "@media (min-width: 901px)": {
    fontSize: "18px",
  },
});

export const workspaceStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  flex: 1,
  minHeight: 0,
});

export const toolbarTitleGroupStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
});

/**
 * Which environment you are editing is the single most important fact on this
 * screen, so it sits beside the collection name rather than in the sidebar.
 */
export const envBadgeStyle = css({
  flexShrink: 0,
  padding: "2px 8px",
  borderRadius: "var(--operon-radius-full)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--operon-color-text-muted)",
  whiteSpace: "nowrap",
});

/** Collection name and its actions; wraps rather than crushing the buttons. */
export const toolbarStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});

export const toolbarActionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexShrink: 0,
});

export const editorStyle = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
});

export const emptyStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: "48px 24px",
  textAlign: "center",
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
});
