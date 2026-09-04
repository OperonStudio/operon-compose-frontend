import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  maxWidth: "100vw",
  boxSizing: "border-box",
  minHeight: "calc(100vh - 140px)",
  borderTop: "1px solid var(--operon-color-border, #e2ddda)",
  "@media (min-width: 901px)": {
    flexDirection: "row",
  },
});

export const sidebarStyle = css({
  width: "100%",
  boxSizing: "border-box",
  borderBottom: "1px solid var(--operon-color-border, #e2ddda)",
  backgroundColor: "var(--operon-color-surface, #ffffff)",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  "@media (min-width: 901px)": {
    width: "280px",
    flexShrink: 0,
    borderBottom: "none",
    borderRight: "1px solid var(--operon-color-border, #e2ddda)",
    padding: "24px 16px",
  },
});

export const sidebarTitleStyle = css({
  fontSize: "14px",
  fontWeight: "700",
  fontFamily: "var(--operon-typography-heading)",
  letterSpacing: "0.05em",
  color: "var(--operon-color-text-muted, #8a868c)",
  marginBottom: "8px",
  padding: "0 8px",
});

export const listStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const listItemContainerStyle = css({
  display: "flex",
  alignItems: "center",
  borderRadius: "var(--operon-radius-md, 10px)",
  transition: "all 0.2s ease",
  cursor: "var(--operon-cursor-pointer, pointer)",
  "&:hover": {
    backgroundColor: "var(--operon-color-primary-ghost, rgba(211, 58, 92, 0.08))",
  },
});

export const listItemStyle = css({
  padding: "8px 12px",
  borderRadius: "var(--operon-radius-md, 10px)",
  cursor: "var(--operon-cursor-pointer, pointer)",
  fontSize: "14px",
  fontWeight: "500",
  color: "var(--operon-color-text, #16151a)",
  transition: "all 0.2s var(--operon-motion-easing, cubic-bezier(0.4, 0, 0.2, 1))",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "var(--operon-color-primary-ghost, rgba(211, 58, 92, 0.08))",
    color: "var(--operon-color-primary, #d33a5c)",
  },
});

export const nestedListContainerStyle = css({
  paddingLeft: "28px",
  marginTop: "4px",
  marginBottom: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    left: "14px",
    top: "0",
    bottom: "8px",
    width: "1px",
    backgroundColor: "var(--operon-color-border, #e2ddda)",
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
