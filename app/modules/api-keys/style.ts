import { css } from "@morph-css/kit";
import {
  DESKTOP_QUERY,
  PAGE_PADDING,
  PAGE_PADDING_MOBILE,
} from "#/common/layout";

export const pageContainerStyle = css({
  padding: PAGE_PADDING_MOBILE,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
  boxSizing: "border-box",
  [DESKTOP_QUERY]: {
    padding: PAGE_PADDING,
    gap: "28px",
  },
});

export const projectSectionStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  backgroundColor: "var(--operon-color-surface, #ffffff)",
  borderRadius: "var(--operon-radius-lg, 14px)",
  padding: "28px",
  "@media (max-width: 768px)": {
    padding: "16px",
    gap: "12px",
  },
});

export const projectTitleStyle = css({
  fontSize: "16px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
  [DESKTOP_QUERY]: {
    fontSize: "17px",
  },
});

export const keyContainerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  backgroundColor: "var(--operon-color-surface-sunken)",
  borderRadius: "var(--operon-radius-xl)",
  transition: "all 0.2s ease",
  cursor: "var(--operon-cursor-pointer, pointer)",
  "&:hover": {
    borderColor: "var(--operon-color-primary, #d33a5c)",
    backgroundColor:
      "var(--operon-color-primary-ghost, rgba(211, 58, 92, 0.08))",
  },
  "@media (max-width: 640px)": {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
    padding: "14px 16px",
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
  color: "var(--operon-color-text, #16151a)",
});

export const keyDateStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted, #8a868c)",
});

export const keyValueStyle = css({
  fontSize: "13px",
  fontFamily: "var(--operon-typography-mono)",
  color: "var(--operon-color-text, #16151a)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  padding: "8px 14px",
  borderRadius: "var(--operon-radius-full)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  letterSpacing: "0.5px",
  wordBreak: "break-all",
  "@media (max-width: 640px)": {
    width: "100%",
    fontSize: "12px",
  },
});
