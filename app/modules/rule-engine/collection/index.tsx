import { Box, Button, Tabs, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getContextsOptions } from "../../context-module/api";

import {
  createRuleOptions,
  createProjectRuleOptions,
  deleteRuleOptions,
  deleteProjectRuleOptions,
  getRulesOptions,
  getProjectRulesOptions,
  updateRuleOptions,
  updateProjectRuleOptions,
} from "./api";
import { AttributesModal } from "./components/AttributesModal";
import { AttributesSection } from "./components/AttributesSection";
import { DecisionList } from "./components/DecisionList";
import { DefineDecisionModal } from "./components/DefineDecisionModal";
import type { Decision } from "./types";

export const RuleEngineCollectionPage = ({
  projectId: _projectId,
  collectionId: _collectionId,
  isProjectLevel = false,
}: {
  projectId: string;
  collectionId: string;
  isProjectLevel?: boolean;
}) => {
  const queryClient = useQueryClient();
  const rulesQueryKey = isProjectLevel
    ? ["rules", _projectId, "__project__"]
    : ["rules", _projectId, _collectionId];

  const { data: allContextVariables = [] } = useQuery(getContextsOptions);

  const { data: decisions = [], isLoading } = useQuery(
    isProjectLevel
      ? getProjectRulesOptions(_projectId)
      : getRulesOptions(_projectId, _collectionId),
  );

  const { mutate: createDecision } = useMutation({
    ...(isProjectLevel ? createProjectRuleOptions : createRuleOptions),
    onSuccess: () => {
      toast.success("Decision created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: rulesQueryKey });
    },
  });

  const { mutate: updateDecision } = useMutation({
    ...(isProjectLevel ? updateProjectRuleOptions : updateRuleOptions),
    onSuccess: () => {
      toast.success("Decision updated successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: rulesQueryKey });
    },
  });

  const { mutate: deleteDecision } = useMutation({
    ...(isProjectLevel ? deleteProjectRuleOptions : deleteRuleOptions),
    // Optimistic update: remove from cache immediately so UI doesn't wait
    onMutate: async ({ ruleId }) => {
      await queryClient.cancelQueries({ queryKey: rulesQueryKey });
      const previous = queryClient.getQueryData<Decision[]>(rulesQueryKey);
      queryClient.setQueryData<Decision[]>(rulesQueryKey, (old) =>
        (old ?? []).filter((d) => d.id !== ruleId),
      );
      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(rulesQueryKey, context.previous);
      }
      toast.error("Failed to delete decision");
    },
    onSuccess: () => {
      toast.success("Decision deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: rulesQueryKey });
    },
  });

  const [selectedAttributeIds, setSelectedAttributeIds] = useState<string[]>(
    [],
  );
  const [isAttributesModalOpen, setIsAttributesModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null);

  const selectedAttributes = allContextVariables.filter((v) =>
    selectedAttributeIds.includes(v.id),
  );

  const handleToggleAttribute = (id: string) => {
    const newIds = selectedAttributeIds.includes(id)
      ? selectedAttributeIds.filter((item) => item !== id)
      : [...selectedAttributeIds, id];
    setSelectedAttributeIds(newIds);
  };

  const handleEditDecision = (decision: Decision) => {
    setEditingDecision(decision);
    setIsDecisionModalOpen(true);
  };

  const handleNewDecision = () => {
    setEditingDecision(null);
    setIsDecisionModalOpen(true);
  };

  const handleDeleteDecision = (id: string) => {
    deleteDecision({
      projectId: _projectId,
      collectionId: _collectionId,
      ruleId: id,
    });
  };

  const handleSaveDecision = (decision: Partial<Decision>) => {
    if (decision.id) {
      updateDecision({
        projectId: _projectId,
        collectionId: _collectionId,
        ruleId: decision.id,
        rule: decision,
      });
    } else {
      createDecision({
        projectId: _projectId,
        collectionId: _collectionId,
        rule: decision,
      });
    }
  };

  return (
    <Box
      display="flex"
      direction="column"
      style={{
        padding: "40px",
        gap: "32px",
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Tabs
        style={{ width: "100%" }}
        tabs={[
          {
            label: "Attributes",
            content: (
              <Box style={{ paddingTop: "24px" }}>
                <AttributesSection
                  selectedAttributes={selectedAttributes}
                  onRemoveAttribute={handleToggleAttribute}
                  onAddClick={() => setIsAttributesModalOpen(true)}
                />
              </Box>
            ),
          },
          {
            label: "Decisions",
            content: (
              <Box
                style={{
                  paddingTop: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {isLoading ? (
                  <Box>Loading decisions...</Box>
                ) : (
                  <DecisionList
                    decisions={decisions}
                    onEditDecision={handleEditDecision}
                    onDeleteDecision={handleDeleteDecision}
                  />
                )}
                {/* Footer Actions */}
                <Box
                  display="flex"
                  justify="flex-end"
                  gap="16px"
                  style={{
                    marginTop: "32px",
                    padding: "32px 0",
                    borderTop: "1px solid var(--operon-color-border)",
                  }}
                >
                  <Button
                    variant="outline"
                    onClick={handleNewDecision}
                    style={{ fontWeight: 600, padding: "10px 20px" }}
                  >
                    Define Decision +
                  </Button>
                  <Button
                    variant="primary"
                    style={{ fontWeight: 600, padding: "10px 24px" }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            ),
          },
        ]}
      />

      {/* Modals */}
      <AttributesModal
        isOpen={isAttributesModalOpen}
        onClose={() => setIsAttributesModalOpen(false)}
        allAttributes={allContextVariables}
        selectedAttributeIds={selectedAttributeIds}
        onToggleAttribute={handleToggleAttribute}
      />

      <DefineDecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => {
          setIsDecisionModalOpen(false);
          setEditingDecision(null);
        }}
        decision={editingDecision}
        onSave={handleSaveDecision}
        selectedAttributes={selectedAttributes}
      />
    </Box>
  );
};
