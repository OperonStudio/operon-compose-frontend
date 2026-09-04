import { ChevronDown, ChevronRight } from "@operonstudio/icons";
import { Box } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useActiveScope } from "#/common/use-active-scope";
import { getProjectsOptions } from "#/modules/project/api";
import type { Project } from "#/modules/project/interface";
import { getCollectionsOptions } from "#/modules/project/projectId/api";
import * as classes from "./style";

const ProjectSidebarItem = ({
  project,
  activeProjectId,
  activeCollectionId,
}: {
  project: Project;
  activeProjectId: string;
  activeCollectionId?: string;
}) => {
  const id = project.id || project.name;
  const isProjectActive = activeProjectId === id && !activeCollectionId;
  const [isExpanded, setIsExpanded] = useState(activeProjectId === id);

  const { data: collections, isLoading } = useQuery({
    ...getCollectionsOptions(id),
    enabled: isExpanded,
  });

  return (
    <Box>
      <Box
        {...classes.listItemContainerStyle}
        style={{
          backgroundColor: isProjectActive
            ? "var(--operon-color-surface-raised, #fbfaf9)"
            : undefined,
          color: isProjectActive ? "var(--operon-color-primary)" : "inherit",
          fontWeight: isProjectActive ? "600" : "500",
        }}
      >
        <Box
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          style={{
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.6,
          }}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </Box>
        <Link
          to="/rule-engine/$projectId"
          params={{ projectId: id }}
          style={{
            textDecoration: "none",
            flex: 1,
            color: "inherit",
            padding: "8px 12px 8px 4px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {project.name}
        </Link>
      </Box>

      {isExpanded && (
        <Box {...classes.nestedListContainerStyle}>
          {isLoading && (
            <Box
              style={{
                padding: "4px 8px 4px 16px",
                fontSize: "12px",
                color: "var(--operon-color-text-muted)",
              }}
            >
              Loading...
            </Box>
          )}
          {collections?.map((col) => {
            if (!col.id) return null;
            const collectionId = col.id;
            const isColActive = activeCollectionId === collectionId;
            return (
              <Link
                key={collectionId}
                to="/rule-engine/$projectId/$collectionId"
                params={{ projectId: id, collectionId }}
                style={{ textDecoration: "none", display: "block" }}
              >
                <Box
                  {...classes.listItemStyle}
                  style={{
                    backgroundColor: isColActive
                      ? "var(--operon-color-surface-raised, #fbfaf9)"
                      : "transparent",
                    color: isColActive
                      ? "var(--operon-color-primary)"
                      : "var(--operon-color-text)",
                    fontWeight: isColActive ? "600" : "400",
                    fontSize: "13px",
                    padding: "6px 12px 6px 16px",
                    borderRadius: "4px",
                  }}
                >
                  {col.name}
                </Box>
              </Link>
            );
          })}
          {collections?.length === 0 && !isLoading && (
            <Box
              style={{
                padding: "4px 8px 4px 16px",
                fontSize: "12px",
                color: "var(--operon-color-text-muted)",
              }}
            >
              No collections
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export const RuleEngineLayout = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const { data: projects, isLoading } = useQuery(getProjectsOptions());
  const { projectId, collectionId } = useParams({ strict: false }) as {
    projectId?: string;
    collectionId?: string;
  };

  return (
    <Box {...classes.pageContainerStyle}>
      <Box {...classes.sidebarStyle}>
        <Box
          display="flex"
          align="center"
          justify="space-between"
          style={{ marginBottom: "16px", padding: "0 8px" }}
        >
          <Box {...classes.sidebarTitleStyle}>Projects & Collections</Box>
        </Box>

        <Box {...classes.listStyle}>
          {isLoading && <Box style={{ padding: "0 8px" }}>Loading...</Box>}
          {projects?.map((project) => (
            <ProjectSidebarItem
              key={project.id || project.name}
              project={project}
              activeProjectId={projectId ?? ""}
              activeCollectionId={collectionId}
            />
          ))}
          {projects?.length === 0 && !isLoading && (
            <Box
              style={{
                padding: "0 8px",
                color: "var(--operon-color-text-muted)",
              }}
            >
              No projects found.
            </Box>
          )}
        </Box>
      </Box>

      <Box {...classes.contentAreaStyle} style={{ padding: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
