import { ProjectPage } from "#/modules/project";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
  component: ProjectPage,
});
