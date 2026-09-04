import { Box } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getPageContentOptions } from "#/common/api/content-api";

export const Route = createFileRoute("/rule-engine/")({
  component: RuleEngineIndex,
});

function RuleEngineIndex() {
  const { data: pageData } = useQuery(getPageContentOptions("rule-engine"));
  const emptyState = pageData?.content?.emptyState;

  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      justify="center"
      style={{
        height: "100%",
        padding: "48px",
        color: "var(--operon-color-text-muted)",
      }}
    >
      <Box style={{ marginBottom: "16px" }}>
        {emptyState?.description ??
          "Select a project from the sidebar to view its rule engine configurations."}
      </Box>
    </Box>
  );
}
