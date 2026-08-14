import { css } from "@morph-css/kit";

export const topbarStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  minWidth: 0,
  gap: "16px",
});

export const searchContainerStyle = css({
  flex: 1,
  maxWidth: "600px",
  display: "flex",
  alignItems: "center",
});

export const rightActionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

export const shortcutIconStyle = css({
  opacity: 0.5,
  fontSize: "12px",
});

export const iconButtonStyle = css({
  padding: "8px",
});

export const hideOnMobileStyle = css({
  "@media (max-width: 1024px)": {
    display: "none",
  },
});
