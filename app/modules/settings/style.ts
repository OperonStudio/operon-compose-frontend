import { css } from "@morph-css/kit";
import {
  DESKTOP_QUERY,
  PAGE_PADDING,
  PAGE_PADDING_MOBILE,
} from "#/common/layout";

export const containerStyle = css({
  padding: PAGE_PADDING_MOBILE,
  boxSizing: "border-box",
  [DESKTOP_QUERY]: { padding: PAGE_PADDING },
  maxWidth: "1100px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
  "@media (max-width: 768px)": {
    padding: "20px 16px 40px",
    gap: "20px",
  },
});

export const headerStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
  "@media (max-width: 600px)": {
    flexDirection: "column",
    alignItems: "stretch",
  },
});

export const headerTextStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const headerTitleStyle = css({
  fontSize: "24px",
  fontWeight: 700,
  color: "var(--operon-color-text)",
  letterSpacing: "-0.02em",
  "@media (max-width: 600px)": {
    fontSize: "20px",
  },
});

export const headerSubtitleStyle = css({
  fontSize: "14px",
  color: "var(--operon-color-text-muted)",
  "@media (max-width: 600px)": {
    fontSize: "13px",
  },
});

export const cardStyle = css({
  backgroundColor: "var(--operon-color-surface-sunken)",
  borderRadius: "var(--operon-radius-xl)",
  overflow: "hidden",
});

export const cardHeaderStyle = css({
  padding: "16px 20px",
  borderBottom: "1px solid var(--operon-color-border)",
  fontWeight: 700,
  fontSize: "14px",
  color: "var(--operon-color-text)",
  "@media (max-width: 600px)": {
    padding: "14px 16px",
  },
});

export const memberItemStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  gap: "12px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  flexWrap: "wrap",
  "&:last-child": {
    borderBottom: "none",
  },
  "@media (max-width: 600px)": {
    padding: "12px 14px",
  },
});

export const memberInfoStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  minWidth: 0,
  flex: 1,
});

export const avatarStyle = css({
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "var(--operon-color-primary)",
  color: "var(--operon-color-text-inverse)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "14px",
  flexShrink: 0,
});

export const memberDetailsStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
});

export const memberNameStyle = css({
  fontWeight: 600,
  fontSize: "14px",
  color: "var(--operon-color-text)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
});

export const memberEmailStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
  wordBreak: "break-all",
});

export const invitationItemStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  gap: "12px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  flexWrap: "wrap",
  "&:last-child": {
    borderBottom: "none",
  },
  "@media (max-width: 600px)": {
    padding: "12px 14px",
  },
});

export const workspaceIdRowStyle = css({
  display: "flex",
  gap: "10px",
  "@media (max-width: 600px)": {
    flexDirection: "column",
    alignItems: "stretch",
  },
});
