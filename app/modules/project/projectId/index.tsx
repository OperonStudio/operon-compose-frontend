import { Copy } from "@operonstudio/icons";
import { Box, Button, Tabs, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { getActiveScope } from "#/common/active-scope";
import { queryKeys } from "#/common/api/query-keys";
import { useActiveScope } from "#/common/use-active-scope";
import { PromptModal } from "#/components/prompt-modal";
import { useHeaderActions } from "#/contexts/header-actions";
import { useActiveEnvironment } from "#/modules/environments/hooks";
import {
  type Collection,
  createCollectionOptions,
  getCollectionOptions,
  getCollectionsOptions,
} from "./api";
import { ContentEditor } from "./components/ContentEditor";
import { HistoryPanel } from "./components/HistoryPanel";
import { PromotePanel } from "./components/PromotePanel";
import {
  getDiffOptions,
  getVersionsOptions,
  promoteOptions,
  rollbackOptions,
  saveVersionOptions,
  type Variant,
} from "./content-api";
import * as classes from "./style";

const DELIVERY_BASE_URL =
  import.meta.env.VITE_OPERON_COMPOSE_BACKEND_URL ??
  "https://operon-compose-backend.onrender.com";

export const ProjectIdPage = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const { projectId } = useParams({ from: "/projects/$projectId/" });
  const queryClient = useQueryClient();
  const { environments, activeEnvironment } = useActiveEnvironment();

  const { data: collections = [] } = useQuery(getCollectionsOptions(projectId));

  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
    null,
  );
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promoteTarget, setPromoteTarget] = useState<string | null>(null);

  // Derive the selection from the fetched list rather than snapshotting it:
  // `collections` is empty on first render, so a state initialiser would pin
  // the selection to null and leave the editor blank until the user clicked.
  const selected: Collection | null =
    collections.find((c) => c.id === activeCollectionId) ??
    collections[0] ??
    null;
  const collectionId = selected?.id ?? "";

  const { data: view } = useQuery(
    getCollectionOptions(projectId, collectionId),
  );
  const { data: versions = [], isLoading: versionsLoading } = useQuery(
    getVersionsOptions(projectId, collectionId),
  );
  const { data: diff, isLoading: diffLoading } = useQuery(
    getDiffOptions(projectId, collectionId, promoteTarget),
  );

  // Content, history and the diff all move together, so they are invalidated
  // together after any write.
  const refreshContent = () => {
    const { workspaceId, environmentId } = getActiveScope();
    queryClient.invalidateQueries({
      queryKey: queryKeys.collections(workspaceId, environmentId, projectId),
    });
  };

  const createCollection = useMutation({
    ...createCollectionOptions(projectId),
    onSuccess: (created) => {
      refreshContent();
      if (created.id) setActiveCollectionId(created.id);
    },
    onError: (err: Error) =>
      toast.error(err.message || "Could not create the collection"),
  });

  const saveVersion = useMutation({
    ...saveVersionOptions(projectId, collectionId),
    onSuccess: (published) => {
      refreshContent();
      toast.success(`Published v${published.version}`);
    },
    onError: (err: Error) => toast.error(err.message || "Could not publish"),
  });

  const promote = useMutation({
    ...promoteOptions(projectId, collectionId),
    onSuccess: (published) => {
      refreshContent();
      const name =
        environments.find((e) => e.id === published.environmentId)?.name ??
        "the target environment";
      toast.success(`Promoted to ${name} as v${published.version}`);
    },
    onError: (err: Error) => toast.error(err.message || "Could not promote"),
  });

  const rollback = useMutation({
    ...rollbackOptions(projectId, collectionId),
    onSuccess: (published) => {
      refreshContent();
      toast.success(`Restored as v${published.version}`);
    },
    onError: (err: Error) => toast.error(err.message || "Could not restore"),
  });

  useHeaderActions({
    "add-new-collection": () => setIsPromptOpen(true),
  });

  // A project spans every environment and a collection keeps one name, so this
  // URL is the same everywhere. Only the API key differs, and the key is what
  // selects which environment's content comes back.
  //
  // The key is never in the URL: keys are stored hashed, and a secret in a URL
  // ends up in browser history, proxy logs and referrer headers.
  const deliveryUrl = selected
    ? `${DELIVERY_BASE_URL}/api/content/${projectId}/${collectionId}`
    : "";

  const copyApiUrl = () => {
    if (!deliveryUrl) return;
    navigator.clipboard.writeText(deliveryUrl);
    toast.success(
      "Copied. Send your API key as an x-Operon-key header when you call it.",
    );
  };

  const variants: Variant[] = view?.variants?.length
    ? view.variants
    : [{ key: "default", data: {} }];

  return (
    <Box {...classes.pageContainerStyle}>
      <aside {...classes.sidebarStyle}>
        <Box {...classes.sidebarTitleStyle}>Collections</Box>
        <Box {...classes.collectionListStyle}>
          {collections.map((col) => {
            const isActive = col.id === collectionId;
            return (
              <Box
                key={col.id}
                {...classes.collectionItemStyle}
                style={{
                  backgroundColor: isActive
                    ? "var(--operon-color-surface-raised)"
                    : undefined,
                  color: isActive ? "var(--operon-color-primary)" : undefined,
                  borderColor: isActive
                    ? "var(--operon-color-primary)"
                    : undefined,
                }}
                onClick={() => col.id && setActiveCollectionId(col.id)}
              >
                {col.name}
              </Box>
            );
          })}
        </Box>
      </aside>

      <Box {...classes.contentAreaStyle}>
        {selected ? (
          <Box {...classes.workspaceStyle}>
            <Box {...classes.toolbarStyle}>
              <Box {...classes.toolbarTitleGroupStyle}>
                <Box {...classes.titleStyle}>{selected.name}</Box>
                {/* Which environment you are editing is the single most
                    important thing to be sure of on this screen. */}
                <Box {...classes.envBadgeStyle}>
                  {activeEnvironment?.name ?? "no environment"}
                </Box>
              </Box>
              <Button
                variant="outline"
                size="sm"
                onClick={copyApiUrl}
                title={deliveryUrl}
                style={{ gap: 6 }}
              >
                <Copy size={15} /> Copy API URL
              </Button>
            </Box>

            <Tabs
              style={{ width: "100%" }}
              tabs={[
                {
                  label: "Content",
                  content: (
                    <ContentEditor
                      variants={variants}
                      version={view?.version ?? 0}
                      isSaving={saveVersion.isPending}
                      onSave={(next, note) =>
                        saveVersion.mutate({ variants: next, note })
                      }
                    />
                  ),
                },
                {
                  label: `History${versions.length ? ` (${versions.length})` : ""}`,
                  content: (
                    <HistoryPanel
                      projectId={projectId}
                      collectionId={collectionId}
                      versions={versions}
                      isLoading={versionsLoading}
                      isRollingBack={rollback.isPending}
                      onRollback={(version) => rollback.mutate({ version })}
                    />
                  ),
                },
                {
                  label: "Promote",
                  content: (
                    <PromotePanel
                      environments={environments}
                      currentEnvironmentId={activeEnvironment?.id ?? ""}
                      target={promoteTarget}
                      onTargetChange={setPromoteTarget}
                      diff={diff}
                      isLoadingDiff={diffLoading}
                      isPromoting={promote.isPending}
                      onPromote={() =>
                        promoteTarget &&
                        promote.mutate({ targetEnvironmentId: promoteTarget })
                      }
                    />
                  ),
                },
              ]}
            />
          </Box>
        ) : (
          <Box {...classes.emptyStyle}>
            This project has no collections yet. Add one to start serving
            content.
          </Box>
        )}
      </Box>

      <PromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onSubmit={(name) =>
          createCollection.mutate({ name: name.trim(), data: {} })
        }
        title="Add a collection"
        message="Collections are addressed by name in the delivery URL, so pick something stable."
        placeholder="hero"
      />
    </Box>
  );
};
