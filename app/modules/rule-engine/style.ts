import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  display: "flex",
  height: "100%",
  width: "100%",
  minHeight: "calc(100vh - 140px)",
  backgroundColor: "var(--operon-color-background, #fdfdfc)",
  borderTop: "1px solid var(--operon-color-border, #c7c7e6)",
  "@media (max-width: 768px)": {
    flexDirection: "column",
  },
});

export const sidebarStyle = css({
  width: "280px",
  flexShrink: 0,
  borderRight: "1px solid var(--operon-color-border, #c7c7e6)",
  backgroundColor: "var(--operon-color-surface, #fff)",
  display: "flex",
  flexDirection: "column",
  padding: "24px 16px",
  "@media (max-width: 768px)": {
    width: "100%",
    borderRight: "none",
    borderBottom: "1px solid var(--operon-color-border, #c7c7e6)",
    padding: "16px",
  },
});

export const sidebarTitleStyle = css({
  fontSize: "14px",
  fontWeight: "700",
  fontFamily: "var(--operon-typography-heading, cursive)",
  letterSpacing: "0.05em",
  color: "var(--operon-color-text-muted, #6b7280)",
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
  borderRadius: "var(--operon-radius-md, 8px)",
  transition: "all 0.2s ease",
  cursor: "var(--operon-cursor-pointer, pointer)",
  "&:hover": {
    backgroundColor: "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))",
  },
});

export const listItemStyle = css({
  padding: "8px 12px",
  borderRadius: "var(--operon-radius-md, 8px)",
  cursor: "var(--operon-cursor-pointer, pointer)",
  fontSize: "14px",
  fontWeight: "500",
  color: "var(--operon-color-text, #1a1a2e)",
  transition: "all 0.2s var(--operon-motion-easing, ease)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:hover": {
    backgroundColor: "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))",
    color: "var(--operon-color-primary, #6366f1)",
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
    backgroundColor: "var(--operon-color-border, #c7c7e6)",
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
