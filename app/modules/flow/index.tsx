import { getPageContentOptions } from "#/common/api/content-api";
import { resolveIcon } from "#/common/icon-map";
import { getProjectsOptions } from "#/modules/project/api";
import { getCollectionsOptions } from "#/modules/project/projectId/api";
import { getRulesOptions } from "#/modules/rule-engine/collection/api";
import {
  Boxes,
  ChevronDown,
  FolderKanban,
  GitBranch,
  User,
} from "@operon/icons";
import { Box, Button, Dropdown, FlowBoard } from "@operon/ui";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import * as classes from "./style";

export const FlowPage = () => {
  const { data: projects } = useQuery(getProjectsOptions);
  const { data: pageData } = useSuspenseQuery(getPageContentOptions("flow"));

  const labels = pageData.content.labels;
  const emptyState = pageData.content.emptyState;
  const EmptyStateIcon = resolveIcon(emptyState?.icon);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    ...getCollectionsOptions(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const { data: rules } = useQuery({
    ...getRulesOptions(selectedProjectId, selectedCollectionId),
    enabled: !!selectedProjectId && !!selectedCollectionId,
  });

  const selectedProject = projects?.find(
    (p: any) => (p.id || p.name) === selectedProjectId,
  );
  const selectedCollection = collections?.find(
    (c: any) => c.id === selectedCollectionId,
  );

  return (
    <Box
      {...classes.pageContainerStyle}
      style={{ flexDirection: "column", padding: "40px 60px" }}
    >
      <Box {...classes.cardStyle} style={{ flexDirection: "column" }}>
        <Box display="flex" gap="32px" align="center">
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flex: 1,
              maxWidth: "300px",
            }}
          >
            <Box
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--operon-color-text)",
              }}
            >
              {labels?.projectDropdown ?? "Project"}
            </Box>
            <Dropdown
              onSelect={(val) => {
                setSelectedProjectId(val);
                setSelectedCollectionId("");
              }}
              trigger={
                <Button
                  variant="outline"
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                  }}
                >
                  {selectedProject
                    ? selectedProject.name
                    : (labels?.selectProject ?? "Select a Project...")}
                  <ChevronDown size={14} />
                </Button>
              }
              items={
                projects?.map((p: any) => ({
                  value: p.id || p.name,
                  label: p.name,
                })) || []
              }
            />
          </Box>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              flex: 1,
              maxWidth: "300px",
            }}
          >
            <Box
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--operon-color-text)",
              }}
            >
              {labels?.collectionDropdown ?? "Collection"}
            </Box>
            <Dropdown
              onSelect={(val) => setSelectedCollectionId(val)}
              trigger={
                <Button
                  variant="outline"
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                  }}
                  disabled={!selectedProjectId || collectionsLoading}
                >
                  {selectedCollection
                    ? selectedCollection.name
                    : collectionsLoading
                      ? (labels?.loading ?? "Loading...")
                      : (labels?.selectCollection ?? "Select a Collection...")}
                  <ChevronDown size={14} />
                </Button>
              }
              items={
                collections?.map((c: any) => ({
                  value: c.id,
                  label: c.name,
                })) || []
              }
            />
          </Box>
        </Box>
      </Box>

      {selectedProject && selectedCollection ? (
        <Box
          {...classes.cardStyle}
          style={{ backgroundColor: "#f8fafc", flexDirection: "column" }}
        >
          <Box
            style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "40px",
              color: "var(--operon-color-text)",
            }}
          >
            {labels?.flowTitle ?? "Request Flow Path"}
          </Box>

          <Box
            style={{
              height: "500px",
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid var(--operon-color-border)",
            }}
          >
            <FlowBoard
              nodes={[
                {
                  id: "1",
                  type: "operonCustom",
                  position: { x: 50, y: 150 },
                  data: {
                    icon: <User size={32} />,
                    label: labels?.endUser ?? "End User",
                    sublabel: labels?.apiClient ?? "API Client",
                  },
                },
                {
                  id: "2",
                  type: "operonCustom",
                  position: { x: 350, y: 150 },
                  data: {
                    icon: <FolderKanban size={32} />,
                    label: `${selectedProject.name} Rules`,
                    sublabel:
                      labels?.noRulesConfigured ?? "No Rules Configured",
                    disabled: true,
                  },
                },
                {
                  id: "3",
                  type: "operonCustom",
                  position: { x: 650, y: 150 },
                  data: {
                    icon: <GitBranch size={32} />,
                    label: `${selectedCollection.name} Rules`,
                    sublabel:
                      rules && rules.length > 0
                        ? (labels?.rulesConfigured?.replace(
                            "{{count}}",
                            String(rules.length),
                          ) ?? `${rules.length} Rule(s) Configured`)
                        : (labels?.noRulesConfigured ?? "No Rules Configured"),
                    disabled: !rules || rules.length === 0,
                  },
                },
                {
                  id: "4",
                  type: "operonCustom",
                  position: { x: 950, y: 150 },
                  data: {
                    icon: <Boxes size={32} />,
                    label: `${selectedCollection.name} Data`,
                    sublabel:
                      labels?.contentDelivery ?? "Content Delivery Payload",
                  },
                },
              ]}
              edges={[
                { id: "e1-2", source: "1", target: "2" },
                { id: "e2-3", source: "2", target: "3" },
                { id: "e3-4", source: "3", target: "4" },
              ]}
              height="100%"
            />
          </Box>
        </Box>
      ) : (
        <Box
          {...classes.cardStyle}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "100px 48px",
            color: "var(--operon-color-text-muted)",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            style={{
              color: "var(--operon-color-border)",
              marginBottom: "20px",
            }}
          >
            <EmptyStateIcon size={48} />
          </Box>
          <Box
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "var(--operon-color-text)",
            }}
          >
            {emptyState?.title ?? "No Selection Made"}
          </Box>
          <Box style={{ fontSize: "14px", marginTop: "8px" }}>
            {emptyState?.description ??
              "Select a project and collection from the dropdowns above to visualize its routing flow."}
          </Box>
        </Box>
      )}
    </Box>
  );
};
