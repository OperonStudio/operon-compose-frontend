import { ProjectIdPage } from "#/modules/project/projectId";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectIdPage,
});
