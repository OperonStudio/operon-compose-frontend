import { ProjectIdPage } from "#/modules/project/projectId";
import { createFileRoute } from "@tanstack/react-router";

import { getProjectsOptions } from "#/modules/project/api";
import { getCollectionsOptions } from "#/modules/project/projectId/api";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectIdPage,
});
