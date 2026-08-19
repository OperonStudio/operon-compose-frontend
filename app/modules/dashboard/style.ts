import { css } from "@morph-css/kit";

// ── Page Container ──────────────────────────────────────────────────────────

export const pageContainerStyle = css({
  padding: "32px 40px 64px",
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  minHeight: "100%",
  "@media (max-width: 768px)": {
    padding: "24px 16px 48px",
  },
});

// ── Welcome Header ──────────────────────────────────────────────────────────

export const welcomeSectionStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  flexWrap: "wrap",
});

export const welcomeTextStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const welcomeTitleStyle = css({
  fontSize: "24px",
  fontWeight: 700,
  color: "var(--operon-color-text)",
  letterSpacing: "-0.02em",
  lineHeight: "1.2",
});

export const welcomeSubtitleStyle = css({
  fontSize: "14px",
  color: "var(--operon-color-text-muted)",
  lineHeight: "1.5",
});

export const welcomeActionsStyle = css({
  display: "flex",
  gap: "8px",
  flexShrink: 0,
});

// ── Stats Row ───────────────────────────────────────────────────────────────

export const statsRowStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "1px",
  backgroundColor: "var(--operon-color-border)",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-lg)",
  overflow: "hidden",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
});

export const statCardStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "20px 24px",
  backgroundColor: "var(--operon-color-surface)",
  transition: "background-color var(--operon-motion-fast) var(--operon-motion-easing)",
  "&:hover": {
    backgroundColor: "var(--operon-color-surface-sunken)",
  },
});

export const statIconRowStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const statLabelStyle = css({
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--operon-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
});

export const statValueStyle = css({
  fontSize: "28px",
  fontWeight: 800,
  color: "var(--operon-color-text)",
  letterSpacing: "-0.03em",
  lineHeight: "1.1",
  fontFamily: "var(--operon-typography-mono)",
});

export const statUnitStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--operon-color-text-muted)",
  marginLeft: "4px",
});

// ── Content Grid (Chart + Activity) ─────────────────────────────────────────

export const contentGridStyle = css({
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr",
  gap: "24px",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
  },
});

// ── Usage Chart Panel ───────────────────────────────────────────────────────

export const chartPanelStyle = css({
  backgroundColor: "var(--operon-color-surface)",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-lg)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const chartHeaderStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const chartTitleStyle = css({
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--operon-color-text)",
  letterSpacing: "-0.01em",
});

export const chartSubtitleStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
});

export const chartAreaStyle = css({
  width: "100%",
  height: "180px",
  display: "flex",
  alignItems: "flex-end",
  gap: "6px",
  padding: "0 4px",
});

export const chartBarStyle = css({
  flex: 1,
  borderRadius: "3px 3px 0 0",
  backgroundColor: "var(--operon-color-primary)",
  opacity: 0.8,
  transition: "opacity var(--operon-motion-fast) var(--operon-motion-easing), transform var(--operon-motion-fast) var(--operon-motion-easing)",
  minHeight: "4px",
  "&:hover": {
    opacity: 1,
    transform: "scaleY(1.05)",
    transformOrigin: "bottom",
  },
});

export const chartLabelsStyle = css({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 4px",
});

export const chartLabelStyle = css({
  fontSize: "10px",
  color: "var(--operon-color-text-subtle)",
  fontFamily: "var(--operon-typography-mono)",
});

// ── Activity Feed ───────────────────────────────────────────────────────────

export const activityPanelStyle = css({
  backgroundColor: "var(--operon-color-surface)",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-lg)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const activityTitleStyle = css({
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--operon-color-text)",
});

export const activityListStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "0",
});

export const activityItemStyle = css({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "12px 0",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  "&:last-child": {
    borderBottom: "none",
  },
});

export const activityDotStyle = css({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "var(--operon-color-primary)",
  flexShrink: 0,
  marginTop: "6px",
});

export const activityContentStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  minWidth: 0,
});

export const activityTextStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text)",
  lineHeight: "1.4",
});

export const activityTimeStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
  fontFamily: "var(--operon-typography-mono)",
});

// ── Quick Actions Grid ──────────────────────────────────────────────────────

export const quickActionsGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
});

export const quickActionCardStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "16px 20px",
  backgroundColor: "var(--operon-color-surface)",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  cursor: "pointer",
  textDecoration: "none",
  color: "var(--operon-color-text)",
  transition: "all var(--operon-motion-fast) var(--operon-motion-easing)",
  "&:hover": {
    borderColor: "var(--operon-color-primary)",
    backgroundColor: "var(--operon-color-primary-ghost)",
    color: "var(--operon-color-primary)",
  },
});

export const quickActionIconStyle = css({
  width: "36px",
  height: "36px",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--operon-color-text-muted)",
  flexShrink: 0,
  transition: "color var(--operon-motion-fast) var(--operon-motion-easing)",
});

export const quickActionLabelStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "-0.005em",
});

// ── Section Header ──────────────────────────────────────────────────────────

export const sectionHeaderStyle = css({
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--operon-color-text-subtle)",
});

// ── Grid Container (legacy compat) ──────────────────────────────────────────

export const gridContainerStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "24px",
});

export const cardInnerStyle = css({
  padding: "24px",
});

export const headerTitleStyle = css({
  fontSize: "28px",
  fontWeight: 800,
  color: "var(--operon-color-text)",
  letterSpacing: "-0.03em",
  marginBottom: "8px",
});

export const headerSubtitleStyle = css({
  fontSize: "14px",
  color: "var(--operon-color-text-muted)",
  marginTop: "4px",
});
