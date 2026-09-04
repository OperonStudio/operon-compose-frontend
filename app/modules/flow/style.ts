import { css } from "@morph-css/kit";
import {
  DESKTOP_QUERY,
  PAGE_PADDING,
  PAGE_PADDING_MOBILE,
} from "#/common/layout";

export const pageContainerStyle = css({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  padding: PAGE_PADDING_MOBILE,
  [DESKTOP_QUERY]: { padding: PAGE_PADDING },
  backgroundColor: "var(--operon-color-background, #fafafa)",
  backgroundImage:
    "radial-gradient(circle at top center, rgba(99, 102, 241, 0.03) 0%, transparent 100%)",
  overflowY: "auto",
  "@media (max-width: 768px)": {
    padding: "20px 16px 40px",
  },
});

export const headerTitleStyle = css({
  fontSize: "28px",
  fontWeight: "700",
  color: "var(--operon-color-text)",
  letterSpacing: "-0.02em",
  marginBottom: "6px",
  "@media (max-width: 640px)": {
    fontSize: "22px",
  },
});

export const headerSubtitleStyle = css({
  fontSize: "14px",
  color: "var(--operon-color-text-muted)",
  marginBottom: "32px",
});

export const cardStyle = css({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid rgba(0,0,0,0.04)",
  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
  marginBottom: "32px",
  "@media (max-width: 640px)": {
    padding: "18px",
    borderRadius: "12px",
  },
});

export const nodeCardStyle = css({
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "24px 20px",
  border: "1px solid rgba(99, 102, 241, 0.15)",
  boxShadow: "0 4px 20px rgba(99, 102, 241, 0.05)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "200px",
  textAlign: "center",
  transition: "all 0.2s ease",
  "@media (max-width: 640px)": {
    width: "160px",
    padding: "16px 12px",
  },
});

export const selectStyle = css({
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid var(--operon-color-border)",
  backgroundColor: "var(--operon-color-surface, #ffffff)",
  color: "var(--operon-color-text)",
  fontSize: "14px",
  fontWeight: "500",
  minWidth: "240px",
  outline: "none",
  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  cursor: "pointer",
  "@media (max-width: 640px)": {
    minWidth: "100%",
    width: "100%",
  },
});
