import { css } from "@morph-css/kit";

export const headerControlWrapperStyle = css({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  "& [role='tablist']": {
    display: "flex",
    background: "var(--operon-color-surface-raised, #f3f4f6)",
    borderRadius: "8px",
    padding: "3px",
    gap: "4px",
    marginBottom: "8px",
    borderBottom: "none !important",
  },
  "& [role='tab']": {
    flex: 1,
    padding: "6px 12px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    borderRadius: "6px !important",
    border: "none !important",
    borderBottom: "none !important",
    cursor: "pointer",
    transition: "all 0.15s ease",
    color: "var(--operon-color-text-muted, #6b7280)",
    background: "transparent",
  },
  "& [role='tab'][aria-selected='true']": {
    background: "var(--operon-color-surface, #ffffff) !important",
    color: "var(--operon-color-primary, #6366f1) !important",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1) !important",
    borderBottom: "none !important",
  },
});
