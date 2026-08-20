import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  maxWidth: "100vw",
  boxSizing: "border-box",
  minHeight: "calc(100vh - 140px)",
  backgroundColor: "var(--operon-color-background)",
  borderTop: "1px solid var(--operon-color-border)",
  "@media (min-width: 901px)": {
    flexDirection: "row",
  },
});

export const sidebarStyle = css({
  width: "100%",
  boxSizing: "border-box",
  borderBottom: "1px solid var(--operon-color-border)",
  backgroundColor: "var(--operon-color-surface)",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  "@media (min-width: 901px)": {
    width: "280px",
    flexShrink: 0,
    borderBottom: "none",
    borderRight: "1px solid var(--operon-color-border)",
    padding: "24px 16px",
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
  flexDirection: "column",
  gap: "4px",
});

export const collectionItemStyle = css({
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  color: "var(--operon-color-text)",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "var(--operon-color-surface-raised)",
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
  "@media (min-width: 901px)": {
    padding: "48px",
  },
});

export const titleStyle = css({
  fontSize: "18px",
  fontWeight: "500",
  color: "var(--operon-color-text)",
  textTransform: "uppercase",
});
