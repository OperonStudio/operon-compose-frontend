import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  padding: "40px",
  maxWidth: "1280px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
});

export const environmentCardStyle = css({
  background: "var(--operon-color-surface)",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-lg, 8px)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: "2px 2px 0px rgba(0,0,0,0.05)",
  transition: "transform 0.2s, box-shadow 0.2s",
});

export const environmentNameStyle = css({
  fontSize: "18px",
  fontWeight: 700,
  color: "var(--operon-color-text)",
  fontFamily:
    "var(--operon-typography-heading, 'Architects Daughter', cursive)",
  letterSpacing: "0.5px",
});

export const environmentDescriptionStyle = css({
  fontSize: "14px",
  color: "var(--operon-color-text-muted)",
  fontFamily: "var(--operon-typography-ui, 'Inter', sans-serif)",
});

export const environmentActionsStyle = css({
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
  marginTop: "12px",
  paddingTop: "16px",
  borderTop: "1px dashed var(--operon-color-border)",
});
