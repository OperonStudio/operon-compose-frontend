import { ChevronDown, FileEdit, X } from "@operonstudio/icons";

/** One entry in the CMS-driven "variable type" dropdown. */
interface TypeOption {
  value: string;
  label: string;
}

import { Box, Button, Chip, Dropdown, Input, Modal } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPageContentOptions } from "#/common/api/content-api";
import type { ModalConfig } from "#/common/api/interfaces";
import { activeScope, queryKeys } from "#/common/api/query-keys";
import { useActiveScope } from "#/common/use-active-scope";
import { ConfirmModal } from "#/components/confirm-modal";
import { Field } from "#/components/field";
import { useHeaderActions } from "#/contexts/header-actions";
import {
  type ContextVariable,
  createContextOptions,
  deleteContextOptions,
  getContextsOptions,
  updateContextOptions,
} from "./api";
import * as classes from "./style";

const ContextModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  modals,
  typeOptions,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: string) => void;
  initialData?: ContextVariable | null;
  modals?: Record<string, ModalConfig>;
  typeOptions: TypeOption[];
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setType(initialData.type);
      } else {
        setName("");
        setType("string");
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name, type);
    setName("");
    setType("string");
    onClose();
  };

  const modalConfig = initialData ? modals?.edit : modals?.create;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        modalConfig?.title ??
        (initialData ? "Edit Context Variable" : "Create Context Variable")
      }
      footer={
        <Box display="flex" justify="flex-end" gap={12}>
          <Button variant="outline" onClick={onClose}>
            {modalConfig?.cancelLabel ?? "Cancel"}
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalConfig?.submitLabel ?? (initialData ? "Save" : "Create")}
          </Button>
        </Box>
      }
    >
      <Box display="flex" direction="column" gap={16}>
        <Field
          label={modals?.create?.fields?.[0]?.label ?? "Name"}
          htmlFor="context-variable-name"
        >
          <Input
            id="context-variable-name"
            placeholder={
              modals?.create?.fields?.[0]?.placeholder ?? "e.g. x-page-name"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            autoFocus
          />
        </Field>
        <Field
          label={modals?.create?.fields?.[1]?.label ?? "Type"}
          id="context-variable-type-label"
        >
          <Dropdown
            containerStyle={{ width: "100%" }}
            onSelect={(val) => setType(val)}
            trigger={
              <Button
                variant="outline"
                aria-labelledby="context-variable-type-label"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Box display="flex" align="center">
                  {typeOptions.find((o) => o.value === type)?.label ??
                    type.charAt(0).toUpperCase() + type.slice(1)}
                </Box>
                <ChevronDown size={16} />
              </Button>
            }
            items={typeOptions}
          />
        </Field>
      </Box>
    </Modal>
  );
};

export const ContextPage = () => {
  // Subscribes to the active workspace and environment. The queries below
  // are keyed by them, so this component has to re-render when they resolve.
  useActiveScope();
  const queryClient = useQueryClient();
  const { data: variables = [] } = useQuery(getContextsOptions());
  const { data: pageData } = useQuery(getPageContentOptions("context"));
  const typeOptions = (pageData?.content?.typeOptions as
    | TypeOption[]
    | undefined) ?? [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "array", label: "Array" },
  ];
  const modals = pageData?.modals;

  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [editData, setEditData] = useState<ContextVariable | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = useMutation({
    ...createContextOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contexts(activeScope().workspaceId),
      });
    },
  });

  const updateMutation = useMutation({
    ...updateContextOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contexts(activeScope().workspaceId),
      });
    },
  });

  const deleteMutation = useMutation({
    ...deleteContextOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contexts(activeScope().workspaceId),
      });
      setDeleteId(null);
    },
  });

  useHeaderActions({
    create_context: () => {
      setEditData(null);
      setIsPromptOpen(true);
    },
  });

  const handleSubmit = (name: string, type: string) => {
    if (editData) {
      updateMutation.mutate({ id: editData.id, name, type });
    } else {
      createMutation.mutate({ name, type });
    }
  };

  return (
    <Box {...classes.contextListContainerStyle}>
      {variables.map((variable) => (
        <Box key={variable.id} {...classes.contextItemStyle}>
          <Box {...classes.contextNameStyle}>{variable.name}</Box>
          <Box {...classes.contextRightSectionStyle}>
            <Chip variant="subtle" color="primary">
              <Box style={{ fontWeight: 600 }}>{variable.type}</Box>
            </Chip>
            <Box {...classes.actionContainerStyle}>
              <Button
                variant="ghost"
                size="sm"
                title="Edit"
                style={{ padding: "8px", minWidth: 0 }}
                onClick={(e) => {
                  e.preventDefault();
                  setEditData(variable);
                  setIsPromptOpen(true);
                }}
              >
                <FileEdit size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                title="Delete"
                style={{ padding: "8px", minWidth: 0 }}
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteId(variable.id);
                }}
              >
                <X size={18} />
              </Button>
            </Box>
          </Box>
        </Box>
      ))}

      <ContextModal
        isOpen={isPromptOpen}
        onClose={() => {
          setIsPromptOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
        modals={modals}
        typeOptions={typeOptions}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title={modals?.delete?.title ?? "Delete Context Variable"}
        message={
          modals?.delete?.message ??
          "Are you sure you want to delete this context variable? This action cannot be undone."
        }
        confirmText={modals?.delete?.confirmLabel ?? "Delete"}
        isDestructive={modals?.delete?.isDestructive ?? true}
      />
    </Box>
  );
};
