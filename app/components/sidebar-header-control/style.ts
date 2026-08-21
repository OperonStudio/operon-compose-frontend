import { css } from "@morph-css/kit";

export const headerControlWrapperStyle = css({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

export const segmentedTabBarStyle = css({
  display: "none",
  "@media (max-width: 900px)": {
    display: "flex",
    background: "var(--operon-color-surface-raised, #f3f4f6)",
    borderRadius: "8px",
    padding: "3px",
    gap: "4px",
    margin: "0 10px 6px 10px",
  },
});

export const tabButtonStyle = css({
  flex: 1,
  padding: "5px 10px",
  fontSize: "12px",
  fontWeight: 600,
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.15s ease",
});
