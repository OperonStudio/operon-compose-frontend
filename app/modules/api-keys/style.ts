import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  padding: "0 48px 48px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  height: "100%",
  backgroundColor: "var(--operon-color-background, #fdfdfc)",
});

export const projectSectionStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  backgroundColor: "var(--operon-color-surface, #fff)",
  borderRadius: "var(--operon-radius-lg, 16px)",
  padding: "28px",
  boxShadow: "var(--operon-shadow-sm)",
});

export const projectTitleStyle = css({
  fontSize: "20px",
  fontWeight: "700",
  fontFamily: "var(--operon-typography-heading, cursive)",
  letterSpacing: "0.02em",
  color: "var(--operon-color-text, #1a1a2e)",
});

export const keyContainerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  backgroundColor: "var(--operon-color-surface-raised, #f8f8ff)",
  border: "1px solid var(--operon-color-border, #c7c7e6)",
  borderRadius: "var(--operon-radius-md, 12px)",
  transition: "all 0.2s ease",
  cursor: "var(--operon-cursor-pointer, pointer)",
  "&:hover": {
    borderColor: "var(--operon-color-primary, #6366f1)",
    backgroundColor: "var(--operon-color-primary-ghost, rgba(99,102,241,0.05))",
  },
});

export const keyInfoStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const keyNameStyle = css({
  fontSize: "15px",
  fontWeight: "600",
  color: "var(--operon-color-text, #1a1a2e)",
});

export const keyDateStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted, #6b7280)",
});

export const keyValueStyle = css({
  fontSize: "13px",
  fontFamily: "var(--operon-typography-code, monospace)",
  color: "var(--operon-color-text, #1a1a2e)",
  backgroundColor: "var(--operon-color-surface, #fff)",
  padding: "8px 14px",
  borderRadius: "var(--operon-radius-sm, 8px)",
  border: "1px solid var(--operon-color-border, #c7c7e6)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  letterSpacing: "0.5px",
});

export const actionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "4px",
});
