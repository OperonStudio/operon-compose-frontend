import { Copy, Database, KeyRound, Layers } from "@operonstudio/icons";
import { Box, Button, toast } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useActiveScope } from "#/common/use-active-scope";
import { getWorkspacesOptions } from "#/components/workspace-switcher/api";
import { getEnvironmentsOptions } from "#/modules/environments/api";
import { getProjectsOptions } from "#/modules/project/api";
import { useDashboard } from "./hooks";
import * as classes from "./style";

/** How many days the trend covers. Matches the window the hook requests. */
const TREND_DAYS = 7;

/**
 * The workspace at a glance: what it holds, and how much it has served.
 *
 * Every figure here is measured. An earlier version filled the page with an
 * activity feed whose timestamps were invented at render time, which looked
 * like history and was not; what replaced it is a directory, where each row is
 * a real count and goes somewhere.
 */
export const DashboardPage = () => {
  const { workspaceId, environmentId } = useActiveScope();
  const { usage, daily, isLoading, isError, refetch } = useDashboard();
  const { data: projects = [] } = useQuery(getProjectsOptions());

  // Names, not ids. The path is here to tell you which workspace you are
  // looking at, and two 24-character hex strings do not.
  const { data: workspaces = [] } = useQuery(getWorkspacesOptions());
  const { data: environments = [] } = useQuery(getEnvironmentsOptions());
  const workspaceName =
    workspaces.find((w) => w.id === workspaceId)?.name ?? "no workspace";
  const environmentName =
    environments.find((e) => e.id === environmentId)?.name ?? "no environment";

  if (isError) {
    return (
      <Box {...classes.pageStyle}>
        <Box {...classes.errorPanelStyle}>
          <Box {...classes.errorTitleStyle}>Could not load usage</Box>
          <Box {...classes.errorBodyStyle}>
            The Compose API did not answer. Check that it is running, then try
            again.
          </Box>
          <Button size="sm" onClick={refetch}>
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  const requests = usage?.apiRequests ?? 0;
  const windowTotal = daily.reduce((sum, point) => sum + point.count, 0);
  const peak = daily.reduce((max, point) => Math.max(max, point.count), 0);

  return (
    <Box {...classes.pageStyle}>
      <Box {...classes.headerStyle}>
        <Box {...classes.headerTextStyle}>
          {/* No title here: the page header above this already carries one,
              and two headings stacked read as a mistake. */}
          <Box {...classes.scopeStyle}>
            <span>{workspaceName}</span>
            <span {...classes.scopeSeparatorStyle}>/</span>
            <span {...classes.scopeEnvStyle}>{environmentName}</span>
          </Box>
        </Box>
      </Box>

      <Box {...classes.metricsStyle}>
        <Metric
          label="API requests"
          value={isLoading ? null : requests}
          note={
            windowTotal > 0
              ? `${windowTotal.toLocaleString()} in last ${TREND_DAYS} days`
              : "all time"
          }
        />
        <Metric
          label="Projects"
          value={isLoading ? null : (usage?.projects ?? projects.length)}
        />
        <Metric
          label="Collections"
          value={isLoading ? null : (usage?.collections ?? 0)}
        />
        <Metric
          label="API keys"
          value={isLoading ? null : (usage?.apiKeys ?? 0)}
        />
      </Box>

      <Box {...classes.gridStyle}>
        <Box {...classes.panelStyle}>
          <Box {...classes.panelHeaderStyle}>
            <Box {...classes.panelTitleStyle}>
              {windowTotal > 0 ? "Requests" : "No requests yet"}
            </Box>
            {windowTotal > 0 && (
              <Box {...classes.panelMetaStyle}>
                last {TREND_DAYS} days · peak {peak.toLocaleString()}/day
              </Box>
            )}
          </Box>
          <Box {...classes.panelBodyStyle}>
            {windowTotal > 0 ? (
              <Chart points={daily} peak={peak} />
            ) : (
              <FirstRequestGuide />
            )}
          </Box>
        </Box>

        <Box {...classes.panelStyle}>
          <Box {...classes.panelHeaderStyle}>
            <Box {...classes.panelTitleStyle}>Workspace</Box>
          </Box>
          <Box {...classes.resourceListStyle}>
            <Resource
              to="/projects"
              icon={<Database size={15} />}
              label="Projects"
              count={usage?.projects ?? projects.length}
            />
            <Resource
              to="/projects"
              icon={<Layers size={15} />}
              label="Collections"
              count={usage?.collections ?? 0}
            />
            <Resource
              to="/api-keys"
              icon={<KeyRound size={15} />}
              label="API keys"
              count={usage?.apiKeys ?? 0}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: number | null;
  note?: string;
}) {
  return (
    <Box {...classes.metricStyle}>
      <Box {...classes.metricLabelStyle}>{label}</Box>
      <Box {...classes.metricValueStyle}>
        {value === null ? "—" : value.toLocaleString()}
      </Box>
      {note && <Box {...classes.metricNoteStyle}>{note}</Box>}
    </Box>
  );
}

/**
 * The daily trend.
 *
 * Bars are scaled against the window's peak rather than a fixed ceiling, so a
 * quiet week is still readable. A day that was measured and saw nothing gets a
 * hairline rather than nothing at all, which distinguishes it from a day that
 * was never reported.
 */
function Chart({
  points,
  peak,
}: {
  points: { date: string; count: number }[];
  peak: number;
}) {
  return (
    <Box {...classes.chartStyle}>
      <Box {...classes.axisStyle}>
        <span>{peak.toLocaleString()}</span>
        <span>0</span>
      </Box>
      <Box {...classes.chartMainStyle}>
        <Box {...classes.plotStyle}>
          {points.map((point) => (
            <Box
              key={point.date}
              {...classes.columnStyle}
              title={`${point.date}: ${point.count.toLocaleString()}`}
            >
              {point.count > 0 ? (
                <Box
                  {...classes.barStyle}
                  style={{
                    ...classes.barStyle.style,
                    height: `${Math.max((point.count / peak) * 100, 2)}%`,
                  }}
                />
              ) : (
                <Box {...classes.barEmptyStyle} />
              )}
            </Box>
          ))}
        </Box>
        <Box {...classes.chartLabelsStyle}>
          {points.map((point) => (
            <Box key={point.date} {...classes.chartLabelStyle}>
              {new Date(`${point.date}T00:00:00Z`).toLocaleDateString(
                undefined,
                { weekday: "short", timeZone: "UTC" },
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * What to do when nothing has been served yet.
 *
 * A chart of seven empty days says nothing useful on a new workspace, so the
 * panel shows the request that would fill it instead.
 */
function FirstRequestGuide() {
  const snippet = `curl https://api.operonstudio.tech/api/content/<project>/<collection> \\
  -H "x-Operon-key: <your key>"`;

  return (
    <Box {...classes.guideStyle}>
      <Box {...classes.guideTextStyle}>
        Nothing has been served from this workspace yet. Publish a collection,
        then fetch it with a project key.
      </Box>
      <Box {...classes.snippetStyle}>
        {snippet}
        <Box {...classes.snippetCopyStyle}>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(snippet);
                toast.success("Copied");
              } catch {
                // Clipboard access is denied outside a secure context. The
                // text is on screen either way, so say so rather than fail
                // silently.
                toast.error("Could not copy. Select the text and copy it.");
              }
            }}
          >
            <Copy size={13} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function Resource({
  to,
  icon,
  label,
  count,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <Link to={to} className={classes.resourceRowStyle.className}>
      <Box {...classes.resourceIconStyle}>{icon}</Box>
      <Box {...classes.resourceLabelStyle}>{label}</Box>
      <Box {...classes.resourceCountStyle}>{count.toLocaleString()}</Box>
    </Link>
  );
}
