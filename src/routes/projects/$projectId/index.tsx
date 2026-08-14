import { ProjectIdPage } from "#/modules/project/projectId";
import { createFileRoute } from "@tanstack/react-router";

import { getProjectsOptions } from "#/modules/project/api";
import { getCollectionsOptions } from "#/modules/project/projectId/api";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectIdPage,
  loader: async ({ params, context }) => {
    try {
      context.queryClient.ensureQueryData(
        getCollectionsOptions(params.projectId),
      );

      const projects =
        await context.queryClient.ensureQueryData(getProjectsOptions);
      const project = projects.find(
        (p: any) => (p.id || p.name) === params.projectId,
      );

      return {
        pageHeaderData: {
          title: project?.name || "Project Details",
        },
      };
    } catch (e) {
      return {
        pageHeaderData: {
          title: "Project (Not Found)",
        },
      };
    }
  },
});
