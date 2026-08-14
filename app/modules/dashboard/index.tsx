import { Box, Card } from "@operon/ui";
import { useDashboard } from "./hooks";
import * as classes from "./style";

export const DashboardPage = () => {
  const { usage, statCards, labels } = useDashboard();

  if (!usage) {
    return (
      <Box {...classes.pageContainerStyle}>
        <Box>{labels?.noData ?? "No usage data found."}</Box>
      </Box>
    );
  }

  return (
    <Box {...classes.pageContainerStyle}>
      <Box {...classes.gridContainerStyle}>
        {statCards.map((stat: any, i: number) => (
          <Card key={i} shadow="sm">
            <Box
              display="flex"
              direction="column"
              gap={16}
              {...classes.cardInnerStyle}
            >
              <Box style={{ color: stat.icon.props.color }}>{stat.icon}</Box>
              <Box {...(classes.statLabelStyle as any)}>{stat.title}</Box>
              <Box display="flex" align="baseline">
                <Box {...(classes.statValueStyle as any)}>{stat.value}</Box>
                {stat.unit && (
                  <Box {...(classes.statUnitStyle as any)}>{stat.unit}</Box>
                )}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
