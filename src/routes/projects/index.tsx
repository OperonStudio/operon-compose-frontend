import { ProjectPage } from "#/modules/project";
import { getProjectsOptions } from "#/modules/project/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
  component: ProjectPage,
});
