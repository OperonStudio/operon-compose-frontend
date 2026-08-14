import { PromptModal } from "#/components/prompt-modal";
import { useHeaderActions } from "#/contexts/header-actions";
import { getApiKeysOptions } from "#/modules/api-keys/api";
import { useActiveEnvironment } from "#/modules/environments/hooks";
import { Copy } from "@operon/icons";
import { Box, Button, Dropdown, Sidebar, Textarea, toast } from "@operon/ui";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  type Collection,
  createCollectionOptions,
  getCollectionsOptions,
  updateCollectionOptions,
} from "./api";
import * as classes from "./style";

export const ProjectIdPage = () => {
  const { projectId } = useParams({ from: "/projects/$projectId/" });
  const queryClient = useQueryClient();
  const { environments } = useActiveEnvironment();

  // Fetch API keys to include in the copied delivery URL
  const { data: projectsWithKeys = [] } = useQuery(getApiKeysOptions());
  const apiKeysForThisProject =
    projectsWithKeys.find((p) => p.id === projectId)?.keys ?? [];

  const { data: collections = [] } = useSuspenseQuery(
    getCollectionsOptions(projectId),
  );

  const [activeCollection, setActiveCollection] = useState<Collection | null>(
    collections[0] || null,
  );
  const [schemaText, setSchemaText] = useState("");
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  const createCollection = useMutation({
    ...createCollectionOptions(projectId),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "collections"],
      });
      setActiveCollection(data);
    },
  });

  const updateCollection = useMutation({
    ...updateCollectionOptions(projectId, activeCollection?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "collections"],
      });
      toast.success("Collection saved!");
    },
  });

  useHeaderActions({
    "add-new-collection": () => {
      setIsPromptOpen(true);
    },
  });

  const handleCreateCollection = (name: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    (createCollection.mutate as any)({ id, name, data: {} });
  };

  useEffect(() => {
    if (activeCollection && activeCollection.data) {
      setSchemaText(JSON.stringify(activeCollection.data, null, 2));
    } else {
      setSchemaText("{}");
    }
  }, [activeCollection]);

  const handleSave = () => {
    if (!activeCollection) return;
    try {
      const schema = JSON.parse(schemaText);
      updateCollection.mutate(schema);
    } catch (e) {
      toast.error("Invalid JSON format");
    }
  };

  const handleCopyApiUrl = (environmentId: string) => {
    if (!activeCollection) return;

    // Find the API key value for this environment
    const apiKey = apiKeysForThisProject.find(
      (k) => k.environment === environmentId || (k as any).environmentId === environmentId,
    );
    const baseUrl = import.meta.env.VITE_OPERON_COMPOSE_BACKEND_URL;
    let url = `${baseUrl}/api/content/${projectId}/${activeCollection.id}?environmentId=${environmentId}`;
    if (apiKey) {
      url += `&x-Operon-key=${apiKey.value}`;
    }
    navigator.clipboard.writeText(url);
    toast.success(
      apiKey
        ? "Copied API URL with key!"
        : "Copied URL (no API key found for this env)",
    );
  };

  return (
    <Box {...classes.pageContainerStyle}>
      <Sidebar
        variant="permanent"
        placement="left"
        isOpen={true}
        onClose={() => {}}
        {...classes.sidebarStyle}
      >
        <Box
          display="flex"
          align="center"
          justify="space-between"
          style={{ marginBottom: "16px", padding: "0 8px" }}
        >
          <Box {...classes.sidebarTitleStyle}>Collections</Box>
        </Box>

        <Box {...classes.collectionListStyle}>
          {collections.map((col) => (
            <Box
              key={col.id}
              {...classes.collectionItemStyle}
              style={{
                backgroundColor:
                  activeCollection?.id === col.id
                    ? "var(--operon-color-surface-raised, #f0f0f0)"
                    : undefined,
                color:
                  activeCollection?.id === col.id
                    ? "var(--operon-color-primary)"
                    : undefined,
                fontWeight: activeCollection?.id === col.id ? "500" : "normal",
              }}
              onClick={() => setActiveCollection(col)}
            >
              <Box display="flex" align="center" gap={8}>
                {col.name}
              </Box>
            </Box>
          ))}
        </Box>
      </Sidebar>

      <Box {...classes.contentAreaStyle}>
        {activeCollection ? (
          <Box
            display="flex"
            direction="column"
            style={{ height: "100%", gap: "24px" }}
          >
            <Box display="flex" justify="space-between" align="center">
              <Box {...classes.titleStyle}>{activeCollection.name}</Box>
              <Box display="flex" align="center" gap={12}>
                <Dropdown
                  onSelect={handleCopyApiUrl}
                  placement="bottom-end"
                  trigger={
                    <Button variant="outline">
                      <Copy size={16} />
                    </Button>
                  }
                  items={environments.map((env) => ({
                    value: env.id,
                    label: env.name,
                  }))}
                />
                <Button
                  onClick={handleSave}
                  disabled={updateCollection.isPending}
                >
                  {updateCollection.isPending ? "Saving..." : "Save Schema"}
                </Button>
              </Box>
            </Box>
            <Box style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Textarea
                fullHeight
                placeholder='Paste your JSON content here e.g. {"title": "Hello", "visible": true}'
                style={{
                  resize: "none",
                  minHeight: "300px",
                  fontFamily: "monospace",
                }}
                value={schemaText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setSchemaText(e.target.value)
                }
              />
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            direction="column"
            align="center"
            justify="center"
            style={{ height: "100%", color: "var(--operon-color-text-muted)" }}
          >
            Select a collection from the sidebar or click "Add New Collection".
          </Box>
        )}
      </Box>

      <PromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onSubmit={handleCreateCollection}
        title="Add New Collection"
        message="Enter a name for the new collection:"
        placeholder="Collection Name"
      />
    </Box>
  );
};
