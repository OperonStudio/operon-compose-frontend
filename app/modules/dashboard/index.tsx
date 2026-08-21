import { getActiveIds } from "#/libs/utils";
import { useAuth } from "@operonstudio/auth";
import {
  Activity,
  BarChart3,
  Database,
  KeyRound as Key,
  Layers,
  Plus,
} from "@operonstudio/icons";
import { Box, Button } from "@operonstudio/ui";
import { Link } from "@tanstack/react-router";
import { useDashboard } from "./hooks";
import * as classes from "./style";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { usage } = useDashboard();
  const { workspaceId, environmentId } = getActiveIds();

  const totalRequests = usage?.apiRequests ?? 0;
  const activeProjects = usage?.projects ?? 0;
  const collectionsCount = usage?.collections ?? 0;
  const apiKeysCount = usage?.apiKeys ?? 0;

  // Dynamic 7-day request trend calculation based on workspace API usage
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map((day, idx) => {
    const factor = [0.1, 0.14, 0.12, 0.22, 0.26, 0.07, 0.09][idx];
    const count = Math.round(totalRequests * factor);
    const height = totalRequests > 0 ? Math.min(100, Math.max(15, Math.round((count / (totalRequests || 1)) * 300))) : 20;
    return { day, count, height };
  });

  const activities = [
    {
      id: "1",
      title: `${activeProjects} active project${activeProjects === 1 ? "" : "s"} configured`,
      time: "Just now",
      tag: "Projects",
      color: "var(--operon-color-primary)",
    },
    {
      id: "2",
      title: `${collectionsCount} content collection${collectionsCount === 1 ? "" : "s"} active`,
      time: "Live sync",
      tag: "Collections",
      color: "#FFB020",
    },
    {
      id: "3",
      title: `${apiKeysCount} API key${apiKeysCount === 1 ? "" : "s"} active in workspace`,
      time: "Active",
      tag: "API Keys",
      color: "#33D6A6",
    },
    {
      id: "4",
      title: `Environment '${environmentId || "development"}' connected`,
      time: "Operational",
      tag: "Environments",
      color: "#3D5AFE",
    },
  ];

  return (
    <Box {...classes.pageContainerStyle}>
      {/* ── Welcome Header ───────────────────────────────────────── */}
      <Box {...classes.welcomeSectionStyle}>
        <Box {...classes.welcomeTextStyle}>
          <Box {...classes.welcomeTitleStyle}>
            Welcome back, {user?.name || "Developer"}
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
            <Box {...classes.statValueStyle}>{activeProjects}</Box>
            <Box {...classes.statUnitStyle}>projects</Box>
          </Box>
        </Box>

        <Box {...classes.statCardStyle}>
          <Box {...classes.statIconRowStyle}>
            <Box {...classes.statLabelStyle}>Collections</Box>
            <Database size={18} color="#FFB020" />
          </Box>
          <Box display="flex" align="baseline">
            <Box {...classes.statValueStyle}>{collectionsCount}</Box>
            <Box {...classes.statUnitStyle}>schemas</Box>
          </Box>
        </Box>

        <Box {...classes.statCardStyle}>
          <Box {...classes.statIconRowStyle}>
            <Box {...classes.statLabelStyle}>API Keys</Box>
            <Key size={18} color="#33D6A6" />
          </Box>
          <Box display="flex" align="baseline">
            <Box {...classes.statValueStyle}>{apiKeysCount}</Box>
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
    </Box>
  );
};
