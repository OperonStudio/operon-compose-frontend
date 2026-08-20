import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  display: "flex",
  height: "100%",
  width: "100%",
  minHeight: "calc(100vh - 140px)",
  backgroundColor: "var(--operon-color-background)",
  borderTop: "1px solid var(--operon-color-border)",
  "@media (max-width: 768px)": {
    flexDirection: "column",
  },
});

export const sidebarStyle = css({
  width: "280px",
  flexShrink: 0,
  borderRight: "1px solid var(--operon-color-border)",
  backgroundColor: "var(--operon-color-surface)",
  display: "flex",
  flexDirection: "column",
  padding: "24px 16px",
  "@media (max-width: 768px)": {
    width: "100%",
    borderRight: "none",
    borderBottom: "1px solid var(--operon-color-border)",
    padding: "16px",
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
  padding: "48px",
  display: "flex",
  flexDirection: "column",
  "@media (max-width: 768px)": {
    padding: "16px",
  },
});

export const titleStyle = css({
  fontSize: "18px",
  fontWeight: "500",
  color: "var(--operon-color-text)",
  textTransform: "uppercase",
});
