import { css } from "@morph-css/kit";

export const dashboardStyle = css({
  flex: 1,
  backgroundColor: "var(--operon-color-background, #f0f0ff)",
  display: "flex",
  flexDirection: "column",
  "@media (max-width: 768px)": {
    padding: "20px",
  },
});
