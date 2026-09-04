import { Box, Button, Input, Modal, toast } from "@operonstudio/ui";
import { useEffect, useState } from "react";
import { Field } from "#/components/field";
import type { Environment } from "../types";

interface DefineEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  environment?: Environment | null;
  onSave?: (env: Partial<Environment>) => void;
}

export const DefineEnvironmentModal = ({
  isOpen,
  onClose,
  environment,
  onSave,
}: DefineEnvironmentModalProps) => {
  const [name, setName] = useState(environment?.name || "");
  const [description, setDescription] = useState(
    environment?.description || "",
  );

  useEffect(() => {
    if (isOpen) {
      setName(environment?.name || "");
      setDescription(environment?.description || "");
    }
  }, [environment, isOpen]);

  const handleSave = () => {
    if (!name) {
      toast.error("Please enter an environment name.");
      return;
    }

    if (onSave) {
      onSave({
        id: environment?.id,
        name,
        description,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={environment ? "Edit Environment" : "Create Environment"}
      footer={
        <Box
          display="flex"
          justify="flex-end"
          gap="12px"
          style={{ width: "100%" }}
        >
          <Button
            variant="outline"
            onClick={onClose}
            style={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            style={{ fontWeight: 600 }}
          >
            Save Environment
          </Button>
        </Box>
      }
    >
      <Box display="flex" direction="column" gap="24px">
        <Box
          style={{
            background: "var(--operon-color-surface)",
            border: "1px solid var(--operon-color-border)",
            borderRadius: "var(--operon-radius-lg, 14px)",
            padding: "24px",
          }}
        >
          <Box display="flex" direction="column" gap="20px">
            <Field label="Environment name" htmlFor="environment-name" required>
              <Input
                id="environment-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. staging, production"
              />
            </Field>
            <Field label="Description" htmlFor="environment-description">
              <Input
                id="environment-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this environment is for"
              />
            </Field>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
