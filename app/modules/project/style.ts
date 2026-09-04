import { css } from "@morph-css/kit";

export const projectListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  // Was `padding: "32"`. A unitless length other than 0 is invalid CSS, so the
  // declaration was dropped and the list sat flush against the viewport edge on
  // desktop, where the shell adds no padding of its own.
  padding: "20px 16px 48px",
  width: "100%",
  boxSizing: "border-box",
  "@media (min-width: 769px)": {
    padding: "24px 32px 64px",
    gap: "14px",
  },
});

export const emptyStateStyle = css({
  padding: "48px 24px",
  textAlign: "center",
  color: "var(--operon-color-text-muted)",
  backgroundColor: "var(--operon-color-surface)",
  borderRadius: "var(--operon-radius-lg)",
  border: "1px dashed var(--operon-color-border)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
  "@media (min-width: 769px)": {
    padding: "64px 48px",
  },
});

export const emptyStateTitleStyle = css({
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const emptyStateBodyStyle = css({
  fontSize: "13px",
  lineHeight: 1.55,
  maxWidth: "46ch",
});
