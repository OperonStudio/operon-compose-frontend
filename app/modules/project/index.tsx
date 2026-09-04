import { Box, Button } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPageContentOptions } from "#/common/api/content-api";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { useActiveScope } from "#/common/use-active-scope";
import { ConfirmModal } from "#/components/confirm-modal";
import { useHeaderActions } from "#/contexts/header-actions";
import {
  createProjectOptions,
  deleteProjectOptions,
  getProjectsOptions,
  updateProjectOptions,
} from "./api";
import { CreateProjectModal } from "./partials/create-project-modal";
import { EditProjectModal } from "./partials/edit-project-modal";
import { ProjectCard } from "./partials/project-card";
import * as classes from "./style";

interface Project {
  id?: string;
  name: string;
  description: string;
}

/** The cache key for the project list in the currently active scope. */
const projectsKey = () => {
  const { workspaceId, environmentId } = activeScope();
  return queryKeys.projects(workspaceId, environmentId);
};

export const ProjectPage = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery(getProjectsOptions());
  const { data: pageData } = useQuery(getPageContentOptions("projects"));

  const emptyState = pageData?.content?.emptyState;
  const modals = pageData?.modals;

  const createProject = useMutation({
    ...createProjectOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey() });
    },
  });

  const updateProject = useMutation({
    ...updateProjectOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey() });
    },
  });

  const deleteProject = useMutation({
    ...deleteProjectOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey() });
    },
  });

  useHeaderActions({
    create_project: () => {
      setIsModalOpen(true);
    },
  });

  const handleCreateProject = async ({ name, description }: Project) => {
    setIsModalOpen(false);
    await createProject.mutateAsync({ name, description });
    createProject.reset();
  };

  const handleEditProject = async ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    if (editingProject) {
      await updateProject.mutateAsync({
        id: editingProject.id,
        project: { name, description },
      });
      setEditingProject(null);
    }
    setIsEditModalOpen(false);
  };

  const handleOnClose = () => {
    setIsModalOpen(false);
  };

  const handleOnEditClose = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  const handleEditClick = (id: string, name: string, description: string) => {
    setEditingProject({ id, name, description });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setProjectToDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject.mutateAsync(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <>
      <Box {...classes.projectListStyle}>
        {projects.length === 0 ? (
          <Box {...classes.emptyStateStyle}>
            <Box {...classes.emptyStateTitleStyle}>
              {emptyState?.title ?? "No projects yet"}
            </Box>
            <Box {...classes.emptyStateBodyStyle}>
              {emptyState?.description ??
                "A project groups the collections your frontend fetches, and owns the API key that serves them."}
            </Box>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              {emptyState?.actionLabel ?? "Create project"}
            </Button>
          </Box>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id || project.name}
              id={project.id || ""}
              title={project.name}
              description={project.description}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))
        )}
      </Box>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleOnClose}
        onCreate={handleCreateProject}
      />
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={handleOnEditClose}
        onEdit={handleEditProject}
        initialData={editingProject}
      />
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDelete}
        title={modals?.delete?.title ?? "Delete Project"}
        message={
          modals?.delete?.message?.replace(
            "{{name}}",
            projectToDelete?.name || "",
          ) ??
          `Are you sure you want to delete the project "${projectToDelete?.name}"?`
        }
        confirmText={modals?.delete?.confirmLabel ?? "Delete"}
        isDestructive={modals?.delete?.isDestructive ?? true}
      />
    </>
  );
};
