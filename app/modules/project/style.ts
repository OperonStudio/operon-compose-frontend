import { css } from "@morph-css/kit";

export const projectGridStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "32",
});

export const emptyStateStyle = css({
  padding: "64px 48px",
  textAlign: "center",
  color: "var(--operon-color-text-muted, #6b7280)",
  backgroundColor: "var(--operon-color-surface, #fff)",
  borderRadius: "var(--operon-radius-lg, 16px)",
  border: "2px dashed var(--operon-color-border, #c7c7e6)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  alignItems: "center",
});

export const noProjectFoundStyle = css({
  fontSize: "18px",
  fontWeight: 600,
  color: "var(--operon-color-text, #1a1a2e)",
});
