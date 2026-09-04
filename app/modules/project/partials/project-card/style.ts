import { css } from "@morph-css/kit";

/**
 * Laid out with media queries rather than a `usePhone()` JavaScript breakpoint.
 *
 * The hook reported false during server rendering and on the first client
 * paint, so a phone was served the desktop layout and then reflowed. CSS gets
 * it right on the first frame, and the breakpoint sits at 768px rather than the
 * 1024px the hook used, which was treating small laptops as phones.
 */
export const cardRowStyle = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  padding: "16px",
  "@media (min-width: 769px)": {
    alignItems: "center",
    gap: "16px",
    padding: "20px 24px",
  },
});

export const linkStyle = css({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  textDecoration: "none",
  color: "inherit",
  "@media (min-width: 769px)": {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
});

export const textGroupStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
});

export const titleStyle = css({
  fontSize: "15px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
  margin: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  "@media (min-width: 769px)": {
    fontSize: "16px",
  },
});

export const descriptionStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
  margin: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const chipsRowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
  flexShrink: 0,
});

export const actionsStyle = css({
  display: "flex",
  flexShrink: 0,
});
