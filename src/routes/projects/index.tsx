import { createFileRoute } from "@tanstack/react-router";
import { ProjectPage } from "#/modules/project";

export const Route = createFileRoute("/projects/")({
  component: ProjectPage,
});
