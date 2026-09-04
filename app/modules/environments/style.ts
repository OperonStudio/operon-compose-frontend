import { css } from "@morph-css/kit";
import {
  DESKTOP_QUERY,
  PAGE_PADDING,
  PAGE_PADDING_MOBILE,
} from "#/common/layout";

export const pageContainerStyle = css({
  padding: PAGE_PADDING_MOBILE,
  boxSizing: "border-box",
  [DESKTOP_QUERY]: { padding: PAGE_PADDING },
  maxWidth: "1280px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  "@media (max-width: 768px)": {
    padding: "20px 16px 40px",
    gap: "20px",
  },
});

export const environmentCardStyle = css({
  backgroundColor: "var(--operon-color-surface-sunken)",
  borderRadius: "var(--operon-radius-xl)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  transition: "transform 0.2s, box-shadow 0.2s",
  "@media (max-width: 640px)": {
    padding: "16px",
  },
});

export const environmentNameStyle = css({
  fontSize: "18px",
  fontWeight: 700,
  color: "var(--operon-color-text)",
  fontFamily: "var(--operon-typography-heading)",
  letterSpacing: "0.5px",
});

export const environmentDescriptionStyle = css({
  fontSize: "14px",
  color: "var(--operon-color-text-muted)",
  fontFamily: "var(--operon-typography-ui)",
});

export const environmentActionsStyle = css({
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
  marginTop: "12px",
  paddingTop: "16px",
  borderTop: "1px dashed var(--operon-color-border)",
});
