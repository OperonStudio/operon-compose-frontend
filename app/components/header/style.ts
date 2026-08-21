import { css } from "@morph-css/kit";

export const topbarStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  minWidth: 0,
  gap: "12px",
});

export const desktopBreadcrumbStyle = css({
  display: "flex",
  alignItems: "center",
  "@media (max-width: 900px)": {
    display: "none",
  },
});

export const searchContainerStyle = css({
  flex: 1,
  maxWidth: "450px",
  display: "flex",
  alignItems: "center",
  "@media (max-width: 768px)": {
    display: "none",
  },
});

export const rightActionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginLeft: "auto",
  flexShrink: 0,
  "@media (max-width: 600px)": {
    gap: "4px",
  },
});

export const iconButtonStyle = css({
  padding: "6px",
});
