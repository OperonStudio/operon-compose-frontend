import { createFileRoute } from "@tanstack/react-router";

import { RuleEngineCollectionPage } from "#/modules/rule-engine/collection";

export const Route = createFileRoute("/rule-engine/$projectId/$collectionId")({
  component: () => {
    const { projectId, collectionId } = Route.useParams();
    return (
      <RuleEngineCollectionPage
        projectId={projectId}
        collectionId={collectionId}
      />
    );
  },
});
