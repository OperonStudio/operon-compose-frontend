import { createFileRoute } from "@tanstack/react-router";
import { ProjectIdPage } from "#/modules/project/projectId";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectIdPage,
});
