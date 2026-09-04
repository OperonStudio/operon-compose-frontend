import { css } from "@morph-css/kit";

export const labelStyle = css({
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--operon-color-text)",
});

export const requiredStyle = css({
  marginLeft: "4px",
  color: "var(--operon-color-danger)",
});

export const hintStyle = css({
  marginTop: "6px",
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
});
