import { getActiveIds } from "#/libs/utils";
import { useAuth } from "@operon/auth";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Code,
  Database,
  KeyRound as Key,
  Layers,
  Plus,
  Zap,
} from "@operon/icons";
import { Box, Button } from "@operon/ui";
import { Link } from "@tanstack/react-router";
import { useDashboard } from "./hooks";
import * as classes from "./style";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { usage } = useDashboard();
  const { workspaceId, environmentId } = getActiveIds();

  // Mock chart data for 7-day API requests trends
  const chartData = [
    { day: "Mon", count: 420, height: 45 },
    { day: "Tue", count: 680, height: 65 },
    { day: "Wed", count: 510, height: 50 },
    { day: "Thu", count: 940, height: 85 },
    { day: "Fri", count: 1250, height: 100 },
    { day: "Sat", count: 820, height: 75 },
    { day: "Sun", count: 990, height: 90 },
  ];

  const totalRequests = usage?.apiRequests ?? 5610;

  const activities = [
    {
      id: "1",
      title: "Rule Engine decision executed",
      time: "2 mins ago",
      tag: "Rule Engine",
      color: "var(--operon-color-primary)",
    },
    {
      id: "2",
      title: "New API Key generated for staging",
      time: "1 hour ago",
      tag: "API Keys",
      color: "#33D6A6",
    },
    {
      id: "3",
      title: "Collection 'user-profiles' updated",
      time: "3 hours ago",
      tag: "Collections",
      color: "#FFB020",
    },
    {
      id: "4",
      title: "Environment sync completed",
      time: "5 hours ago",
      tag: "Environments",
      color: "#3D5AFE",
    },
  ];

  const quickActions = [
    {
      label: "Create Project",
      icon: <Plus size={18} />,
      to: "/projects",
    },
    {
      label: "Rule Engine",
      icon: <Zap size={18} />,
      to: "/rule-engine",
    },
    {
      label: "API Keys",
      icon: <Key size={18} />,
      to: "/api-keys",
    },
    {
      label: "Context Variables",
      icon: <Code size={18} />,
      to: "/context",
    },
  ];

  return (
    <Box {...classes.pageContainerStyle}>
      {/* ── Welcome Header ───────────────────────────────────────── */}
      <Box {...classes.welcomeSectionStyle}>
        <Box {...classes.welcomeTextStyle}>
          <Box {...classes.welcomeTitleStyle}>
            Welcome back, {user?.name || "Developer"} 👋
          </Box>
          <Box {...classes.welcomeSubtitleStyle}>
            Overview for workspace{" "}
            <strong style={{ color: "var(--operon-color-text)" }}>
              {workspaceId || "Default Workspace"}
            </strong>{" "}
            in environment{" "}
            <strong style={{ color: "var(--operon-color-primary)" }}>
              {environmentId || "development"}
            </strong>
          </Box>
        </Box>
        <Box {...classes.welcomeActionsStyle}>
          <Link to="/projects" style={{ textDecoration: "none" }}>
            <Button variant="primary" style={{ gap: "6px" }}>
              <Plus size={16} /> New Project
            </Button>
          </Link>
        </Box>
      </Box>

      {/* ── Metric Cards Strip ────────────────────────────────────── */}
      <Box {...classes.statsRowStyle}>
        <Box {...classes.statCardStyle}>
          <Box {...classes.statIconRowStyle}>
            <Box {...classes.statLabelStyle}>API Requests</Box>
            <Activity size={18} color="var(--operon-color-primary)" />
          </Box>
          <Box display="flex" align="baseline">
            <Box {...classes.statValueStyle}>
              {totalRequests.toLocaleString()}
            </Box>
            <Box {...classes.statUnitStyle}>reqs</Box>
          </Box>
        </Box>

        <Box {...classes.statCardStyle}>
          <Box {...classes.statIconRowStyle}>
            <Box {...classes.statLabelStyle}>Active Projects</Box>
            <Layers size={18} color="#3D5AFE" />
          </Box>
          <Box display="flex" align="baseline">
            <Box {...classes.statValueStyle}>{usage?.projects ?? 3}</Box>
            <Box {...classes.statUnitStyle}>projects</Box>
          </Box>
        </Box>

        <Box {...classes.statCardStyle}>
          <Box {...classes.statIconRowStyle}>
            <Box {...classes.statLabelStyle}>Collections</Box>
            <Database size={18} color="#FFB020" />
          </Box>
          <Box display="flex" align="baseline">
            <Box {...classes.statValueStyle}>{usage?.collections ?? 8}</Box>
            <Box {...classes.statUnitStyle}>schemas</Box>
          </Box>
        </Box>

        <Box {...classes.statCardStyle}>
          <Box {...classes.statIconRowStyle}>
            <Box {...classes.statLabelStyle}>API Keys</Box>
            <Key size={18} color="#33D6A6" />
          </Box>
          <Box display="flex" align="baseline">
            <Box {...classes.statValueStyle}>{usage?.apiKeys ?? 2}</Box>
            <Box {...classes.statUnitStyle}>active</Box>
          </Box>
        </Box>
      </Box>

      {/* ── Charts & Activity Grid ────────────────────────────────── */}
      <Box {...classes.contentGridStyle}>
        {/* Usage Analytics Chart */}
        <Box {...classes.chartPanelStyle}>
          <Box {...classes.chartHeaderStyle}>
            <Box>
              <Box {...classes.chartTitleStyle}>
                Request Volume (7-Day Trend)
              </Box>
              <Box {...classes.chartSubtitleStyle}>
                Real-time API traffic across all collections
              </Box>
            </Box>
            <BarChart3 size={18} color="var(--operon-color-text-muted)" />
          </Box>

          <Box {...classes.chartAreaStyle}>
            {chartData.map((item) => (
              <Box
                key={item.day}
                {...classes.chartBarStyle}
                style={{ height: `${item.height}%` }}
                title={`${item.day}: ${item.count} requests`}
              />
            ))}
          </Box>

          <Box {...classes.chartLabelsStyle}>
            {chartData.map((item) => (
              <Box key={item.day} {...classes.chartLabelStyle}>
                {item.day}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recent Activity Feed */}
        <Box {...classes.activityPanelStyle}>
          <Box
            display="flex"
            align="center"
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Box {...classes.activityTitleStyle}>Workspace Activity</Box>
            <Activity size={16} color="var(--operon-color-text-subtle)" />
          </Box>

          <Box {...classes.activityListStyle}>
            {activities.map((act) => (
              <Box key={act.id} {...classes.activityItemStyle}>
                <Box
                  {...classes.activityDotStyle}
                  style={{ backgroundColor: act.color }}
                />
                <Box {...classes.activityContentStyle}>
                  <Box {...classes.activityTextStyle}>{act.title}</Box>
                  <Box {...classes.activityTimeStyle}>{act.time}</Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <Box display="flex" direction="column" gap={12}>
        <Box {...classes.sectionHeaderStyle}>Quick Actions</Box>
        <Box {...classes.quickActionsGridStyle}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              {...classes.quickActionCardStyle}
            >
              <Box {...classes.quickActionIconStyle}>{action.icon}</Box>
              <Box {...classes.quickActionLabelStyle}>{action.label}</Box>
              <ArrowUpRight
                size={14}
                style={{ marginLeft: "auto", opacity: 0.5 }}
              />
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
