import { FileEdit, Plus, X } from "@operonstudio/icons";
import { Box, Button, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPageContentOptions } from "#/common/api/content-api";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { resolveIcon } from "#/common/icon-map";
import { useActiveScope } from "#/common/use-active-scope";
import { ConfirmModal } from "#/components/confirm-modal";
import { useHeaderActions } from "#/contexts/header-actions";
import {
  createEnvironmentOptions,
  deleteEnvironmentOptions,
  getEnvironmentsOptions,
  updateEnvironmentOptions,
} from "./api";
import { DefineEnvironmentModal } from "./components/DefineEnvironmentModal";
import * as classes from "./style";
import type { Environment } from "./types";

export const EnvironmentsPage = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<Environment | null>(null);
  const [envToDelete, setEnvToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: environments = [], isLoading } = useQuery(
    getEnvironmentsOptions(),
  );
  const { data: pageData } = useQuery(getPageContentOptions("environments"));

  const emptyState = pageData?.content?.emptyState;
  const modals = pageData?.modals;
  const EmptyStateIcon = resolveIcon(emptyState?.icon);

  const { mutate: createEnvironment } = useMutation({
    ...createEnvironmentOptions,
    onSuccess: () => {
      toast.success("Environment created successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.environments(activeScope().workspaceId),
      });
    },
    onError: () => toast.error("Failed to create environment."),
  });

  const { mutate: updateEnvironment } = useMutation({
    ...updateEnvironmentOptions,
    onSuccess: () => {
      toast.success("Environment updated successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.environments(activeScope().workspaceId),
      });
    },
    onError: () => toast.error("Failed to update environment."),
  });

  const { mutate: deleteEnvironment, isPending: isDeleting } = useMutation({
    ...deleteEnvironmentOptions,
    onSuccess: () => {
      toast.success("Environment deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.environments(activeScope().workspaceId),
      });
      setEnvToDelete(null);
    },
    onError: () => toast.error("Failed to delete environment."),
  });

  useHeaderActions({
    create_env: () => {
      setSelectedEnvironment(null);
      setIsModalOpen(true);
    },
  });

  const handleSave = (envData: Partial<Environment>) => {
    if (envData.id) {
      updateEnvironment({
        id: envData.id,
        req: { name: envData.name, description: envData.description },
      });
    } else {
      createEnvironment({
        name: envData.name || "",
        description: envData.description,
      });
    }
  };

  if (isLoading) {
    return <Box {...classes.pageContainerStyle}>Loading Environments...</Box>;
  }

  const isEmpty = !environments || environments.length === 0;

  return (
    <Box {...classes.pageContainerStyle}>
      {isEmpty ? (
        /* ── Empty state ── */
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "20px",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <Box
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background:
                "var(--operon-color-primary-ghost, rgba(211, 58, 92, 0.08))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmptyStateIcon
              size={32}
              color="var(--operon-color-primary, #d33a5c)"
            />
          </Box>
          <Box>
            <Box
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--operon-color-text)",
                marginBottom: "8px",
              }}
            >
              {emptyState?.title ?? "No environments yet"}
            </Box>
            <Box
              style={{
                fontSize: "14px",
                color: "var(--operon-color-text-muted)",
                maxWidth: "420px",
                lineHeight: 1.6,
              }}
            >
              {/* Rendered as text: this copy comes from a Compose collection,
                  which any workspace editor can change, so it must not be able
                  to inject markup into the console. */}
              {emptyState?.description ??
                "Environments are deployment targets such as development, staging or production. Every project lives inside one, and you need at least one before you can generate API keys."}
            </Box>
          </Box>
          <Button
            onClick={() => {
              setSelectedEnvironment(null);
              setIsModalOpen(true);
            }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Plus size={16} />
            {emptyState?.actionLabel ?? "Create First Environment"}
          </Button>
        </Box>
      ) : (
        /* ── Environment grid ── */
        <Box
          display="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {environments.map((env) => (
            <Box key={env.id} {...classes.environmentCardStyle}>
              <Box>
                <Box {...classes.environmentNameStyle}>{env.name}</Box>
                <Box {...classes.environmentDescriptionStyle}>
                  {env.description}
                </Box>
              </Box>

              <Box {...classes.environmentActionsStyle}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEnvironment(env);
                    setIsModalOpen(true);
                  }}
                  aria-label="Edit environment"
                >
                  <FileEdit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEnvToDelete(env.id)}
                  aria-label="Delete environment"
                >
                  <X size={16} color="var(--operon-color-error, #dc2626)" />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <DefineEnvironmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        environment={selectedEnvironment}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={!!envToDelete}
        onClose={() => setEnvToDelete(null)}
        onConfirm={() => {
          if (envToDelete) deleteEnvironment(envToDelete);
        }}
        title={modals?.delete?.title ?? "Delete Environment"}
        message={
          modals?.delete?.message ??
          "Are you sure you want to delete this environment? Any API keys linked to it will stop working."
        }
        confirmText={
          isDeleting
            ? "Deleting..."
            : (modals?.delete?.confirmLabel ?? "Delete")
        }
        isDestructive={modals?.delete?.isDestructive ?? true}
      />
    </Box>
  );
};
