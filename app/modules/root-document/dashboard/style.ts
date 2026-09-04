import { css } from "@morph-css/kit";

export const dashboardStyle = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  "@media (max-width: 768px)": {
    padding: "20px",
  },
});
