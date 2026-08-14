import { RuleEngineCollectionPage } from "#/modules/rule-engine/collection";
import { Box } from "@operon/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rule-engine/$projectId/")({
  component: RuleEngineProjectPage,
});

function RuleEngineProjectPage() {
  const { projectId } = Route.useParams();

  return (
    <Box
      display="flex"
      direction="column"
      style={{ height: "100%", overflowY: "auto" }}
    >
      <RuleEngineCollectionPage
        projectId={projectId}
        collectionId={projectId}
        isProjectLevel
      />
    </Box>
  );
}
