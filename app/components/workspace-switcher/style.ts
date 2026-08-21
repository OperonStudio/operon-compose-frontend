import { css } from "@morph-css/kit";

export const containerStyle = css({
  position: "relative",
  zIndex: 100,
  padding: "10px 12px",
  borderBottom: "1px solid var(--operon-color-border, #e5e7eb)",
  marginBottom: "4px",
  width: "100%",
  flex: 1,
  boxSizing: "border-box",
});

export const triggerBoxStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  borderRadius: "var(--operon-radius-sm, 8px)",
  padding: "8px 10px",
  transition: "background 0.15s ease",
});

export const triggerBoxHoverStyle = css({
  background: "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))",
});

export const textContainerStyle = css({
  flex: 1,
  minWidth: 0,
});

export const textNameStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--operon-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const textSubtitleStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
});

export const dropdownPanelStyle = css({
  position: "absolute",
  top: "calc(100% + 4px)",
  left: "8px",
  right: "8px",
  background: "var(--operon-color-surface, #fff)",
  border: "1px solid var(--operon-color-border, #e5e7eb)",
  borderRadius: "var(--operon-radius-md, 10px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.16)",
  zIndex: 1000,
  overflow: "hidden",
});

export const listContainerStyle = css({
  maxHeight: "200px",
  overflowY: "auto",
  padding: "6px",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

export const listItemStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  transition: "background 0.12s",
});

export const listItemHoverStyle = css({
  background: "var(--operon-color-surface-raised, #f5f5ff)",
});

export const listItemActiveStyle = css({
  fontWeight: 600,
  color: "var(--operon-color-primary)",
  background: "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))",
});

export const listItemIconBoxStyle = css({
  width: "22px",
  height: "22px",
  borderRadius: "4px",
  background: "var(--operon-color-primary-ghost, rgba(99,102,241,0.15))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--operon-color-primary)",
  flexShrink: 0,
});

export const listItemTextStyle = css({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const dividerStyle = css({
  height: "1px",
  background: "var(--operon-color-border)",
  margin: "4px 0",
});

export const createInputContainerStyle = css({
  padding: "8px 10px",
  display: "flex",
  gap: "6px",
});

export const createInputStyle = css({
  flex: 1,
  minWidth: 0,
  padding: "6px 10px",
  fontSize: "13px",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "6px",
  outline: "none",
  background: "var(--operon-color-background)",
  color: "var(--operon-color-text)",
});

export const createButtonStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 10px 10px",
  cursor: "pointer",
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
  transition: "color 0.12s",
});

export const createButtonHoverStyle = css({
  color: "var(--operon-color-primary)",
});
